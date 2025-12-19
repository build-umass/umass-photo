import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import zxcvbn from "zxcvbn";

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

  const adminClient = createClient(supabaseUrl, supabaseApiKey);

  const { data, error } = await adminClient.auth.signUp({
    email,
    password
  });

  // If the user already exists (for example, they previously registered via OTP),
  // attempt to update their account to use this password instead.
  if (error) {
    const message = error.message?.toLowerCase() ?? "";

    // Supabase typically reports an "already registered" style error when the
    // email is already in use. In that case, we try to update the existing user.
    if (message.includes("already") && message.includes("registered")) {
      const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
      if (!supabaseAnonKey) throw new Error("No Supabase anon key found!");

      // Look up the existing user by email using the admin API.
      const {
        data: usersResult,
        error: listError
      } = await adminClient.auth.admin.listUsers({ email });

      const existingUser = usersResult?.users?.[0];
      if (listError || !existingUser) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400 }
        );
      }

      const { error: updateError } =
        await adminClient.auth.admin.updateUserById(existingUser.id, {
          password
        });

      if (updateError) {
        return new Response(
          JSON.stringify({ error: updateError.message }),
          { status: 400 }
        );
      }

      // After setting the password, sign the user in so we can issue a session.
      const anonClient = createClient(supabaseUrl, supabaseAnonKey);
      const {
        data: signInData,
        error: signInError
      } = await anonClient.auth.signInWithPassword({
        email,
        password
      });

      if (signInError || !signInData.session) {
        return new Response(
          JSON.stringify({
            success: true,
            message:
              "Your password has been set. Please sign in with your new credentials."
          }),
          { status: 200 }
        );
      }

      return new Response(
        JSON.stringify({ success: true }),
        {
          status: 200,
          headers: [
            [
              "Set-Cookie",
              `access-token=${signInData.session.access_token}; Path=/api/; SameSite=strict; HttpOnly; Secure`
            ],
            [
              "Set-Cookie",
              `refresh-token=${signInData.session.refresh_token}; Path=/api/refresh/; SameSite=strict; HttpOnly; Secure`
            ]
          ]
        }
      );
    }

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
            `access-token=${data.session.access_token}; Path=/api/; SameSite=strict; HttpOnly; Secure`
          ],
          [
            "Set-Cookie",
            `refresh-token=${data.session.refresh_token}; Path=/api/refresh/; SameSite=strict; HttpOnly; Secure`
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


