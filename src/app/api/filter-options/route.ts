import dotenv from "dotenv";
import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

export async function GET(request: NextRequest) {
  const supabaseApiKey = process.env.SUPABASE_API_KEY;
  const supabaseUrl = process.env.SUPABASE_URL;
  if(!supabaseApiKey) throw new Error("No API key found!");
  if(!supabaseUrl) throw new Error("No Supabase URL found!");

  const client = createClient(supabaseUrl, supabaseApiKey);

  // Fetch all unique authors
  const { data: photos, error: photosError } = await client
    .from("photo")
    .select("authorid");

  if(photosError) {
    console.error("Error fetching photos for authors:", photosError);
    return new Response(JSON.stringify({ error: photosError.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  // Get unique author IDs
  const authorIds = [...new Set(photos?.map(p => p.authorid) || [])];
  
  // Fetch author information
  const { data: authors, error: authorsError } = await client
    .from("photoclubuser")
    .select("id, username")
    .in("id", authorIds);

  if(authorsError) {
    console.error("Error fetching authors:", authorsError);
  }

  // Fetch all unique tags
  const { data: tags, error: tagsError } = await client
    .from("tag")
    .select("name");

  if(tagsError) {
    console.error("Error fetching tags:", tagsError);
    return new Response(JSON.stringify({ error: tagsError.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  return new Response(JSON.stringify({ 
    data: {
      authors: authors?.map(a => ({ id: a.id, username: a.username })) || [],
      tags: tags?.map(t => t.name) || []
    }
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}

