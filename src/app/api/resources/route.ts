import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/admin";

// Duplicate of CITY_MAP from geo.ts for server-side use
const CITY_MAP: Record<string, { lat: number; lng: number }> = {
  delhi: { lat: 28.6139, lng: 77.2090 },
  mumbai: { lat: 19.0760, lng: 72.8777 },
  chennai: { lat: 13.0827, lng: 80.2707 },
  hyderabad: { lat: 17.3850, lng: 78.4867 },
};

function getCityCoords(region?: string): { lat: number | null; lng: number | null } {
  if (!region) return { lat: null, lng: null };
  
  // Normalize region name (lowercase, no spaces)
  const normalized = region.toLowerCase().replace(/\s+/g, '');
  const coords = CITY_MAP[normalized];
  
  return coords ? { lat: coords.lat, lng: coords.lng } : { lat: null, lng: null };
}

type NgoRecord = {
  name?: unknown;
  services?: unknown;
  languages?: unknown;
  verified?: unknown;
  contact?: unknown;
  region?: unknown;
  lat?: unknown;
  lng?: unknown;
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
      const region = normalizeOptionalString(data?.region);
      
      // Get coordinates, with fallback to city coordinates if available
      let lat: number | null = null;
      let lng: number | null = null;
      
      // Check if lat/lng exist and are valid numbers
      if (typeof data?.lat === 'number' && !isNaN(data.lat) && 
          typeof data?.lng === 'number' && !isNaN(data.lng)) {
        lat = data.lat;
        lng = data.lng;
      } 
      // Fallback to city coordinates if available
      else if (region) {
        const cityCoords = getCityCoords(region);
        lat = cityCoords.lat;
        lng = cityCoords.lng;
      }

      return {
        id: doc.id,
        name: typeof data?.name === "string" ? data.name : "",
        services: normalizeStrings(data?.services),
        languages: normalizeStrings(data?.languages),
        verified: normalizeBoolean(data?.verified),
        contact: normalizeOptionalString(data?.contact),
        region,
        lat,
        lng,
      };
    });

    return NextResponse.json(ngos, { status: 200 });
  } catch (error) {
    console.error("Resources route error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
