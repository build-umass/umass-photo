import dotenv from "dotenv";
import { NextRequest } from "next/server";
import { attachCookies, getUserClient } from "@/app/utils/supabase/client";
import { Tables } from "@/app/utils/supabase/database.types";

dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(request: NextRequest) {
  const client = getUserClient(request);

  const { toDelete, toModify }: { toDelete: Tables<"photoclubuser">["id"][], toModify: Tables<"photoclubuser">[] } = await request.json();
  await client.from("photoclubuser").upsert(toModify);
  await client.from("photoclubuser").delete().in("id", toDelete);

  const response = new Response();
  return attachCookies(client, response);
}
