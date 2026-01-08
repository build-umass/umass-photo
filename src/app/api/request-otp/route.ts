import { getAdminClient } from "@/app/utils/supabase/client";

export async function POST(request: Request) {
  const email = request.headers.get("email");
  if (email === null) {
    return new Response("{}", { status: 400 });
  }

  const client = getAdminClient();

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
