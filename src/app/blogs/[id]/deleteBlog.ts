"use server";
import { createClient } from "@/app/utils/supabase/server";

export async function deleteBlogAction(blogId: string) {
  const client = await createClient();

  const { error: deleteError } = await client
    .from("blog")
    .delete()
    .eq("id", blogId);
  if (deleteError) {
    throw new Error(
      `Failed to delete blog from database: ${JSON.stringify(deleteError)}`,
    );
  }
}
