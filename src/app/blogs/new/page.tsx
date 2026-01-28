import { createClient } from "@/app/utils/supabase/server";
import { redirect } from "next/navigation";
import EditorContent from "./EditorContent";

export default async function NewBlogPage() {
  const client = await createClient();

  const {
    data: { user },
  } = await client.auth.getUser();

  if (user === null) {
    redirect("/login");
  }

  return <EditorContent></EditorContent>;
}
