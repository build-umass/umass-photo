"use client";
import MarkdownContent from "../components/MarkdownContent";
import { TablesInsert } from "../utils/supabase/database.types";

export default function BlogContent({ blog }: { blog: TablesInsert<"blog"> }) {
  return (
    <div className="text-lg">
      <h1 className="text-umass-red mx-auto mb-4 text-center text-3xl font-bold">
        {blog.title}
      </h1>
      <MarkdownContent>{blog.content}</MarkdownContent>
    </div>
  );
}
