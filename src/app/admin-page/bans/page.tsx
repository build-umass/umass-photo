"use server";

import { createClient } from "@/app/utils/supabase/server";
import BanEditor from "./BanEditor";

export default async function BanPage() {
  const client = await createClient();
  const { data: savedBans, error } = await client.from("ban").select("*");
  if (error) {
    throw error;
  }
  const banListRecord = Object.fromEntries(
    (savedBans ?? []).map((ban) => [ban.id, ban]),
  );
  return <BanEditor savedBans={banListRecord}></BanEditor>;
}
