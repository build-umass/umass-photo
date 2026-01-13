"use client";
import { useEffect, useRef, useState } from "react";
import UmassPhotoButton from "../components/UmassPhotoButton";
import DeletionModal from "./DeletionModal";
import LogoutButton from "./LogoutButton";
import { Tables, TablesUpdate } from "../utils/supabase/database.types";
import Image from "next/image";

type PhotoClubUserUpdateWithProfilePicture = TablesUpdate<"photoclubuser"> & {
  profilePicture?: string;
};

type PhotoClubUserWithURL = Tables<"photoclubuser"> & {
  profilePictureURL: string;
};
export default function UserDataInterface() {
  const [profileData, setProfileData] = useState<PhotoClubUserWithURL>();
  const profilePictureInput = useRef<HTMLInputElement>(null);
  const [selectedProfilePicture, setSelectedProfilePicture] =
    useState<string>();
  const [bio, setBio] = useState("");
  const [deleteMenuOpen, setDeleteMenuOpen] = useState(false);

  async function updateSelectedProfilePicture() {
    const file = profilePictureInput.current?.files?.item(0);
    if (file) {
      // Source - https://stackoverflow.com/a/49093626
      // Posted by user993683, modified by community. See post 'Timeline' for change history
      // Retrieved 2026-01-09, License - CC BY-SA 4.0

      setSelectedProfilePicture(
        await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const readerResult = reader.result;
            if (typeof readerResult === "object")
              reject("Reader result is not a string when reading as data URL");
            else resolve(readerResult);
          };
          reader.readAsDataURL(file);
        }),
      );
    }
  }

  async function loadProfile() {
    setProfileData(undefined);
    setSelectedProfilePicture(undefined);
    const response = await fetch("/api/get-user-self");
    if (!response.ok) {
      console.error("Failed to fetch user profile data");
      return;
    }
    const responseBody = await response.json();
    setProfileData(responseBody);
    setBio(responseBody.bio ?? "");
  }

  async function saveProfile() {
    if (!profileData) throw new Error("No profile data to save");

    const accountUpdate: PhotoClubUserUpdateWithProfilePicture = {
      id: profileData.id,
      bio: bio,
    };

    if (selectedProfilePicture) {
      accountUpdate.profilePicture = selectedProfilePicture;
    }

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

    await loadProfile();
  }

  useEffect(() => {
    loadProfile();
  }, []);

  if (profileData === undefined) {
    return <div>Loading...</div>;
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
            src={selectedProfilePicture || profileData.profilePictureURL}
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
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        ></textarea>
        <p>
          <strong>Email:</strong> {profileData.email}
        </p>
        <p>
          <strong>Role:</strong> {profileData.role}
        </p>
        <UmassPhotoButton
          className="bg-umass-red mx-auto block text-white"
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
