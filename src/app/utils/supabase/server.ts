"use server";

import { CookieOptions, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "./database.types";
import { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = (() => {
  const value = process.env.API_URL || process.env.SUPABASE_URL;
  if (value === undefined)
    throw new Error("API_URL is not defined in environment variables");
  return value;
})();

const supabaseAnonKey = (() => {
  const value = process.env.ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (!value)
    throw new Error("ANON_KEY is not defined in environment variables");
  return value;
})();

const supabaseServiceRoleKey = (() => {
  const value =
    process.env.SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!value)
    throw new Error("SERVICE_ROLE_KEY is not defined in environment variables");
  return value;
})();

export async function createClient(): Promise<SupabaseClient<Database>> {
  const cookieStore = await cookies();

  console.log(JSON.stringify(cookieStore.getAll(), null, 2));

  // This appears to error since createServerClient is defined twice in the server client, with one deprecated and one not.
  const client = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(
        cookiesToSet: {
          name: string;
          value: string;
          options: CookieOptions;
        }[],
      ) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
  await client.auth.getClaims();
  return client;
}

export async function getAdminClient(): Promise<SupabaseClient<Database>> {
  return createServerClient(supabaseUrl, supabaseServiceRoleKey, {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {
        // no-op
      },
    },
  });
}
