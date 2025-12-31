import Link from "next/link";
import { ReactNode } from "react";

export default function NavBarLink({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="cursor-camera flex h-full items-center justify-center px-6 text-lg font-bold transition-colors duration-200 hover:bg-white/20"
    >
      {children}
    </Link>
  );
}
