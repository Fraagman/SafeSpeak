import { NextResponse } from "next/server";

import { FieldValue } from "firebase-admin/firestore";

import { getAdminDb } from "@/lib/admin";

type QueryParams = {
  token: string | null;
  uid: string | null;
  chatId: string | null;
  ngoPubB64: string | null;
};

function parseQuery(request: Request): QueryParams {
  const url = new URL(request.url);
  const { searchParams } = url;
  return {
    token: searchParams.get("token"),
    uid: searchParams.get("uid"),
    chatId: searchParams.get("chatId"),
    ngoPubB64: searchParams.get("ngoPubB64"),
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

export async function GET(request: Request) {
  try {
    const { token, uid, chatId, ngoPubB64 } = parseQuery(request);
    const expectedToken = process.env.DEV_SEED_TOKEN;

    if (!expectedToken || token !== expectedToken) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    if (!uid || uid.trim().length === 0) {
      return NextResponse.json({ error: "uid required" }, { status: 400 });
    }

    const publicKey = ngoPubB64 ?? process.env.NGO_PUBLIC_KEY_B64;
    if (!publicKey) {
      return NextResponse.json({ error: "missing NGO public key" }, { status: 400 });
    }

    const adminDb = getAdminDb();
    const chatDocId = chatId && chatId.trim().length > 0 ? chatId : "chatDemo";
    const docRef = adminDb.collection("chats").doc(chatDocId);

    await docRef.set(
      {
        participants: [uid, "ngo-demo"],
        ngoPublicKey: publicKey,
        createdAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    return NextResponse.json(
      {
        chatId: chatDocId,
        participantsCount: 2,
        ok: true,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Seed chat error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
