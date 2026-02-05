"use server";

import NavBarLink from "./NavBarLink";
import { Tables } from "@/app/utils/supabase/database.types";
import { createClient } from "@/app/utils/supabase/server";

export default async function UserChip() {
  const client = await createClient();
  const {
    data: { user },
  } = await client.auth.getUser();

  let profile:
    | (Tables<"photoclubuser"> & {
        photoclubrole: Tables<"photoclubrole">;
      })
    | null = null;
  if (user !== null) {
    const { data: profileMatches, error: selectError } = await client
      .from("photoclubuser")
      .select("*, photoclubrole(roleid, is_admin)")
      .eq("id", user.id)
      .limit(1);

    if (selectError) {
      console.error("Error fetching user profile:", selectError);
      profile = null;
    }

    if (profileMatches && profileMatches.length === 1) {
      profile = profileMatches[0];
    }
  }

  return (
    <>
      {profile === null ? (
        <NavBarLink href="/login">Login</NavBarLink>
      ) : (
        <NavBarLink href="/me">Me</NavBarLink>
      )}
      {profile?.photoclubrole?.is_admin && (
        <NavBarLink href="/admin-page">Admin</NavBarLink>
      )}
    </>
  );
}
