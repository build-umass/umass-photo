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

  const arg1 = "2022-01-01";
  const arg2 = "2025-01-01";
  const result = await client.rpc('filter_date', {querystart: arg1, queryend: arg2}, {get:true})

  const resultString = JSON.stringify(result, undefined, '    ');
  console.log(resultString)
  return new Response(resultString);
}


