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

   // Basic server-side password policy:
   // - At least 8 characters
   // - Contains at least one lowercase letter
   // - Contains at least one uppercase letter
   // - Contains at least one number
   // - Contains at least one special character
   const passwordPolicy =
     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

   if (!passwordPolicy.test(password)) {
     return new Response(
       JSON.stringify({
         error:
           "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
       }),
       { status: 400 }
     );
   }

  const client = createClient(supabaseUrl, supabaseApiKey);

  const { data, error } = await client.auth.signUp({
    email,
    password
  });

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400 }
    );
  }

  // If email confirmation is disabled, Supabase may return a session we can persist.
  if (data.session) {
    return new Response(
      JSON.stringify({ success: true }),
      {
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
      }
    );
  }

  // If email confirmation is required, no session will be returned.
  return new Response(
    JSON.stringify({
      success: true,
      needsEmailConfirmation: true,
      message: "Check your email to confirm your account before logging in."
    }),
    { status: 200 }
  );
}


