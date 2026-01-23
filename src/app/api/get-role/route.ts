import { createClient } from "@/app/utils/supabase/server";

export async function GET() {
  const client = await createClient();

  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return Response.json({});
  const id = user.id;
  const { data: roleObjectList } = await client
    .from("photoclubuser")
    .select("photoclubrole(*)")
    .eq("id", id);

  // If there is no matching photoclubuser row, or the join is empty,
  // return an empty JSON object instead of throwing.
  if (roleObjectList === null || roleObjectList.length === 0)
    return Response.json({});
  const [{ photoclubrole: roleData }] = roleObjectList;
  if (!roleData) return Response.json({});

  return Response.json(roleData);
}
