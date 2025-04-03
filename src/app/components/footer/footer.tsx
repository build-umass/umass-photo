"use client";

import Link from "next/link";
import Image from "next/image";
import { Teachers } from "next/font/google";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa"; 

const teachers = Teachers({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

export default function Footer() {
  return (
    <footer className="bg-gray-100 p-8 text-gray-800">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-8">
            <Image
              src="/photo.jpg"
              alt="Photo Club Logo"
              width={80}
              height={80}
              className="mb-4 md:mb-0"
            />

            <div className="flex flex-col space-y-2">
              <h1
                className={`text-3xl font-bold ${teachers.className} text-[#8f1229]`}
              >
                UMass Photo
              </h1>
              <div className="flex space-x-4">
                <Link
                  href="/gallery"
                  className="text-gray-700 hover:text-[#8f1229] transition-colors duration-200"
                >
                  <FaFacebook className="h-6 w-6" />
                </Link>

                <Link
                  href="/events"
                  className="text-gray-700 hover:text-[#8f1229] transition-colors duration-200"
                >
                  <FaInstagram className="h-6 w-6" />
                </Link>

                <Link
                  href="/about"
                  className="text-gray-700 hover:text-[#8f1229] transition-colors duration-200"
                >
                  <FaLinkedin className="h-6 w-6" />
                </Link>

                <Link
                  href="/contact"
                  className="text-gray-700 hover:text-[#8f1229] transition-colors duration-200"
                >
                  <FaYoutube className="h-6 w-6" />
                </Link>
              </div>
              <div className="text-gray-600">
                <p>
                  &copy; {new Date().getFullYear()} UMass Photo. All rights
                  reserved.
                </p>
              </div>
            </div>
          </div>

          {/* gallery */}
          <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-16 mt-6 md:mt-0">
            <div>
              <h2 className="text-xl font-bold text-[#8f1229] mb-4">Gallery</h2>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/gallery"
                    className="text-gray-700 hover:text-[#8f1229] transition-colors duration-200"
                  >
                    View Gallery
                  </Link>
                </li>
                <li>
                  <Link
                    href="/gallery"
                    className="text-gray-700 hover:text-[#8f1229] transition-colors duration-200"
                  >
                    Submit Your Photos
                  </Link>
                </li>
              </ul>
            </div>

            {/* events */}
            <div>
              <h2 className="text-xl font-bold text-[#8f1229] mb-4">Events</h2>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/events"
                    className="text-gray-700 hover:text-[#8f1229] transition-colors duration-200"
                  >
                    Upcoming Events
                  </Link>
                </li>
                <li>
                  <Link
                    href="/events"
                    className="text-gray-700 hover:text-[#8f1229] transition-colors duration-200"
                  >
                    Past Events
                  </Link>
                </li>
              </ul>
            </div>

            {/* mission */}
            <div>
              <h2 className="text-xl font-bold text-[#8f1229] mb-4">Mission</h2>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-700 hover:text-[#8f1229] transition-colors duration-200"
                  >
                    Our Mission
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-gray-700 hover:text-[#8f1229] transition-colors duration-200"
                  >
                    Meet the Team
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
