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

  // Get query parameters
  const searchParams = request.nextUrl.searchParams;
  const filteringTags = searchParams.get('filtering_tags') === 'true';
  const filteringAuthors = searchParams.get('filtering_authors') === 'true';
  const filteringDate = searchParams.get('filtering_date') === 'true';
  const queryTags = searchParams.get('querytags') ? JSON.parse(searchParams.get('querytags')!) : [];
  const queryAuthor = filteringAuthors && searchParams.get('queryauthor') 
  ? searchParams.get('queryauthor')! 
  : '00000000-0000-0000-0000-000000000000';

  const queryStart = searchParams.get('querystart') || '1970-01-01T00:00:00Z';
  const queryEnd = searchParams.get('queryend') || '2099-12-31T23:59:59Z';

  // Call the filter_photos function
  const { data: filteredPhotos, error } = await client.rpc('filter_photos', {
    filtering_tags: filteringTags,
    filtering_authors: filteringAuthors,
    filtering_date: filteringDate,
    querytags: JSON.stringify(queryTags),
    queryauthor: queryAuthor,
    querystart: queryStart,
    queryend: queryEnd
  }, { get: true }, );

  if(error) {
    console.error("Error filtering photos:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  // Get unique author IDs from filtered photos
  const authorIds = [...new Set(filteredPhotos?.map((p: any) => p.authorid) || [])];
  
  // Fetch author information
  const { data: authors, error: authorsError } = await client
    .from("photoclubuser")
    .select("id, username, email")
    .in("id", authorIds);

  if(authorsError) {
    console.error("Error fetching authors:", authorsError);
  }

  // Create a map of author ID to author info
  const authorMap = new Map(
    authors?.map(author => [author.id, author]) || []
  );

  // Transform the data and get image URLs
  const photosWithUrls = filteredPhotos?.map((photo: any) => {
    const imageUrl = client.storage
      .from("photos")
      .getPublicUrl(photo.file).data.publicUrl;

    const author = authorMap.get(photo.authorid);

    return {
      id: photo.id,
      title: photo.title || "Untitled",
      description: photo.description,
      author: author?.username || "Unknown",
      date: new Date(photo.postdate).toLocaleDateString(),
      imageUrl: imageUrl,
      file: photo.file
    };
  }) || [];

  return new Response(JSON.stringify({ data: photosWithUrls }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}


