import { NextResponse } from "next/server";

import { FieldValue } from "firebase-admin/firestore";

import { getAdminDb } from "@/lib/admin";

type Network = "sepolia" | "amoy";

type QueryParams = {
  token: string | null;
  uid: string | null;
  reportId: string | null;
  network: string | null;
};

function parseQuery(request: Request): QueryParams {
  const url = new URL(request.url);
  const { searchParams } = url;

  return {
    token: searchParams.get("token"),
    uid: searchParams.get("uid"),
    reportId: searchParams.get("reportId"),
    network: searchParams.get("network"),
  };
}

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

function resolveNetwork(input: string | null): Network {
  if (input === "amoy") {
    return "amoy";
  }
  return "sepolia";
}

export async function GET(request: Request) {
  try {
    const { token, uid, reportId, network } = parseQuery(request);

    const expectedToken = process.env.DEV_SEED_TOKEN;
    if (!expectedToken || token !== expectedToken) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    if (!uid || uid.trim().length === 0) {
      return NextResponse.json({ error: "uid required" }, { status: 400 });
    }

    const resolvedNetwork = resolveNetwork(network);
    const generatedReportId = reportId && reportId.trim().length > 0 ? reportId : `repDemo-${Date.now()}`;

    const db = getAdminDb();
    const docRef = db.collection("reports").doc(generatedReportId);

    await docRef.set(
      {
        ownerUid: uid,
        createdAt: FieldValue.serverTimestamp(),
        tags: ["workplace", "threat"],
        severity: 3,
        urgency: "high",
        summary: "Manager threatened at workplace; followed after shift.",
        textPath: `evidence/${uid}/${generatedReportId}/text.bin`,
        imagePath: null,
        fileSha256: "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824",
        anchorTxHash: "",
        anchorExplorer:
          resolvedNetwork === "amoy"
            ? "https://amoy.polygonscan.com/tx/"
            : "https://sepolia.etherscan.io/tx/",
        anchorNetwork: resolvedNetwork,
        status: "new",
      },
      { merge: true },
    );

    return NextResponse.json({ ok: true, reportId: generatedReportId }, { status: 200 });
  } catch (error) {
    console.error("Seed report error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
