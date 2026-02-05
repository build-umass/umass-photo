"use server";

import { createClient } from "@/app/utils/supabase/server";
import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default async function Footer() {
  const client = await createClient();
  const { data: recentEvents } = await client
    .from("event")
    .select("*")
    .order("enddate", { ascending: true })
    .gte("enddate", new Date().toISOString())
    .limit(3)
    .throwOnError();

  return (
    <footer className="bg-gray-200">
      <div className="mx-auto max-w-7xl px-3 py-15">
        <div className="flex flex-wrap justify-between">
          <div className="">
            <h3 className="font-Jaldi mb-4 text-3xl font-bold text-[#971B2F]">
              Umass Photo
            </h3>
            <div className="mb-4 flex space-x-6 hover:underline">
              <Link
                className="cursor-camera text-gray-500 hover:text-gray-700"
                href="#"
              >
                <FontAwesomeIcon icon={faFacebook} />
              </Link>
              <Link
                className="cursor-camera text-gray-500 hover:text-gray-700"
                href="#"
              >
                <FontAwesomeIcon icon={faLinkedin} />
              </Link>
              <Link
                className="cursor-camera text-gray-500 hover:text-gray-700"
                href="#"
              >
                <FontAwesomeIcon icon={faYoutube} />
              </Link>
              <Link
                className="cursor-camera text-gray-500 hover:text-gray-700"
                href="#"
              >
                <FontAwesomeIcon icon={faInstagram} />
              </Link>
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
                <Link
                  className="font-Jaldi cursor-camera mb-4 block text-gray-700 hover:underline"
                  href="/photo-gallery"
                >
                  All Photos
                </Link>
                <Link
                  className="font-Jaldi cursor-camera block text-gray-700 hover:underline"
                  href={`/photo-gallery?${new URLSearchParams({
                    uploadingPhoto: "true",
                  }).toString()}`}
                >
                  Submit Your photos
                </Link>
              </div>
            </div>
            <div className="">
              <h3 className="font-Jaldi mb-6 text-lg font-bold text-gray-700">
                Events
              </h3>
              <div className="flex flex-col space-y-2">
                <div className="font-Jaldi flex flex-col space-y-2">
                  {recentEvents.map((event) => {
                    const params = new URLSearchParams({
                      selectedTags: event.tag,
                    });
                    return (
                      <Link
                        key={event.id}
                        className="font-Jaldi cursor-camera mb-4 block text-gray-700 hover:underline"
                        href={`/photo-gallery?${params.toString()}`}
                      >
                        {event.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="">
              <h3 className="font-Jaldi mb-6 text-lg font-bold text-gray-700">
                Mission
              </h3>
              <div className="flex flex-col space-y-2">
                <div className="flex flex-col space-y-2">
                  <Link
                    className="font-Jaldi cursor-camera mb-4 block text-gray-700 hover:underline"
                    href="#"
                  >
                    Our Story
                  </Link>
                  <Link
                    className="font-Jaldi cursor-camera block text-gray-700 hover:underline"
                    href="#"
                  >
                    E-Board
                  </Link>
                </div>
              </div>
            </div>
            <div className="">
              <h3 className="font-Jaldi mb-6 text-lg font-bold text-gray-700">
                Contact
              </h3>
              <div className="flex flex-col space-y-2">
                <div className="flex flex-col space-y-2">
                  <Link
                    className="font-Jaldi cursor-camera block text-gray-700 hover:underline"
                    href={"https://linktr.ee/umassphotoofficial"}
                    target="_blank"
                  >
                    Linktree
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
