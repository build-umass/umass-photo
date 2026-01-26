import { createClient } from "@/app/utils/supabase/server";
import { notFound } from "next/navigation";
import BlogContent from "../BlogContent";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ id: number }>;
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

  return <BlogContent blog={blogData} />;
}
