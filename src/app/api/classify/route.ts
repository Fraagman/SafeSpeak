import { NextResponse } from "next/server";

import { classifyHeuristic, type ClassifyResult } from "@/lib/ai";

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

const MAX_TEXT_LENGTH = 4000;

type DeepSeekClassifyResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

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

    const normalizedText = text.slice(0, MAX_TEXT_LENGTH);
    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
      const fallback = classifyHeuristic(normalizedText);
      return NextResponse.json(fallback, { status: 200 });
    }

    let result: ClassifyResult | undefined;

    try {
      const response = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-reasoner",
          temperature: 0.2,
          messages: [
            { role: "system", content: "Return only valid JSON. No explanations." },
            {
              role: "user",
              content:
                '{ "tags": string[], "severity": number, "urgency": "low"|"medium"|"high"|"immediate", "summary": string } ONLY. Text: """' +
                `${normalizedText}` +
                '"""',
            },
          ],
        }),
      });

      if (response.ok) {
        const data = (await response.json()) as DeepSeekClassifyResponse;
        const content = data?.choices?.[0]?.message?.content;

        if (typeof content === "string") {
          try {
            const parsed = JSON.parse(content) as Partial<ClassifyResult>;
            if (isValidResult(parsed)) {
              result = {
                tags: parsed.tags.slice(0, 5),
                severity: clampSeverity(parsed.severity),
                urgency: parsed.urgency,
                summary: parsed.summary,
              };
            }
          } catch (error) {
            console.error("DeepSeek classify parse error:", error instanceof Error ? error.message : error);
          }
        }
      }
    } catch (error) {
      console.error("DeepSeek classify request error:", error instanceof Error ? error.message : error);
    }

    if (!result) {
      result = classifyHeuristic(normalizedText);
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Classify route error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}

function clampSeverity(value: number): number {
  if (Number.isFinite(value)) {
    if (value < 1) {
      return 1;
    }
    if (value > 5) {
      return 5;
    }
    return Math.round(value);
  }
  return 2;
}

function isValidResult(candidate: Partial<ClassifyResult>): candidate is ClassifyResult {
  if (!candidate) {
    return false;
  }

  if (!Array.isArray(candidate.tags) || candidate.tags.some((tag) => typeof tag !== "string")) {
    return false;
  }

  if (typeof candidate.severity !== "number") {
    return false;
  }

  if (!isValidUrgency(candidate.urgency)) {
    return false;
  }

  if (typeof candidate.summary !== "string" || candidate.summary.trim().length === 0) {
    return false;
  }

  return true;
}

function isValidUrgency(value: unknown): value is ClassifyResult["urgency"] {
  return value === "low" || value === "medium" || value === "high" || value === "immediate";
}
