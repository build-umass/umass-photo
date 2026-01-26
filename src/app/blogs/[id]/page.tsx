import MarkdownContent from "@/app/components/MarkdownContent";
import { createClient } from "@/app/utils/supabase/server";
import { notFound } from "next/navigation";

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

  return (
    <>
      <h1 className="text-umass-red mx-auto mb-4 text-3xl font-bold">
        {blogData.title}
      </h1>
      <MarkdownContent>{blogData.content}</MarkdownContent>;
    </>
  );
}
