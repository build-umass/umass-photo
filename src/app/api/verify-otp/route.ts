import {
  getSupabaseOtpType,
  normalizeOtpMode
} from "@/app/utils/otpModes";
import { getAdminClient } from "@/app/utils/supabase/client";

 
export async function POST(request: Request) {
  const token = request.headers.get("token");
  const email = request.headers.get("email");
  const rawMode = request.headers.get("mode");
  const mode = normalizeOtpMode(rawMode);
  if (token === null) return new Response("No token", {
    status: 400
  });
  if (email === null) return new Response("No email", {
    status: 400
  });

  const client = getAdminClient();
  const type = getSupabaseOtpType(mode);
  const { data } = await client.auth.verifyOtp({ email, token, type });

  if (!data.session) return new Response("No Session", {
    status: 400
  });

  return new Response(JSON.stringify({
    session: data.session,
    expires_at: data.session.expires_at
  }), {
    status: 200,
    headers: [
      ["Set-Cookie", `access-token=${data.session.access_token}; SameSite=strict; HttpOnly; Secure; Path=/api`],
      ["Set-Cookie", `refresh-token=${data.session.refresh_token}; SameSite=strict; HttpOnly; Secure; Path=/api/refresh`]
    ]
  });
}
