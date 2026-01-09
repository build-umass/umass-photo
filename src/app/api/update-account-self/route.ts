import { NextRequest } from "next/server";
import { getAdminClient, getUserClient } from "@/app/utils/supabase/client";
import { TablesUpdate } from "@/app/utils/supabase/database.types";

export async function PUT(request: NextRequest) {
  const client = getUserClient(request);

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

  if (!user.email) {
    return new Response(JSON.stringify({ message: "User has no email" }), {
      status: 400,
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

  const requestBody: TablesUpdate<"photoclubuser"> = await request.json();
  if (!requestBody.id || requestBody.id !== user.id) {
    return new Response(
      JSON.stringify({ message: "Cannot update another user's data" }),
      {
        status: 403,
      },
    );
  }

  if (requestBody.email)
    return new Response(
      JSON.stringify({ message: "Cannot directly update email" }),
      {
        status: 403,
      },
    );
  if (requestBody.role)
    return new Response(
      JSON.stringify({ message: "Cannot directly update role" }),
      {
        status: 403,
      },
    );

  const adminClient = getAdminClient();

  const { error: updateError } = await adminClient
    .from("photoclubuser")
    .update(requestBody)
    .eq("id", requestBody.id);
  if (updateError) {
    return new Response(
      JSON.stringify({
        message: "Failed to update user data",
        error: updateError,
      }),
      {
        status: 500,
      },
    );
  }

  return new Response("null", { status: 200 });
}
