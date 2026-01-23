import { createClient } from "@/app/utils/supabase/client";

export async function POST() {
  const client = createClient();
  await client.auth.signOut();
  return Response.json(
    {
      message: "Successfully logged out",
    },
    {
      status: 200,
    },
  );
}
