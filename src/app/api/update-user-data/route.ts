import dotenv from "dotenv";
import { NextRequest } from "next/server";
import { attachCookies, getUserClient } from "@/app/utils/supabase/client";

dotenv.config();

type User = {
  id: string,
  username: string,
  email: string,
  bio: string,
  role: string,
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(request: NextRequest) {
  const client = getUserClient(request);

  const { toDelete, toModify }: { toDelete: User["id"][], toModify: User[] } = await request.json();
  await client.from("photoclubuser").upsert(toModify);
  await client.from("photoclubuser").delete().in("id", toDelete);

  const response = new Response();
  return attachCookies(client, response);
}
