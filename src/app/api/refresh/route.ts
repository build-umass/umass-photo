import { NextRequest } from "next/server";
import { createClient } from "@/app/utils/supabase/server";

export async function POST(request: NextRequest) {
  let access_token = request.cookies.get("access-token")?.value;
  let refresh_token = request.cookies.get("refresh-token")?.value;

  if (!access_token)
    return new Response(
      JSON.stringify({
        message: "No access token provided",
      }),
      { status: 401 },
    );

  if (!refresh_token)
    return new Response(
      JSON.stringify({
        message: "No refresh token provided",
      }),
      { status: 401 },
    );

  const client = await createClient();

  const { error: setSessionError } = await client.auth.setSession({
    access_token,
    refresh_token,
  });
  if (setSessionError) {
    return new Response(
      JSON.stringify({
        message: "Failed to set session before refresh",
        error: setSessionError,
      }),
      { status: 500 },
    );
  }

  const {
    data: { session },
    error: refreshError,
  } = await client.auth.refreshSession();
  if (refreshError) {
    return new Response(
      JSON.stringify({
        message: "Failed to refresh session",
        error: refreshError,
      }),
      { status: 500 },
    );
  }

  if (session === null) {
    return new Response(
      JSON.stringify({
        message: "refresh token rotation returned null session",
        error: refreshError,
      }),
      { status: 500 },
    );
  }

  access_token = session.access_token;
  refresh_token = session.refresh_token;

  return new Response(
    JSON.stringify({
      expires_at: session.expires_at,
    }),
    {
      status: 200,
      headers: [
        [
          "Set-Cookie",
          `access-token=${access_token}; SameSite=strict; HttpOnly; Secure; Path=/api`,
        ],
        [
          "Set-Cookie",
          `refresh-token=${refresh_token}; SameSite=strict; HttpOnly; Secure; Path=/api/refresh`,
        ],
      ],
    },
  );
}
