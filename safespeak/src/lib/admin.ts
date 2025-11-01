import { getApps, initializeApp, type App, cert } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

type ServiceAccount = {
  project_id: string;
  client_email: string;
  private_key: string;
  [key: string]: unknown;
};

let cachedApp: App | undefined;

function parseServiceAccount(): ServiceAccount {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT environment variable is not set.");
  }

  try {
    const parsed = JSON.parse(raw) as ServiceAccount;
    if (!parsed.project_id || !parsed.client_email || !parsed.private_key) {
      throw new Error("Missing required fields in service account JSON.");
    }
    return parsed;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to parse FIREBASE_SERVICE_ACCOUNT: ${message}`);
  }
}

export function getAdminApp(): App {
  if (cachedApp) {
    return cachedApp;
  }

  if (getApps().length > 0) {
    cachedApp = getApps()[0];
    return cachedApp;
  }

  const serviceAccount = parseServiceAccount();

  cachedApp = initializeApp({
    credential: cert(serviceAccount),
  });

  return cachedApp;
}

export function getAdminDb(): Firestore {
  const app = getAdminApp();
  return getFirestore(app);
}
