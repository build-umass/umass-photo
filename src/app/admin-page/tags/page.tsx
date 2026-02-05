"use server";

import { createClient } from "@/app/utils/supabase/server";
import TagEditor from "./TagEditor";

export default async function TagsPage() {
  const client = await createClient();
  const { data: savedTags, error } = await client.from("tag").select("*");
  if (error) {
    throw error;
  }
  const { data: events, error: eventError } = await client
    .from("event")
    .select("tag, name");
  if (eventError) {
    throw eventError;
  }
  const tagToEventName: Record<string, string> = {};
  for (const event of events ?? []) {
    if (event.tag) {
      tagToEventName[event.tag] = event.name;
    }
  }
  const tagListRecord = Object.fromEntries(
    (savedTags ?? []).map((tag) => [tag.name, tag]),
  );
  return (
    <TagEditor
      savedTags={tagListRecord}
      tagToEventName={tagToEventName}
    ></TagEditor>
  );
}
