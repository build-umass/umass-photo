import { NextRequest } from "next/server";
import { attachCookies, getUserClient } from "@/app/utils/supabase/client";
import { Tables } from "@/app/utils/supabase/database.types";

 
export async function POST(request: NextRequest) {
  const client = getUserClient(request);

  const { toDelete, toModify }: { toDelete: Tables<"photoclubuser">["id"][], toModify: Tables<"photoclubuser">[] } = await request.json();
  const { error: upsertError } = await client.from("photoclubuser").upsert(toModify);
  if (upsertError) {
    console.log(JSON.stringify(upsertError, undefined, "    "));
  }
  const { error: deleteError } = await client.from("photoclubuser").delete().in("id", toDelete);
  if (deleteError) {
    console.log(JSON.stringify(deleteError, undefined, "    "));
  }

  const response = new Response();
  return attachCookies(client, response);
}
