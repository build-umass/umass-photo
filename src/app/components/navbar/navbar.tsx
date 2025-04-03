"use client";

import Link from "next/link";
import Image from "next/image";
import { Teachers } from "next/font/google";

const teachers = Teachers({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

export default function Navbar() {
  return (
    <nav className="bg-[#8f1229] p-4 text-white">
      <div className="container mx-auto flex items-center justify-between h-full">
        {/* logo and home page button */}
        <Link href="/" className="flex items-center h-full">
          <Image
            src="/photo.jpg"
            alt="Photo Club Logo"
            width={65}
            height={65}
            className="mr-2"
          />
          <h1 className={`text-2xl font-bold ${teachers.className}`}>
            UMass Photo
          </h1>
        </Link>

        {/* pages */}
        <div
          className={`flex space-x-6 text-xl font-bold ${teachers.className} h-full`}
        >
          {["Home", "Gallery", "Events", "About", "Contact"].map((page) => (
            <Link
              key={page}
              href={`/${page.toLowerCase()}`}
              className="relative h-full flex items-center px-3 group transition-all duration-200"
            >
              {/* underline hover effect */}
              <span className="relative z-10 group-hover:text-gray-300 transition-colors duration-200">
                {page}
              </span>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#B04A5A] scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
