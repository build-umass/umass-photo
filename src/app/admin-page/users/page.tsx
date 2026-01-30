"use server";

import { createClient } from "@/app/utils/supabase/server";
import UserEditor from "./UserEditor";

export default async function UsersPage() {
  const client = await createClient();

  const { data: userData, error: userError } = await client
    .from("photoclubuser")
    .select("*");
  if (userError) {
    throw userError;
  }

  const userDataRecord = Object.fromEntries(
    (userData ?? []).map((user) => [user.id, user]),
  );

  const { data: roleOptions, error: roleError } = await client
    .from("photoclubrole")
    .select("roleid");
  if (roleError) {
    throw roleError;
  }

  const roleOptionStrings = (roleOptions ?? []).map((role) => role.roleid);

  return (
    <UserEditor
      defaultUserData={userDataRecord}
      roleOptions={roleOptionStrings}
    ></UserEditor>
  );
}
