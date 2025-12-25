import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

export async function POST(request: Request) {
  const supabaseApiKey = process.env.SUPABASE_API_KEY;
  const supabaseUrl = process.env.SUPABASE_URL;
  if (!supabaseApiKey) throw new Error("No API key found!");
  if (!supabaseUrl) throw new Error("No Supabase URL found!");

  const email = request.headers.get("email");
  if (email === null) {
    return new Response("{}", { status: 400 });
  }

  const client = createClient(supabaseUrl, supabaseApiKey);

  const { error } = await client.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
    },
  });
  if (error) {
    return new Response(JSON.stringify({ error }), { status: 500 });
  }
  return new Response();
}
