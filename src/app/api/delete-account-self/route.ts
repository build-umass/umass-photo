import { NextRequest } from "next/server";
import { getAdminClient, getUserClient } from "@/app/utils/supabase/client";

export async function DELETE(request: NextRequest) {
  const client = getUserClient(request);
  const adminClient = getAdminClient();

  // Get the current user's ID
  const {
    data: { user },
    error: authError,
  } = await client.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ message: "User not authenticated" }), {
      status: 401,
    });
  }

  if (authError) {
    return new Response(
      JSON.stringify({ message: "Authentication error", error: authError }),
      {
        status: 500,
      },
    );
  }

  const { error: deleteError } = await adminClient.auth.admin.deleteUser(
    user.id,
  );

  if (deleteError) {
    console.error("Error deleting user:", deleteError);
    return new Response(
      JSON.stringify({
        message: "Failed to delete account",
        error: deleteError,
      }),
      {
        status: 500,
      },
    );
  }

  // Clear the authentication cookies
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: [
      [
        "Set-Cookie",
        "access-token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=strict; HttpOnly; Secure; Path=/api",
      ],
      [
        "Set-Cookie",
        "refresh-token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=strict; HttpOnly; Secure; Path=/api/refresh",
      ],
    ],
  });
}
