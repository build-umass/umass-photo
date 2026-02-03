"use server";

import { TablesInsert } from "@/app/utils/supabase/database.types";
import { createClient } from "@/app/utils/supabase/server";

export async function uploadBan(newBan: TablesInsert<"ban">) {
  const client = await createClient();
  const { error } = await client.from("ban").insert(newBan);
  if (error) {
    throw error;
  }
  return true;
}
