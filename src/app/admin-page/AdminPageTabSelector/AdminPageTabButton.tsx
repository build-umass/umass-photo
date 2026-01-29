"use client";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminPageTabButton({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) {
  const pathname = usePathname();

  // TODO normalize these
  const selected = href === pathname;

  if (selected)
    return (
      <Link
        className={
          "bg-umass-red-dark cursor-camera p-5 text-3xl font-bold text-white transition-colors duration-500"
        }
        href={href}
      >
        {children}
      </Link>
    );
  else
    return (
      <Link
        className={
          "bg-umass-red hover:bg-umass-red-dark cursor-camera p-5 text-3xl font-bold text-white transition-colors duration-500"
        }
        href={href}
      >
        {children}
      </Link>
    );
}
