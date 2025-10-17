import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";
import { Database } from "./database.types";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

export const getUserClient = (request: NextRequest) => {
  const access_token = request.cookies.get("access-token")?.value;
  const refresh_token = request.cookies.get("refresh-token")?.value;
  const client = createClient<Database>(supabaseUrl, supabaseAnonKey);
  if (!access_token) return client;
  if (!refresh_token) return client;
  client.auth.setSession({ access_token, refresh_token });
  return client;
}

export const attachCookies = async (client: SupabaseClient, response: Response) => {
  const { data: { session } } = await client.auth.getSession();
  response.headers.append("Set-Cookie", `access-token=${session?.access_token ?? ''}; SameSite=strict; HttpOnly; Secure`)
  response.headers.append("Set-Cookie", `refresh-token=${session?.refresh_token ?? ''}; SameSite=strict; HttpOnly; Secure`)
  return response;
}
