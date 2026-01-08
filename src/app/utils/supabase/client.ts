import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";
import { Database } from "./database.types";

const supabaseUrl = process.env.API_URL || process.env.SUPABASE_URL;
if (!supabaseUrl)
  throw new Error("API_URL is not defined in environment variables");
const supabaseAnonKey = process.env.ANON_KEY || process.env.SUPABASE_ANON_KEY;
if (!supabaseAnonKey)
  throw new Error("ANON_KEY is not defined in environment variables");
const supabaseServiceRoleKey =
  process.env.SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseServiceRoleKey)
  throw new Error("SERVICE_ROLE_KEY is not defined in environment variables");

export const getUserClient = (request: NextRequest) => {
  const access_token = request.cookies.get("access-token")?.value;
  if (access_token) {
    const client = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    return client;
  }
  const client = createClient<Database>(supabaseUrl, supabaseAnonKey);
  client.auth.signInAnonymously();
  return client;
};

export const getAdminClient = () => {
  const client = createClient<Database>(supabaseUrl, supabaseServiceRoleKey);
  return client;
};

export const attachCookies = async (
  client: SupabaseClient,
  response: Response,
) => {
  return response;
};
