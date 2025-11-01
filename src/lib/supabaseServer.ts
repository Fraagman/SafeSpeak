// Server-only. Do NOT import in client bundles.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type SupabaseAdminClient = SupabaseClient;

declare global {
  // eslint-disable-next-line no-var
  var _supabaseAdmin: SupabaseAdminClient | undefined;
}

function ensureEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        `Set this in your deployment environment (e.g. Vercel project settings).`,
    );
  }
  return value;
}

function createAdminClient(): SupabaseAdminClient {
  const url = ensureEnv("SUPABASE_URL", process.env.SUPABASE_URL);
  const serviceRoleKey = ensureEnv(
    "SUPABASE_SERVICE_ROLE",
    process.env.SUPABASE_SERVICE_ROLE,
  );

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        "X-Client-Info": "safespeak-admin",
      },
    },
  });
}

export function getSupabaseAdmin(): SupabaseAdminClient {
  if (!global._supabaseAdmin) {
    global._supabaseAdmin = createAdminClient();
  }

  return global._supabaseAdmin;
}
