"use server";

import { Tables } from "@/app/utils/supabase/database.types";
import { createClient } from "@/app/utils/supabase/server";

export async function saveBans(toUpdate: Tables<"ban">[], toDelete: string[]) {
  const client = await createClient();
  await client
    .from("ban")
    .upsert(toUpdate, {
      onConflict: "id",
    })
    .throwOnError();
  await client.from("ban").delete().in("id", toDelete).throwOnError();
}
