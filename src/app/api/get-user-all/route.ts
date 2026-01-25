import { createClient } from "@/app/utils/supabase/server";

export async function GET() {
  const client = await createClient();

  const { data: userList } = await client.from("photoclubuser").select();
  return Response.json(userList);
}
