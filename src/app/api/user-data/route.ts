import { createClient } from "@/app/utils/supabase/server";

export async function GET() {
  const client = await createClient();
  const { data: userData } = await client.auth.getUser();
  return Response.json(userData);
}
