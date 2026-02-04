"use client";
import { useEffect, useRef, useState } from "react";
import UmassPhotoButtonRed from "../components/UmassPhotoButton/UmassPhotoButtonRed";
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
      email_opt_in: profileData.email_opt_in,
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
        <h1 className="mb-6 text-left text-2xl">Edit Account</h1>
        <hr className="-mt-5 mb-5" />
        <div className="mb-6">
          <button
            className="block overflow-clip rounded-full"
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
        </div>

        <p className="mb-6 text-left text-xl">{profileData.username}</p>

        <div className="mb-6 space-y-3">
          <p className="text-left">
            <strong>Email:</strong> {profileData.email}
          </p>
          <p className="text-left">
            <strong>Role:</strong> {profileData.role}
          </p>
          <div className="flex items-center space-x-3">
            <label className="flex cursor-pointer items-center space-x-2">
              <input
                type="checkbox"
                checked={profileData.email_opt_in || false}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    email_opt_in: e.target.checked,
                  })
                }
                className="accent-umass-red h-4 w-4"
              />
              <span className="text-left">Receive email notifications</span>
            </label>
          </div>
          <div className="mb-8">
            <label className="mb-2 block text-left font-semibold">Bio:</label>
            <textarea
              className="w-full rounded-lg border border-white/30 bg-white/20 p-3 text-white placeholder-gray-300 backdrop-blur-sm"
              placeholder="Tell us about yourself..."
              value={profileData.bio || ""}
              onChange={(e) =>
                setProfileData({ ...profileData, bio: e.target.value })
              }
              rows={4}
            />
          </div>
        </div>

        <div className="">
          <UmassPhotoButton
            className={`${edited ? "bg-umass-red" : "bg-gray-400"} m-3 text-white`}
            onClick={() => saveProfile()}
          >
            Save
          </UmassPhotoButton>

          <LogoutButton />

          <UmassPhotoButton
            className="bg-umass-red m-3 text-white"
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
      </div>
    </>
  );
}
