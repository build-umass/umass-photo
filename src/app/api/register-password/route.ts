import { getAdminClient } from "@/app/utils/supabase/client";

export async function POST(request: Request) {
  const { email, password }: { email?: string; password?: string } =
    await request.json();
  if (!email || !password) {
    return new Response(
      JSON.stringify({ error: "Email and password are required." }),
      { status: 400 },
    );
  }

  const adminClient = getAdminClient();

  const { data: usersResult, error: listError } =
    await adminClient.auth.admin.listUsers();
  if (listError) {
    return new Response(JSON.stringify({ error: listError }), {
      status: 500,
    });
  }

  const existingUser = usersResult.users.find((user) => user.email === email);
  if (existingUser) {
    return new Response(JSON.stringify({ error: "user already exists" }), {
      status: 409,
    });
  }

  const { data, error } = await adminClient.auth.signUp({
    email,
    password,
  });
  if (error) {
    return new Response(JSON.stringify({ error }), {
      status: 400,
    });
  }

  // If email confirmation is disabled, Supabase may return a session we can persist.
  if (data.session) {
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: [
        [
          "Set-Cookie",
          `access-token=${data.session.access_token}; Path=/api/; SameSite=strict; HttpOnly; Secure`,
        ],
        [
          "Set-Cookie",
          `refresh-token=${data.session.refresh_token}; Path=/api/refresh/; SameSite=strict; HttpOnly; Secure`,
        ],
      ],
    });
  }

  // If email confirmation is required, no session will be returned.
  return new Response(
    JSON.stringify({
      success: true,
      needsEmailConfirmation: true,
      message: "Check your email to confirm your account before logging in.",
    }),
    { status: 200 },
  );
}
