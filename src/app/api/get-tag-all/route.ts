import { createClient } from "@/app/utils/supabase/server";

export async function GET() {
  const client = await createClient();

  const { data: tagObjectList } = await client.from("tag").select("*");
  if (!tagObjectList) return Response.json([]);
  const tagList = tagObjectList.map(({ name }) => name);
  return Response.json(tagList);
}
