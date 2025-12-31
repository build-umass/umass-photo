"use client";

import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Footer() {
  return (
    <footer className="bg-gray-200">
      <div className="mx-auto max-w-7xl px-3 py-15">
        <div className="flex flex-wrap justify-between">
          <div className="">
            <h3 className="font-Jaldi mb-4 text-3xl font-bold text-[#971B2F]">
              Umass Photo
            </h3>
            <div className="mb-4 flex space-x-6 hover:underline">
              <a
                className="cursor-camera text-gray-500 hover:text-gray-700"
                href="#"
              >
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a
                className="cursor-camera text-gray-500 hover:text-gray-700"
                href="#"
              >
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
              <a
                className="cursor-camera text-gray-500 hover:text-gray-700"
                href="#"
              >
                <FontAwesomeIcon icon={faYoutube} />
              </a>
              <a
                className="cursor-camera text-gray-500 hover:text-gray-700"
                href="#"
              >
                <FontAwesomeIcon icon={faInstagram} />
              </a>
            </div>
            <p className="text-base font-normal text-gray-400">
              Website © BUILD Umass 2025
            </p>
          </div>
          <div className="ml-auto flex space-x-20">
            <div className="">
              <h3 className="font-Jaldi mb-6 text-lg font-bold text-gray-700">
                Gallery
              </h3>
              <div className="flex flex-col space-y-2">
                <a
                  className="font-Jaldi cursor-camera mb-4 block text-gray-700 hover:underline"
                  href="/photo-gallery"
                >
                  All Photos
                </a>
                <a
                  className="font-Jaldi cursor-camera block text-gray-700 hover:underline"
                  href="#"
                >
                  Submit Your photos
                </a>
              </div>
            </div>
            <div className="">
              <h3 className="font-Jaldi mb-6 text-lg font-bold text-gray-700">
                Events
              </h3>
              <div className="flex flex-col space-y-2">
                <div className="font-Jaldi flex flex-col space-y-2">
                  <a
                    className="font-Jaldi cursor-camera mb-4 block text-gray-700 hover:underline"
                    href="#"
                  >
                    Spring contest
                  </a>
                  <a
                    className="font-Jaldi cursor-camera mb-4 block text-gray-700 hover:underline"
                    href="#"
                  >
                    Fall Foliage Contest
                  </a>
                  <a
                    className="font-Jaldi cursor-camera block text-gray-700 hover:underline"
                    href="#"
                  >
                    Summer Contest
                  </a>
                </div>
              </div>
            </div>
            <div className="">
              <h3 className="font-Jaldi mb-6 text-lg font-bold text-gray-700">
                Mission
              </h3>
              <div className="flex flex-col space-y-2">
                <div className="flex flex-col space-y-2">
                  <a
                    className="font-Jaldi cursor-camera mb-4 block text-gray-700 hover:underline"
                    href="#"
                  >
                    Our Story
                  </a>
                  <a
                    className="font-Jaldi cursor-camera block text-gray-700 hover:underline"
                    href="#"
                  >
                    E-Board
                  </a>
                </div>
              </div>
            </div>
            <div className="">
              <h3 className="font-Jaldi mb-6 text-lg font-bold text-gray-700">
                Contact
              </h3>
              <div className="flex flex-col space-y-2">
                <div className="flex flex-col space-y-2">
                  <a
                    className="font-Jaldi cursor-camera mb-4 block text-gray-700 hover:underline"
                    href="#"
                  >
                    Instagram
                  </a>
                  <a
                    className="font-Jaldi cursor-camera mb-4 block text-gray-700 hover:underline"
                    href="#"
                  >
                    Email
                  </a>
                  <a
                    className="font-Jaldi cursor-camera block text-gray-700 hover:underline"
                    href="#"
                  >
                    Page
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
