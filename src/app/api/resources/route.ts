import { NextResponse } from "next/server";

import { getAdminDb } from "@/lib/admin";

type NgoRecord = {
  name?: unknown;
  services?: unknown;
  languages?: unknown;
  verified?: unknown;
  contact?: unknown;
  region?: unknown;
};

function methodNotAllowed() {
  return new NextResponse("Method not allowed.", {
    status: 405,
    headers: {
      Allow: "GET",
    },
  });
}

export const POST = methodNotAllowed;
export const PUT = methodNotAllowed;
export const DELETE = methodNotAllowed;

function normalizeStrings(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => (typeof entry === "string" ? entry : null))
    .filter((entry): entry is string => entry !== null);
}

function normalizeBoolean(value: unknown): boolean {
  if (typeof value === "boolean") {
    return value;
  }
  return false;
}

function normalizeOptionalString(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }
  return undefined;
}

export async function GET() {
  try {
    const db = getAdminDb();
    const snapshot = await db.collection("ngos").get();

    const ngos = snapshot.docs.map((doc) => {
      const data = doc.data() as NgoRecord | undefined;

      return {
        id: doc.id,
        name: typeof data?.name === "string" ? data.name : "",
        services: normalizeStrings(data?.services),
        languages: normalizeStrings(data?.languages),
        verified: normalizeBoolean(data?.verified),
        contact: normalizeOptionalString(data?.contact),
        region: normalizeOptionalString(data?.region),
      };
    });

    return NextResponse.json(ngos, { status: 200 });
  } catch (error) {
    console.error("Resources route error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
