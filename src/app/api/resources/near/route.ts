import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/admin";

const GEOCODE_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const GEOCODE_USER_AGENT = process.env.NOMINATIM_USER_AGENT || "SafeSpeak/1.0 (contact@safespeak.example)";

const geocodeCache = new Map<string, { coords: Coordinates | null; expiresAt: number }>();

type Coordinates = {
  lat: number;
  lng: number;
};

type NgoRecord = {
  name?: unknown;
  services?: unknown;
  languages?: unknown;
  verified?: unknown;
  contact?: unknown;
  region?: unknown;
  state?: unknown;
  lat?: unknown;
  lng?: unknown;
};

type NgoResponse = {
  id: string;
  name: string;
  services: string[];
  languages: string[];
  verified: boolean;
  contact?: string;
  region?: string;
  state?: string;
  lat: number;
  lng: number;
  approx: boolean;
  distanceKm: number;
};

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const latParam = url.searchParams.get("lat");
  const lngParam = url.searchParams.get("lng");

  if (!latParam || !lngParam) {
    return NextResponse.json({ error: "lat and lng query parameters are required" }, { status: 400 });
  }

  const userLat = Number(latParam);
  const userLng = Number(lngParam);

  if (!Number.isFinite(userLat) || !Number.isFinite(userLng)) {
    return NextResponse.json({ error: "lat and lng must be valid numbers" }, { status: 400 });
  }

  const radiusParam = url.searchParams.get("radiusKm");
  const limitParam = url.searchParams.get("limit");
  const cityParam = normalizeOptionalString(url.searchParams.get("city"));
  const normalizedCityKey = cityParam ? normalizeKey(cityParam) : null;

  const radiusKm = parseRadius(radiusParam);
  const radiusLimit = Number.isFinite(radiusKm) ? radiusKm : Number.POSITIVE_INFINITY;

  const rawLimit = limitParam ? Number(limitParam) : undefined;
  const limit = Number.isFinite(rawLimit) && rawLimit! > 0 ? Math.min(Math.floor(rawLimit!), 100) : 20;

  try {
    const db = getAdminDb();
    const snapshot = await db.collection("ngos").get();

    const ngos = (
      await Promise.all(
        snapshot.docs.map(async (doc): Promise<NgoResponse | null> => {
          const data = doc.data() as NgoRecord | undefined;
          if (!data) {
            return null;
          }

          const region = normalizeOptionalString(data.region);
          const state = normalizeOptionalString(data.state);
          const name = typeof data.name === "string" ? data.name : "";
          const contact = normalizeOptionalString(data.contact);
          const services = normalizeStrings(data.services);
          const languages = normalizeStrings(data.languages);
          const verified = normalizeBoolean(data.verified);

          let lat = coerceNumber(data.lat);
          let lng = coerceNumber(data.lng);
          let approx = false;

          if (lat === null || lng === null) {
            if (region && normalizedCityKey && normalizeKey(region) === normalizedCityKey) {
              lat = userLat;
              lng = userLng;
              approx = true;
            } else {
              const fallbackCoords = await geocodeWithFallback(region, state);
              if (fallbackCoords) {
                lat = fallbackCoords.lat;
                lng = fallbackCoords.lng;
                approx = true;
              }
            }
          }

          if (lat === null || lng === null) {
            return null;
          }

          const distanceKm = haversineKm({ lat: userLat, lng: userLng }, { lat, lng });
          if (!Number.isFinite(distanceKm)) {
            return null;
          }

          if (distanceKm > radiusLimit) {
            return null;
          }

          return {
            id: doc.id,
            name,
            services,
            languages,
            verified,
            contact,
            region,
            state,
            lat,
            lng,
            approx,
            distanceKm,
          };
        })
      )
    )
      .filter((ngo): ngo is NgoResponse => ngo !== null)
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, limit);

    return NextResponse.json(ngos, { status: 200 });
  } catch (error) {
    console.error("Resources near route error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}

function parseRadius(value: string | null): number {
  if (!value) {
    return 50; // default radius 50km
  }

  if (value.toLowerCase() === "all") {
    return Number.POSITIVE_INFINITY;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 50;
}

function normalizeKey(value: string): string {
  return value.toLowerCase().replace(/\s+/g, "");
}

function coerceNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function normalizeStrings(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => (typeof entry === "string" ? entry : null))
    .filter((entry): entry is string => entry !== null)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

function normalizeBoolean(value: unknown): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "true" || normalized === "1" || normalized === "yes";
  }

  return false;
}

function normalizeOptionalString(value: unknown): string | undefined {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.length > 0) {
      return trimmed;
    }
  }
  return undefined;
}

function haversineKm(a: Coordinates, b: Coordinates): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  const distance = R * c;

  return Math.round(distance * 10) / 10;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

async function geocodeWithFallback(region?: string, state?: string): Promise<Coordinates | null> {
  const attempts: string[] = [];

  if (region && state) {
    attempts.push(`${region}, ${state}, India`);
  }

  if (region) {
    attempts.push(`${region}, India`);
  }

  if (state) {
    attempts.push(`${state}, India`);
  }

  for (const query of attempts) {
    const coords = await geocodeCached(query);
    if (coords) {
      return coords;
    }
  }

  return null;
}

async function geocodeCached(query: string): Promise<Coordinates | null> {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return null;
  }

  const cached = geocodeCache.get(normalizedQuery);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.coords;
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": GEOCODE_USER_AGENT,
        "Accept-Language": "en",
      },
    });

    if (!response.ok) {
      console.warn(`Geocode request failed (${response.status}) for query: ${query}`);
      geocodeCache.set(normalizedQuery, { coords: null, expiresAt: Date.now() + GEOCODE_CACHE_TTL_MS });
      return null;
    }

    const data = (await response.json()) as Array<{ lat: string; lon: string }>;
    if (!Array.isArray(data) || data.length === 0) {
      geocodeCache.set(normalizedQuery, { coords: null, expiresAt: Date.now() + GEOCODE_CACHE_TTL_MS });
      return null;
    }

    const lat = Number(data[0].lat);
    const lng = Number(data[0].lon);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      geocodeCache.set(normalizedQuery, { coords: null, expiresAt: Date.now() + GEOCODE_CACHE_TTL_MS });
      return null;
    }

    const coords: Coordinates = { lat, lng };
    geocodeCache.set(normalizedQuery, { coords, expiresAt: Date.now() + GEOCODE_CACHE_TTL_MS });
    return coords;
  } catch (error) {
    console.warn("Geocode request error for query", query, error instanceof Error ? error.message : error);
    geocodeCache.set(normalizedQuery, { coords: null, expiresAt: Date.now() + GEOCODE_CACHE_TTL_MS });
    return null;
  }
}
