"use server";
import { createClient } from "@/app/utils/supabase/server";

export async function createBlog(title: string, content: string) {
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

  const { error: insertError } = await client.from("blog").insert({
    postdate: new Date().toISOString(),
    title,
    content,
    authorid: user.id,
  });
  if (insertError) {
    throw new Error(
      `Failed to insert blog into database: ${JSON.stringify(insertError)}`,
    );
  }
}
