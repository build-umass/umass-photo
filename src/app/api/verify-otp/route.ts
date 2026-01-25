import { getSupabaseOtpType, normalizeOtpMode } from "@/app/utils/otpModes";
import { createClient } from "@/app/utils/supabase/server";

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

  const client = await createClient();
  const type = getSupabaseOtpType(mode);
  const {
    data: { user, session },
    error,
  } = await client.auth.verifyOtp({ email, token, type });
  const { data: claimData } = await client.auth.getClaims();

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

  console.log(`email: ${claimData?.claims.email}`);

  return new Response(
    JSON.stringify({
      session: session,
      userExists,
    }),
    {
      status: 200,
    },
  );
}
