"use server";
import { TablesInsert } from "@/app/utils/supabase/database.types";
import { createClient } from "@/app/utils/supabase/server";

export async function updateBlogAction(
  blog: TablesInsert<"blog"> & { id: string },
) {
  const client = await createClient();
  const {
    data: { user },
    error: userError,
  } = await client.auth.getUser();
  if (userError || !user) {
    throw new Error(
      `Failed to get user for creating blog: ${JSON.stringify(userError)}`,
    );
  }

  const { error: updateError } = await client
    .from("blog")
    .update(blog)
    .eq("id", blog.id);
  if (updateError) {
    throw new Error(
      `Failed to insert blog into database: ${JSON.stringify(updateError)}`,
    );
  }
}
