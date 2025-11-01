import { NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabaseServer";

const BUCKET_ID = "evidence";
const PATH_PREFIX = "evidence/";
const MIN_PATH_LENGTH = 8;
const MAX_PATH_LENGTH = 300;

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

  const { path } = body as { path?: unknown };

  let safePath: string;
  try {
    safePath = validatePath(path);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid path." },
      { status: 400 },
    );
  }

  try {
    const admin = getSupabaseAdmin();
    const { data, error } = await admin.storage.from(BUCKET_ID).remove([safePath]);

    if (error) {
      console.error("Supabase remove object error:", error.message);
      return NextResponse.json({ error: "Failed to remove object." }, { status: 500 });
    }

    if (!Array.isArray(data)) {
      console.error("Supabase remove object returned unexpected data format.");
      return NextResponse.json({ error: "Unexpected response from Supabase." }, { status: 500 });
    }

    return NextResponse.json({ removed: true, path: safePath }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Supabase remove route failure:", message);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}

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
