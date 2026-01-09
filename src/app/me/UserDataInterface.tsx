"use client";
import { useEffect, useState } from "react";
import UmassPhotoButton from "../components/UmassPhotoButton";
import DeletionModal from "./DeletionModal";
import LogoutButton from "./LogoutButton";
import { Tables } from "../utils/supabase/database.types";

export default function UserDataInterface() {
  const [profileData, setProfileData] = useState<Tables<"photoclubuser">>();
  const [bio, setBio] = useState("");
  const [deleteMenuOpen, setDeleteMenuOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const response = await fetch("/api/get-user-self");
      if (!response.ok) {
        console.error("Failed to fetch user profile data");
        return;
      }
      const responseBody = await response.json();
      setProfileData(responseBody);
      setBio(responseBody.bio ?? "");
    })();
  }, []);

  if (profileData === undefined) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div className="relative z-10 bg-black/50 p-10 text-white">
        <h1 className="text-center text-2xl">Edit Account</h1>
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
          onClick={() => setDeleteMenuOpen(true)}
        >
          Save
        </UmassPhotoButton>
        <LogoutButton></LogoutButton>
        <UmassPhotoButton
          className="bg-umass-red text-white"
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
