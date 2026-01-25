"use client";
import { useEffect, useRef, useState } from "react";
import UmassPhotoButton from "../components/UmassPhotoButton";
import DeletionModal from "./DeletionModal";
import LogoutButton from "./LogoutButton";
import { Tables, TablesUpdate } from "../utils/supabase/database.types";
import Image from "next/image";
import { useRouter } from "next/navigation";

type PhotoClubUserUpdateWithProfilePicture = TablesUpdate<"photoclubuser"> & {
  profilePictureURL?: string;
};

type PhotoClubUserWithURL = Tables<"photoclubuser"> & {
  profilePictureURL?: string;
};

/**
 * Convert a File object into a data URL string.
 */
async function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // Source - https://stackoverflow.com/a/49093626
    // Posted by user993683, modified by community. See post 'Timeline' for change history
    // Retrieved 2026-01-09, License - CC BY-SA 4.0
    const reader = new FileReader();
    reader.onload = () => {
      const readerResult = reader.result;
      if (typeof readerResult === "object")
        reject("Reader result is not a string when reading as data URL");
      else resolve(readerResult);
    };
    reader.readAsDataURL(file);
  });
}

export default function UserDataInterface({
  initialProfileData,
}: {
  initialProfileData: PhotoClubUserWithURL;
}) {
  const [profileData, setProfileData] =
    useState<PhotoClubUserWithURL>(initialProfileData);
  const [edited, setEdited] = useState(false);
  const [deleteMenuOpen, setDeleteMenuOpen] = useState(false);
  const profilePictureInput = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // From https://www.wpeform.io/blog/exit-prompt-on-window-close-react-app/
  useEffect(() => {
    if (edited) {
      /**
       * Event handler that triggers confirmation dialog as recommended by
       * https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload
       */
      const handler = (event: BeforeUnloadEvent) => {
        event.preventDefault();
      };

      window.addEventListener("beforeunload", handler);
      return () => {
        window.removeEventListener("beforeunload", handler);
      };
    }
  }, [edited]);

  useEffect(() => {
    setEdited(true);
  }, [profileData]);

  async function updateSelectedProfilePicture() {
    const file = profilePictureInput.current?.files?.item(0);
    if (file) {
      setProfileData({
        ...profileData,
        profilePictureURL: await fileToDataURL(file),
      });
    }
  }

  async function saveProfile() {
    if (!profileData) throw new Error("No profile data to save");

    const accountUpdate: PhotoClubUserUpdateWithProfilePicture = {
      id: profileData.id,
      bio: profileData.bio,
      profilePictureURL: profileData.profilePictureURL,
    };

    const response = await fetch("/api/update-account-self", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(accountUpdate),
    });

    if (!response.ok) {
      console.error("Failed to save profile data");
    }

    setEdited(false);
    router.refresh();
  }

  return (
    <>
      <div className="relative z-10 min-w-1/2 bg-black/50 p-10 text-white">
        <h1 className="text-center text-2xl">Edit Account</h1>
        <button
          className="mx-auto block overflow-clip rounded-full"
          onClick={() => profilePictureInput.current?.click()}
        >
          <Image
            src={profileData.profilePictureURL || "/blank_profile.png"}
            alt="Profile Picture"
            width={100}
            height={100}
          />
        </button>
        <input
          type="file"
          className="aria-hidden hidden"
          onChange={updateSelectedProfilePicture}
          ref={profilePictureInput}
        />
        <p className="text-center text-xl">{profileData.username}</p>
        <textarea
          className="min-w-full text-white"
          value={profileData.bio || ""}
          onChange={(e) =>
            setProfileData({ ...profileData, bio: e.target.value })
          }
        ></textarea>
        <p>
          <strong>Email:</strong> {profileData.email}
        </p>
        <p>
          <strong>Role:</strong> {profileData.role}
        </p>
        <UmassPhotoButton
          className={`${edited ? "bg-umass-red" : "bg-gray-400"} mx-auto block text-white`}
          onClick={() => saveProfile()}
        >
          Save
        </UmassPhotoButton>
        <LogoutButton></LogoutButton>
        <UmassPhotoButton
          className="bg-umass-red mx-auto block text-white"
          onClick={() => setDeleteMenuOpen(true)}
        >
          Delete Account
        </UmassPhotoButton>
      </div>
      {deleteMenuOpen && (
        <DeletionModal
          closeCallback={() => setDeleteMenuOpen(false)}
          user={profileData}
        />
      )}
    </>
  );
}
