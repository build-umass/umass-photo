"use client";
import MarkdownEditorPlainText from "@/app/components/MarkdownEditor/MarkdownEditorPlainText";
import UmassPhotoButton from "@/app/components/UmassPhotoButton";
import { useState } from "react";
import BlogContent from "../BlogContent";
import { markdownTutorialContent } from "../markdownTutorialContent";
import { createBlog } from "./createBlog";
import { useRouter } from "next/navigation";

export default function EditorContent({ authorid }: { authorid: string }) {
  const [content, setContent] = useState(markdownTutorialContent);
  const [title, setTitle] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  async function publishBlog() {
    setUploading(true);
    try {
      await createBlog(title, content);
    } catch (error) {
      console.error("Error publishing blog:", error);
    } finally {
      setUploading(false);
      router.push("/blogs");
    }
  }

  return (
    <div className="relative flex grow flex-col">
      {isPreview ? (
        <BlogContent
          blog={{
            title,
            content,
            authorid,
            id: "00000000-0000-0000-0000-000000000000",
            postdate: new Date().toISOString(),
          }}
        />
      ) : (
        <>
          <input
            name="title"
            placeholder="Title"
            className="text-center text-3xl"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          ></input>
          <MarkdownEditorPlainText
            onChange={setContent}
            value={content}
            className="grow"
          ></MarkdownEditorPlainText>
        </>
      )}
      <div className="absolute top-0 right-0 flex gap-4 p-4">
        <UmassPhotoButton
          onClick={publishBlog}
          className={`${uploading ? "bg-gray-300" : "bg-umass-red"} text-white`}
          disabled={uploading}
        >
          Publish
        </UmassPhotoButton>
        <UmassPhotoButton
          className="bg-umass-red text-white"
          onClick={() => setIsPreview(!isPreview)}
          disabled={uploading}
        >
          Toggle Preview
        </UmassPhotoButton>
      </div>
    </div>
  );
}
