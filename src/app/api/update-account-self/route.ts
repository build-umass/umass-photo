import { NextRequest } from "next/server";
import { createClient, getAdminClient } from "@/app/utils/supabase/server";
import { TablesUpdate } from "@/app/utils/supabase/database.types";
import { randomBytes } from "crypto";

type PhotoClubUserUpdateWithProfilePicture = TablesUpdate<"photoclubuser"> & {
  profilePictureURL?: string;
};

export async function PUT(request: NextRequest) {
  const client = await createClient();

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

  const requestBody: PhotoClubUserUpdateWithProfilePicture =
    await request.json();
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
  if (
    requestBody.profilePictureURL &&
    requestBody.profilePictureURL.startsWith("data:")
  ) {
    const imageType = requestBody.profilePictureURL.match(
      /^data:image\/([a-zA-Z]+);base64,/,
    );
    if (!imageType) {
      return new Response(
        JSON.stringify({ message: "Invalid profile picture format" }),
        {
          status: 400,
        },
      );
    }

    // convert data URL to File object
    const file = await fetch(requestBody.profilePictureURL).then((res) =>
      res.blob(),
    );

    const fileName = `${randomBytes(20).toString("base64url")}.${imageType[1]}`;
    const adminClient = await getAdminClient();
    const { error: uploadError } = await adminClient.storage
      .from("photos")
      .upload(fileName, file);
    if (uploadError) {
      return new Response(
        JSON.stringify({
          message: "Failed to upload profile picture",
          error: uploadError,
        }),
        {
          status: 500,
        },
      );
    }
    requestBody.profilepicture = fileName;
  }

  delete requestBody.profilePictureURL;

  const adminClient = await getAdminClient();

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
