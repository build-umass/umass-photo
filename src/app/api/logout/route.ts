import { createClient } from "@/app/utils/supabase/server";

export async function POST() {
  const client = await createClient();
  const { error } = await client.auth.signOut();
  if (error) {
    return Response.json(
      {
        message: "Error logging out",
        error: error,
      },
      {
        status: 500,
      },
    );
  }
  return Response.json(
    {
      message: "Successfully logged out",
    },
    {
      status: 200,
    },
  );
}
