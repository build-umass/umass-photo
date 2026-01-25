"use server";

import { getAdminClient } from "./supabase/server";

export default async function ensureDefaultRole() {
  const adminClient = await getAdminClient();
  const defaultRoleName = "member";
  await adminClient.from("photoclubrole").upsert(
    {
      roleid: defaultRoleName,
      is_admin: false,
    },
    { onConflict: "roleid" },
  );
  return defaultRoleName;
}
