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
        
  
  const start_date = "2022-01-01";
  const end_date = "2025-01-01";
  const tags = ["nature"];
  const author = "43188856-13db-410a-b1a2-b006056cd84f";
  const result = await client.rpc('filter_photos', {filtering_tags: true, filtering_authors: true, filtering_date: false, queryauthor: author, querystart: start_date, queryend: end_date, querytags: JSON.stringify(tags)}, {get:true})

  const resultString = JSON.stringify(result, undefined, '    ');
  console.log(resultString)
  return new Response(resultString);
}


