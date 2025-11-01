import { NextResponse } from "next/server";

import { basicScrub, type RedactResult } from "@/lib/ai";

type DeepSeekResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

function methodNotAllowed() {
  return new NextResponse("Method not allowed.", {
    status: 405,
    headers: {
      Allow: "POST",
    },
  });
}

export const GET = methodNotAllowed;
export const PUT = methodNotAllowed;
export const DELETE = methodNotAllowed;

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json({ error: "content-type must be application/json" }, { status: 400 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "invalid json" }, { status: 400 });
    }

    if (typeof body !== "object" || body === null) {
      return NextResponse.json({ error: "body must be an object" }, { status: 400 });
    }

    const { text } = body as { text?: unknown };
    if (typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json({ error: "text must be a non-empty string" }, { status: 400 });
    }

    const snippet = text.slice(0, 4000);
    const baseline = basicScrub(snippet);
    let result: RedactResult = baseline;

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (apiKey) {
      try {
        const response = await fetch("https://api.deepseek.com/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "deepseek-reasoner",
            temperature: 0.1,
            messages: [
              { role: "system", content: "Return only valid JSON. No explanations." },
              {
                role: "user",
                content:
                  'Redact remaining PII (names of private individuals, exact street addresses, license plates). Do not redact organizations/job roles unless they identify a private person. Return STRICT JSON: { "redacted": string, "entities": [ { "type": string, "text": string } ] } Text: """' +
                  `${baseline.redacted}` +
                  '"""',
              },
            ],
          }),
        });

        if (response.ok) {
          const data = (await response.json()) as DeepSeekResponse;
          const content = data?.choices?.[0]?.message?.content;

          if (typeof content === "string") {
            try {
              const parsed = JSON.parse(content) as Partial<RedactResult>;
              if (
                typeof parsed.redacted === "string" &&
                Array.isArray(parsed.entities) &&
                parsed.entities.every(
                  (entity) =>
                    entity !== null &&
                    typeof entity === "object" &&
                    typeof (entity as { type?: unknown }).type === "string" &&
                    typeof (entity as { text?: unknown }).text === "string",
                )
              ) {
                result = {
                  redacted: parsed.redacted,
                  entities: parsed.entities.map((entity) => ({
                    type: (entity as { type: string }).type,
                    text: (entity as { text: string }).text,
                  })),
                };
              }
            } catch (parseError) {
              console.error("DeepSeek parse error:", parseError instanceof Error ? parseError.message : parseError);
            }
          }
        }
      } catch (error) {
        console.error("DeepSeek request error:", error instanceof Error ? error.message : error);
      }
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Redact route error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
