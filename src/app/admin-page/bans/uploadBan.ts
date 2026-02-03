"use server";

import { TablesInsert } from "@/app/utils/supabase/database.types";
import { createClient } from "@/app/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function uploadBan(newBan: TablesInsert<"ban">) {
  const client = await createClient();
  await client.from("ban").insert(newBan).throwOnError();
  revalidatePath("/admin-page/bans");
}
