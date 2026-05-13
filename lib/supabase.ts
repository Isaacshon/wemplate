import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const TEMPLATE_PREVIEW_BUCKET = "template-previews";
export const TEMPLATE_ZIP_BUCKET = "template-zips";
export const REFERENCE_SHOT_BUCKET = "reference-shots";

let adminClient: SupabaseClient | null = null;

export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  if (!adminClient) {
    adminClient = createClient(url, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return adminClient;
}
