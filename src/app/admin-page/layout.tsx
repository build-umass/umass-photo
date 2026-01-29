import { ReactNode } from "react";
import AdminPageTabSelector from "./AdminPageTabSelector";

export default async function AdminPageLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="flex min-h-0 shrink grow basis-0">
      <AdminPageTabSelector></AdminPageTabSelector>
      <div className="flex w-fit grow flex-col overflow-scroll">
        <div className="h-fit w-fit p-24">{children}</div>
      </div>
    </div>
  );
}
