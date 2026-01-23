import { Tables } from "@/app/utils/supabase/database.types";
import { getAdminClient } from "@/app/utils/supabase/server";

export async function GET() {
  const client = await getAdminClient();

  // Fetch photos with author information
  // First, fetch all photos
  const { data: photos, error: photosError } = await client
    .from("photo")
    .select("id, title, description, file, postdate, authorid")
    .order("postdate", { ascending: false });

  if (photosError) {
    console.error("Error fetching photos:", photosError);
    return new Response(JSON.stringify({ error: photosError.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Get unique author IDs
  const authorIds = [...new Set(photos?.map((p) => p.authorid) || [])];

  // Fetch author information
  const { data: authors, error: authorsError } = await client
    .from("photoclubuser")
    .select("id, username, email")
    .in("id", authorIds);

  if (authorsError) {
    console.error("Error fetching authors:", authorsError);
    // Continue without author info rather than failing completely
  }

  // Create a map of author ID to author info
  const authorMap = new Map(
    authors?.map((author) => [author.id, author]) || [],
  );

  // Transform the data and get image URLs
  const photosWithUrls =
    photos?.map((photo: Tables<"photo">) => {
      // Get public URL for the image
      const imageUrl = client.storage.from("photos").getPublicUrl(photo.file)
        .data.publicUrl;

      const author = authorMap.get(photo.authorid);

      return {
        id: photo.id,
        title: photo.title || "Untitled",
        description: photo.description,
        author: author?.username || "Unknown",
        authorId: photo.authorid,
        date: new Date(photo.postdate).toLocaleDateString(),
        imageUrl: imageUrl,
        file: photo.file,
      };
    }) || [];

  return new Response(JSON.stringify({ data: photosWithUrls }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
