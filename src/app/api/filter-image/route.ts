import dotenv from "dotenv";
import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
  const supabaseApiKey = process.env.SUPABASE_API_KEY;
  const supabaseUrl = process.env.SUPABASE_URL;
  if(!supabaseApiKey) throw new Error("No API key found!");
  if(!supabaseUrl) throw new Error("No Supabase URL found!");

  const client = createClient(supabaseUrl, supabaseApiKey);

  const arg = [
    1
  ]
  const result = await client.rpc('test_1', {ids: JSON.stringify(arg)}, {get:true})
  const resultString = JSON.stringify(result, undefined, '    ');
  console.log(resultString)
  return new Response(resultString);
}