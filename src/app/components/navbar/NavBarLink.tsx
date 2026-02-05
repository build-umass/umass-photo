import Link from "next/link";
import { AnchorHTMLAttributes, ReactNode } from "react";

export default function NavBarLink({
  children,
  href,
  target,
}: {
  children: ReactNode;
  href: string;
  target?: AnchorHTMLAttributes<HTMLAnchorElement>["target"];
}) {
  return (
    <Link
      href={href}
      className="cursor-camera flex h-full items-center justify-center px-6 text-lg font-bold transition-colors duration-200 hover:bg-white/20"
      target={target}
    >
      {children}
    </Link>
  );
}
