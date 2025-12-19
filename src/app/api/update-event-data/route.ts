import dotenv from "dotenv";
import { NextRequest } from "next/server";
import { attachCookies, getUserClient } from "@/app/utils/supabase/client";
import { Tables } from "@/app/utils/supabase/database.types";

dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(request: NextRequest) {
  const client = getUserClient(request);

  const { toDelete, toModify }: { toDelete: Tables<"event">["id"][], toModify: Tables<"event">[] } = await request.json();
  const { error: upsertError } = await client.from("event").upsert(toModify);
  if (upsertError) {
    console.log(JSON.stringify(upsertError, undefined, "    "));
  }
  const { error: deleteError } = await client.from("event").delete().in("id", toDelete);
  if (deleteError) {
    console.log(JSON.stringify(deleteError, undefined, "    "));
  }

  const response = new Response();
  return attachCookies(client, response);
}
