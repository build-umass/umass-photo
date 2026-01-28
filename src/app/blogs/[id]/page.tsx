import { createClient } from "@/app/utils/supabase/server";
import { notFound } from "next/navigation";
import BlogContent from "../BlogContent";
import EditorPage from "./EditorPage";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const blogId = (await params).id;

  const client = await createClient();

  const { data: blogData, error: blogError } = await client
    .from("blog")
    .select("*")
    .eq("id", blogId)
    .single();
  if (blogError || !blogData) {
    notFound();
  }

  const userId = (await client.auth.getUser()).data.user?.id;

  if (userId === blogData.authorid) {
    return <EditorPage blogId={blogId} blog={blogData}></EditorPage>;
  }

  return <BlogContent blog={blogData} />;
}
