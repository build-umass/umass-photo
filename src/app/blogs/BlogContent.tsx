"use client";
import MarkdownContent from "../components/MarkdownContent";
import { Tables } from "../utils/supabase/database.types";

export default function BlogContent({ blog }: { blog: Tables<"blog"> }) {
  return (
    <div className="text-lg">
      <h1 className="text-umass-red mx-auto mb-4 text-center text-3xl font-bold">
        {blog.title}
      </h1>
      <MarkdownContent>{blog.content}</MarkdownContent>
    </div>
  );
}
