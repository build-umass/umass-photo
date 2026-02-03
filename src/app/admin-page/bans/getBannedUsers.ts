"use server";

import { TablesInsert } from "@/app/utils/supabase/database.types";
import { createClient } from "@/app/utils/supabase/server";

export async function getBannedUsers(ban: Readonly<TablesInsert<"ban">>) {
  const client = await createClient();
  return (
    await client
      .rpc("ban_affects_users", {
        ban: {
          id: "00000000-0000-0000-0000-000000000000",
          email: null,
          ip: null,
          username: null,
          ...ban,
        },
      })
      .throwOnError()
  ).data;
}
