import { getAdminClient } from "@/app/utils/supabase/server";

export async function POST(request: Request) {
  const { email, password }: { email?: string; password?: string } =
    await request.json();

  if (!email || !password) {
    return new Response(
      JSON.stringify({ error: "Email and password are required." }),
      { status: 400 },
    );
  }

  const client = await getAdminClient();

  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    return new Response(
      JSON.stringify({ error: error?.message ?? "Invalid credentials." }),
      { status: 401 },
    );
  }

  return new Response(null, {
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
