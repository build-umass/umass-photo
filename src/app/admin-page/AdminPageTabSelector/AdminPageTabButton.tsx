import { ReactNode } from "react";
import AdminPageButton from "../common/AdminPageButton";

export default function AdminPageTabButton({
  children,
  highlighted,
  className,
  ...props
}: {
  children: ReactNode;
  highlighted?: boolean;
  className?: string;
  [key: string]: unknown;
}) {
  const color = highlighted ? "bg-white/20" : "";
  return (
    <AdminPageButton
      className={`${className ?? ""} ${color} text-white`}
      {...props}
    >
      {children}
    </AdminPageButton>
  );
}
