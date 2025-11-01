import { NextResponse } from "next/server";

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const expected = process.env.DEV_SEED_TOKEN;

    if (!expected || token !== expected) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

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
        },
      },
    ];

    const adminDb = getAdminDb();
    const batch = adminDb.batch();

    ngos.forEach(({ id, data }) => {
      const docRef = adminDb.collection("ngos").doc(id);
      batch.set(docRef, data, { merge: true });
    });

    await batch.commit();

    const total = ngos.length;

    return NextResponse.json({ inserted: total, updated: 0, total }, { status: 200 });
  } catch (error) {
    console.error("Seed NGOs error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
