import { ReactNode } from "react";

export default function AdminPageTableRow({
  children,
}: {
  children: ReactNode;
}) {
  return <tr className="bg-gray-100 even:bg-gray-200">{children}</tr>;
}
