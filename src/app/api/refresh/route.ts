import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";
import { Database } from "@/app/utils/supabase/database.types";

dotenv.config();

export async function POST(request: NextRequest) {
  let access_token = request.cookies.get("access-token")?.value;
  let refresh_token = request.cookies.get("refresh-token")?.value;

  if (!access_token || !refresh_token) return new Response("", { status: 401 });

  const supabaseUrl = process.env.API_URL;
  const supabaseAnonKey = process.env.ANON_KEY;
  if (!supabaseUrl) throw new Error("No Supabase URL found!");
  if (!supabaseAnonKey) throw new Error("No Supabase Anon Key found!");

  const client = createClient<Database>(supabaseUrl, supabaseAnonKey);
  client.auth.setSession({ access_token, refresh_token });

  const {
    data: { session },
    error: refreshError,
  } = await client.auth.refreshSession();
  if (refreshError) {
    throw refreshError;
  }
  if (session === null) {
    return new Response(
      JSON.stringify({
        message: "refresh token rotation returned null session",
      }),
      { status: 500 },
    );
  }

  access_token = session.access_token;
  refresh_token = session.refresh_token;

  return new Response(
    JSON.stringify({
      expires_at: session.expires_at,
    }),
    {
      status: 200,
      headers: [
        [
          "Set-Cookie",
          `access-token=${access_token}; SameSite=strict; HttpOnly; Secure; Path=/api`,
        ],
        [
          "Set-Cookie",
          `refresh-token=${refresh_token}; SameSite=strict; HttpOnly; Secure; Path=/api/refresh`,
        ],
      ],
    },
  );
}
