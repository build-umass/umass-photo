"use client";
import { useEffect, useState } from "react";
import UmassPhotoButton from "../components/UmassPhotoButton";
import DeletionModal from "./DeletionModal";
import LogoutButton from "./LogoutButton";
import { Tables } from "../utils/supabase/database.types";
import Image from "next/image";

type PhotoClubUserWithURL = Tables<"photoclubuser"> & {
  profilePictureURL: string;
};
export default function UserDataInterface() {
  const [profileData, setProfileData] = useState<PhotoClubUserWithURL>();
  const [bio, setBio] = useState("");
  const [deleteMenuOpen, setDeleteMenuOpen] = useState(false);

  async function loadProfile() {
    setProfileData(undefined);
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

    const response = await fetch("/api/update-account-self", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: profileData.id,
        bio: bio,
      }),
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
        <Image
          src={profileData.profilePictureURL}
          alt="Profile Picture"
          width={100}
          height={100}
          className="mx-auto rounded-full"
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
