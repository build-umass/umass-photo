"use client";
import { useEffect, useState } from "react";
import { Tables } from "../utils/supabase/database.types";

export default function MePage() {
  const [profileData, setProfileData] = useState<Tables<"photoclubuser">>();

  useEffect(() => {
    (async () => {
      const response = await fetch("/api/get-user-self");
      if (!response.ok) {
        console.error("Failed to fetch user profile data");
        return;
      }
      const responseBody = await response.json();
      setProfileData(responseBody);
    })();
  }, []);

  if (profileData === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <section>
        <h1>My Profile</h1>
        <p>
          <strong>ID:</strong> {profileData.id}
        </p>
        <p>
          <strong>Username:</strong> {profileData.username}
        </p>
        <p>
          <strong>Email:</strong> {profileData.email}
        </p>
        <p>
          <strong>Role:</strong> {profileData.role}
        </p>
        {profileData.bio && <p>{profileData.bio}</p>}
      </section>
    </>
  );
}
