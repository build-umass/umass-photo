import { NextRequest } from "next/server";
import { getUserClient } from "@/app/utils/supabase/client";

const DEFAULT_PROFILE_URL = "/blank_profile.png";
export async function GET(request: NextRequest) {
  const client = getUserClient(request);

  const { data: userData, error: getUserError } = await client.auth.getUser();
  if (getUserError) {
    return new Response(
      JSON.stringify({ message: "Failed to get user", error: getUserError }),
      { status: 500 },
    );
  }

  const userId = userData.user.id;

  const { data: userProfile, error: getUserProfileError } = await client
    .from("photoclubuser")
    .select("*")
    .eq("id", userId)
    .single();
  if (getUserProfileError) {
    return new Response(
      JSON.stringify({
        message: "Failed to get user profile",
        error: getUserProfileError,
      }),
      { status: 500 },
    );
  }

  const profilePictureURL = userProfile.profilepicture
    ? client.storage.from("photos").getPublicUrl(userProfile.profilepicture)
        .data.publicUrl
    : DEFAULT_PROFILE_URL;
  return new Response(JSON.stringify({ ...userProfile, profilePictureURL }));
}
