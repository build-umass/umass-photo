"use client";
import MarkdownEditorPlainText from "@/app/components/MarkdownEditor/MarkdownEditorPlainText";
import UmassPhotoButtonRed from "@/app/components/UmassPhotoButton/UmassPhotoButtonRed";
import { useState } from "react";
import BlogContent from "../BlogContent";
import { markdownTutorialContent } from "../markdownTutorialContent";
import { createBlog } from "./createBlog";
import { useRouter } from "next/navigation";
import { TablesInsert } from "@/app/utils/supabase/database.types";

export default function EditorContent() {
  const [blogData, setBlogData] = useState<TablesInsert<"blog">>({
    title: "",
    content: markdownTutorialContent,
  });
  const [isPreview, setIsPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  async function publishBlog() {
    setUploading(true);
    try {
      await createBlog(blogData);
      router.push("/blogs");
    } catch (error) {
      console.error("Error publishing blog:", error);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="relative flex grow flex-col">
      {isPreview ? (
        <BlogContent blog={blogData} />
      ) : (
        <>
          <input
            name="title"
            placeholder="Title"
            className="text-center text-3xl"
            value={blogData.title}
            onChange={(e) =>
              setBlogData({ ...blogData, title: e.target.value })
            }
          ></input>
          <MarkdownEditorPlainText
            className="grow"
            value={blogData.content}
            onChange={(value) => setBlogData({ ...blogData, content: value })}
          ></MarkdownEditorPlainText>
        </>
      )}
      <div className="absolute top-0 right-0 flex gap-4 p-4">
        <UmassPhotoButtonRed onClick={publishBlog} disabled={uploading}>
          Publish
        </UmassPhotoButtonRed>
        <UmassPhotoButtonRed
          onClick={() => setIsPreview(!isPreview)}
          disabled={uploading}
        >
          Toggle Preview
        </UmassPhotoButtonRed>
      </div>
    </div>
  );
}
