"use server";

import { redirect } from "next/navigation";

export default async function AdminPage() {
  redirect("/admin-page/users");
}
