"use server";

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

export default async function Navbar() {
  return (
    <nav className="bg-umass-red sticky top-0 right-0 left-0 z-50 text-white">
      <div className="container mx-auto flex h-16 items-stretch">
        {/* Logo without hover */}
        <div className="flex h-full items-center px-6">
          <Link href="/" className="cursor-camera flex items-center">
            <Image
              src="/photo.jpg"
              alt="Photo Club Logo"
              width={40}
              height={40}
              className="cursor-camera mr-2"
            />
            <h1 className={`text-xl font-bold ${teachers.className}`}>
              UMass Photo
            </h1>
          </Link>
        </div>

        {/* Spacer */}
        <div className="grow"></div>

        {/* Navigation links - no visible separators */}
        <div className={`flex ${teachers.className}`}>
          <NavBarLink href={"/"}>Home</NavBarLink>
          <NavBarLink href={"/photo-gallery"}>Gallery</NavBarLink>
          <NavBarLink href={"/blogs"}>Blogs</NavBarLink>
          <NavBarLink href={"/events"}>Events</NavBarLink>
          <NavBarLink href={"/about"}>About</NavBarLink>
          <NavBarLink href={"/contact"}>Contact</NavBarLink>
          <UserChip></UserChip>
        </div>
      </div>
    </nav>
  );
}
