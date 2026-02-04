"use server";

import { createClient } from "@/app/utils/supabase/server";

export async function saveTags(toDelete: string[]) {
  const client = await createClient();
  if (toDelete.length > 0) {
    await client.from("tag").delete().in("name", toDelete).throwOnError();
  }
}
