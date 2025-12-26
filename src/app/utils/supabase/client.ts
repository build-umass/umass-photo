import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";
import { Database } from "./database.types";

const supabaseUrl = process.env.API_URL;
if (!supabaseUrl) throw new Error("API_URL is not defined in environment variables");
const supabaseAnonKey = process.env.ANON_KEY;
if (!supabaseAnonKey) throw new Error("ANON_KEY is not defined in environment variables");

export const getUserClient = (request: NextRequest) => {
  const access_token = request.cookies.get("access-token")?.value;
  const client = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  });
  return client;
}

export const attachCookies = async (client: SupabaseClient, response: Response) => {
  return response;
}
