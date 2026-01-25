import { createClient } from "@/app/utils/supabase/server";

export async function GET() {
  const client = await createClient();

  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return Response.json({});
  const { data: roleObjectList } = await client
    .from("photoclubrole")
    .select("*");
  if (!roleObjectList) return Response.json([]);
  return Response.json(roleObjectList);
}
