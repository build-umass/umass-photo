import { getSupabaseOtpType, normalizeOtpMode } from "@/app/utils/otpModes";
import { getAdminClient } from "@/app/utils/supabase/client";

export async function POST(request: Request) {
  const token = request.headers.get("token");
  const email = request.headers.get("email");
  const rawMode = request.headers.get("mode");
  const mode = normalizeOtpMode(rawMode);
  if (token === null)
    return new Response("No token", {
      status: 400,
    });
  if (email === null)
    return new Response("No email", {
      status: 400,
    });

  const client = getAdminClient();
  const type = getSupabaseOtpType(mode);
  const {
    data: { user, session },
    error,
  } = await client.auth.verifyOtp({ email, token, type });

  if (error)
    return new Response(JSON.stringify(error), {
      status: 500,
    });

  if (!session)
    return new Response("No Session", {
      status: 400,
    });

  let userExists = false;
  if (user) {
    const { data: photoclubuser, error: photoclubuserError } = await client
      .from("photoclubuser")
      .select("*")
      .eq("id", user.id);

    if (photoclubuserError) {
      return new Response(
        JSON.stringify({
          message: "Database error",
          error: photoclubuserError,
        }),
        {
          status: 500,
        },
      );
    }

    if (photoclubuser && photoclubuser.length > 0) {
      userExists = true;
    }
  }

  return new Response(
    JSON.stringify({
      session: session,
      expires_at: session.expires_at,
      userExists,
    }),
    {
      status: 200,
      headers: [
        [
          "Set-Cookie",
          `access-token=${session.access_token}; SameSite=strict; HttpOnly; Secure; Path=/api`,
        ],
        [
          "Set-Cookie",
          `refresh-token=${session.refresh_token}; SameSite=strict; HttpOnly; Secure; Path=/api/refresh`,
        ],
      ],
    },
  );
}
