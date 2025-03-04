import { createClient } from "@supabase/supabase-js";

/**
 * Retrieve a list of URIs of relevant images.
 * 
 * This is a server-only function.
 * 
 * This pulls from the `/photos/raw` bucket in SupaBase.
 * @param limit the maximum number of URIs to return. Defaults to 10
 * @returns a list of URIs.
 */
export async function getRandomImageUrls(limit: number = 10): Promise<string[]> {
  "use server"
  const supabaseApiKey = process.env.SUPABASE_API_KEY;
  const supabaseUrl = process.env.SUPABASE_URL;
  if(!supabaseApiKey) throw new Error("No API key found!");
  if(!supabaseUrl) throw new Error("No Supabase URL found!");

  const client = createClient(supabaseUrl, supabaseApiKey);

  const imageQueryResult = await client.storage
    .from("photos")
    .list("raw", {limit});

  if(!imageQueryResult.data) throw new Error("Image Query Failed!")

  const imagePaths = imageQueryResult.data
    .map(file => file.name);

  const imageUrls = imagePaths.map(
    path =>
      client.storage.from("photos").getPublicUrl(`raw/${path}`).data.publicUrl
  );

  return imageUrls;
}