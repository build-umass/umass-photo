import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

export async function POST(request: Request) {
  const supabaseApiKey = process.env.SUPABASE_API_KEY;
  const supabaseUrl = process.env.SUPABASE_URL;
  if (!supabaseApiKey) throw new Error("No API key found!");
  if (!supabaseUrl) throw new Error("No Supabase URL found!");

  const { email, password }: { email?: string; password?: string } = await request.json();

  if (!email || !password) {
    return new Response(
      JSON.stringify({ error: "Email and password are required." }),
      { status: 400 }
    );
  }

  const client = createClient(supabaseUrl, supabaseApiKey);

  const { data, error } = await client.auth.signInWithPassword({
    email,
    password
  });

  if (error || !data.session) {
    return new Response(
      JSON.stringify({ error: error?.message ?? "Invalid credentials." }),
      { status: 401 }
    );
  }

  return new Response(null, {
    status: 200,
    headers: [
      [
        "Set-Cookie",
        `access-token=${data.session.access_token}; Path=/; SameSite=strict; HttpOnly; Secure`
      ],
      [
        "Set-Cookie",
        `refresh-token=${data.session.refresh_token}; Path=/; SameSite=strict; HttpOnly; Secure`
      ]
    ]
  });
}


