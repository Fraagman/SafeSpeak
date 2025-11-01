import { NextResponse, NextRequest } from "next/server";
import { getAdminDb } from "@/lib/admin";

type NgoDoc = {
  id: string;
  data: {
    name: string;
    services: string[];
    languages: string[];
    verified: boolean;
    contact: string;
    region: string;
    lat?: number;
    lng?: number;
  };
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

export async function GET(request: NextRequest) {
  // Production protection: disable dev routes unless valid token provided
  const token = request.nextUrl.searchParams.get("token");
  const validToken = process.env.DEV_SEED_TOKEN;
  
  if (process.env.NODE_ENV !== "development" && token !== validToken) {
    return NextResponse.json({ error: "gone" }, { status: 410 });
  }
  
  // Additional check: require token even in dev
  if (!token || token !== validToken) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const ngos: NgoDoc[] = [
      {
        id: "ngo_safe_legal",
        data: {
          name: "Safe Legal Aid",
          services: ["Legal Aid", "Case Prep"],
          languages: ["English", "Hindi"],
          verified: true,
          contact: "+91 90000 11111",
          region: "Delhi",
          lat: 28.6139,
          lng: 77.2090
        },
      },
      {
        id: "ngo_heal_care",
        data: {
          name: "Heal & Care",
          services: ["Counseling", "Shelter Referral"],
          languages: ["English", "Marathi"],
          verified: true,
          contact: "+91 90000 22222",
          region: "Mumbai",
          lat: 19.0760,
          lng: 72.8777
        },
      },
      {
        id: "ngo_listen_line",
        data: {
          name: "Listen Line",
          services: ["Hotline", "Crisis Support"],
          languages: ["English", "Tamil"],
          verified: false,
          contact: "1800-000-000",
          region: "Chennai",
          lat: 13.0827,
          lng: 80.2707
        },
      },
      {
        id: "ngo_women_safety",
        data: {
          name: "Women Safety Desk",
          services: ["Legal Aid", "Counseling", "Hotline"],
          languages: ["English", "Hindi", "Telugu"],
          verified: true,
          contact: "+91 90000 33333",
          region: "Hyderabad",
          lat: 17.3850,
          lng: 78.4867
        },
      },
    ];

    const adminDb = getAdminDb();
    const batch = adminDb.batch();

    ngos.forEach(({ id, data }) => {
      const docRef = adminDb.collection("ngos").doc(id);
      // Only update lat/lng if they don't already exist
      const updateData = { ...data };
      batch.set(
        docRef, 
        updateData, 
        { 
          merge: true,
          mergeFields: [
            'name',
            'services',
            'languages',
            'verified',
            'contact',
            'region',
            ...(data.lat !== undefined ? ['lat'] : []),
            ...(data.lng !== undefined ? ['lng'] : [])
          ]
        }
      );
    });

    await batch.commit();

    const total = ngos.length;

    return NextResponse.json({ inserted: total, updated: 0, total }, { status: 200 });
  } catch (error) {
    console.error("Seed NGOs error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
