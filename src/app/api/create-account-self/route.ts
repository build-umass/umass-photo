import { NextRequest } from "next/server";
import { getUserClient } from "@/app/utils/supabase/client";
import ensureDefaultRole from "@/app/utils/ensureDefaultRole";

export async function POST(request: NextRequest) {
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

  const requestBody = await request.json();
  const username: string | undefined = requestBody.username;
  if (username === undefined) {
    return new Response(JSON.stringify({ message: "Username is required" }), {
      status: 400,
    });
  }

  const bio: string | undefined = requestBody.bio;
  if (bio === undefined) {
    return new Response(JSON.stringify({ message: "Bio is required" }), {
      status: 400,
    });
  }

  const role = await ensureDefaultRole();

  await client.from("photoclubuser").insert([
    {
      id: user.id,
      email: user.email,
      username,
      bio,
      role,
    },
  ]);

  return new Response(null, { status: 201 });
}
