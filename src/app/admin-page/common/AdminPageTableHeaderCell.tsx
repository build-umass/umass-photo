import { ReactNode } from "react";

export default function AdminPageTableHeaderCell({
  children,
  className,
  ...props
}: {
  children?: ReactNode;
  className?: string;
  [key: string]: unknown;
}) {
  return (
    <th
      className={`${className ?? ""} bg-umass-red p-5 text-center text-4xl text-white`}
      {...props}
    >
      {children}
    </th>
  );
}
