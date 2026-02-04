"use client";
import MarkdownEditorPlainText from "@/app/components/MarkdownEditor/MarkdownEditorPlainText";
import UmassPhotoButtonRed from "@/app/components/UmassPhotoButton/UmassPhotoButtonRed";
import { useState } from "react";
import BlogContent from "../BlogContent";
import { useRouter } from "next/navigation";
import { TablesInsert } from "@/app/utils/supabase/database.types";
import { updateBlogAction } from "./updateBlog";
import { deleteBlogAction } from "./deleteBlog";

export default function EditorPage({
  blogId,
  blog,
}: {
  blogId: string;
  blog: TablesInsert<"blog">;
}) {
  const [blogData, setBlogData] = useState<TablesInsert<"blog">>({
    title: blog.title,
    content: blog.content,
  });
  const [modified, setModified] = useState(false);
  const [isPreview, setIsPreview] = useState(true);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function updateBlog() {
    setPending(true);
    try {
      await updateBlogAction({ ...blogData, id: blogId });
      setModified(false);
    } catch (error) {
      console.error("Error publishing blog:", error);
    } finally {
      setPending(false);
      router.refresh();
    }
  }

  async function deleteBlog() {
    setPending(true);
    try {
      await deleteBlogAction(blogId);
      router.push("/blogs");
    } catch (error) {
      console.error("Error deleting blog:", error);
      setPending(false);
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
            onChange={(e) => {
              setBlogData({ ...blogData, title: e.target.value });
              setModified(true);
            }}
          ></input>
          <MarkdownEditorPlainText
            className="grow"
            value={blogData.content}
            onChange={(value) => {
              setBlogData({ ...blogData, content: value });
              setModified(true);
            }}
          ></MarkdownEditorPlainText>
        </>
      )}
      <div className="absolute top-0 right-0 flex gap-4 p-4">
        <UmassPhotoButtonRed
          onClick={updateBlog}
          disabled={pending || !modified}
        >
          Update
        </UmassPhotoButtonRed>
        <UmassPhotoButtonRed onClick={deleteBlog} disabled={pending}>
          Delete
        </UmassPhotoButtonRed>
        <UmassPhotoButtonRed onClick={() => setIsPreview(!isPreview)}>
          Toggle Preview
        </UmassPhotoButtonRed>
      </div>
    </div>
  );
}
