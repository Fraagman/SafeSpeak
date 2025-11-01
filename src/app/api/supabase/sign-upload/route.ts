import { NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabaseServer";

const BUCKET_ID = "evidence";
const PATH_PREFIX = "evidence/";
const MIN_PATH_LENGTH = 8;
const MAX_PATH_LENGTH = 300;
const DEFAULT_EXPIRES_IN = 300; // seconds

function validatePath(path: unknown): string {
  if (typeof path !== "string") {
    throw new Error("`path` must be a string.");
  }

  const trimmed = path.trim();

  if (trimmed.length < MIN_PATH_LENGTH || trimmed.length > MAX_PATH_LENGTH) {
    throw new Error("`path` length must be between 8 and 300 characters.");
  }

  if (!trimmed.startsWith(PATH_PREFIX)) {
    throw new Error("`path` must start with \"evidence/\" prefix.");
  }

  return trimmed;
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json(
      { error: "Content-Type must be application/json." },
      { status: 400 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json(
      { error: "Request body must be a JSON object." },
      { status: 400 },
    );
  }

  const { path, expiresIn, upsert } = body as {
    path?: unknown;
    expiresIn?: unknown;
    upsert?: unknown;
  };

  let safePath: string;
  try {
    safePath = validatePath(path);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid path." },
      { status: 400 },
    );
  }

  let effectiveExpiresIn = DEFAULT_EXPIRES_IN;
  if (typeof expiresIn === "number" && Number.isFinite(expiresIn) && expiresIn > 0) {
    effectiveExpiresIn = Math.floor(expiresIn);
  }

  const shouldUpsert = typeof upsert === "boolean" ? upsert : true;

  try {
    const admin = getSupabaseAdmin();
    const { data, error } = await admin.storage
      .from(BUCKET_ID)
      .createSignedUploadUrl(safePath, effectiveExpiresIn, { upsert: shouldUpsert });

    if (error) {
      console.error("Supabase signed upload URL error:", error.message);
      return NextResponse.json({ error: "Failed to create signed upload URL." }, { status: 500 });
    }

    if (!data?.signedUrl) {
      console.error("Supabase signed upload URL returned empty data.");
      return NextResponse.json({ error: "Unexpected response from Supabase." }, { status: 500 });
    }

    return NextResponse.json(
      {
        signedUrl: data.signedUrl,
        path: safePath,
        expiresAt: Date.now() + effectiveExpiresIn * 1000,
      },
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Supabase signed upload route failure:", message);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
