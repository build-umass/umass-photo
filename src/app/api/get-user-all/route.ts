import { NextRequest } from "next/server";
import { attachCookies, getUserClient } from "@/app/utils/supabase/client";

 
export async function GET(request: NextRequest) {
  const client = getUserClient(request);
  
  const { data: userList } = await client.from("photoclubuser").select();
  const response = new Response(JSON.stringify(userList));
  return attachCookies(client, response);
}
