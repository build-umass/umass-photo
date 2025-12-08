import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(request: Request) {
  const supabaseApiKey = process.env.SUPABASE_API_KEY;
  const supabaseUrl = process.env.SUPABASE_URL;
  if (!supabaseApiKey) throw new Error("No API key found!");
  if (!supabaseUrl) throw new Error("No Supabase URL found!");

  const token = request.headers.get("token");
  const email = request.headers.get("email");
  const mode = request.headers.get("mode") ?? "login";
  if (token === null) return new Response("No token", {
    status: 400
  });
  if (email === null) return new Response("No email", {
    status: 400
  });

  const client = createClient(supabaseUrl, supabaseApiKey);
  const type = mode === "signup" ? "signup" : "email";
  const { data } = await client.auth.verifyOtp({ email, token, type })

  if (!data.session) return new Response("No Session", {
    status: 400
  });

  console.log(`Access token:\n${data.session.access_token}\n`);

  return new Response(JSON.stringify({
    session: data.session
  }), {
    status: 200,
    headers: [
      ["Set-Cookie", `access-token=${data.session.access_token}; SameSite=strict; HttpOnly; Secure`],
      ["Set-Cookie", `refresh-token=${data.session.refresh_token}; SameSite=strict; HttpOnly; Secure`]
    ]
  });
}
