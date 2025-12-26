import { ReactNode } from "react";

export default function AdminPageTableCell({
  children,
  className,
  ...props
}: {
  children?: ReactNode;
  className?: string;
  [key: string]: unknown;
}) {
  return (
    <td className={`${className} text-umass-red p-2 text-center`} {...props}>
      {children}
    </td>
  );
}
