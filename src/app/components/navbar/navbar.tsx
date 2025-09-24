"use client";

import Link from "next/link";
import Image from "next/image";
import { Teachers } from "next/font/google";
import NavBarLink from "./NavBarLink";
import UserChip from "./UserChip";

const teachers = Teachers({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

export default function Navbar() {
  return (
    <nav className="bg-[#8E122A] text-white">
      <div className="container mx-auto flex items-stretch h-16">
        {/* Logo without hover */}
        <div className="flex items-center px-6 h-full">
          <Link href="/" className="flex items-center">
            <Image
              src="/photo.jpg"
              alt="Photo Club Logo"
              width={40}
              height={40}
              className="mr-2"
            />
            <h1 className={`text-xl font-bold ${teachers.className}`}>
              UMass Photo
            </h1>
          </Link>
        </div>

        {/* Spacer */}
        <div className="flex-grow"></div>

        {/* Navigation links - no visible separators */}
        <div className={`flex ${teachers.className}`}>
          {["Home", "Gallery", "Events", "About", "Contact"].map((page) => (
            <NavBarLink key={page} href={`/${page.toLowerCase()}`}>
              {page}
            </NavBarLink>
          ))}
          <UserChip></UserChip>
        </div>
      </div>
    </nav>
  );
}
