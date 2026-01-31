"use server";
import { ReactNode } from "react";
import AdminPageTabSelector from "./AdminPageTabSelector";
import { createClient } from "../utils/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminPageLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const client = await createClient();

  if (!(await client.rpc("has_good_role")).data) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-0 shrink grow basis-0">
      <AdminPageTabSelector></AdminPageTabSelector>
      <div className="flex w-fit grow flex-col overflow-scroll">
        <div className="h-fit w-fit p-24">{children}</div>
      </div>
    </div>
  );
}
