"use client";

import { useState } from "react";
import ModalCommon from "../components/ChipLayout";
import UmassPhotoButton from "../components/UmassPhotoButton/UmassPhotoButton";
import { Tables } from "../utils/supabase/database.types";
import { useRouter } from "next/navigation";

export default function DeletionModal({
  closeCallback,
  user,
}: {
  closeCallback: () => void;
  user: Tables<"photoclubuser">;
}) {
  const [confirmationInputValue, setConfirmationInputValue] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setIsDeleting(true);

    const response = await fetch("/api/delete-account-self", {
      method: "DELETE",
    });

    if (!response.ok) {
      const data = await response.json();
      console.error("Error deleting account:", data.error);
    }

    router.push("/");
  }

  return (
    <ModalCommon>
      <div className="flex h-full flex-col items-center justify-center">
        <h2 className="mb-6 text-4xl font-bold">
          Are you sure you want to delete your account?
        </h2>
        <p className="mb-8 text-center text-2xl">
          This action is irreversible and will permanently remove all your data
          from our servers.
        </p>
        <p>Type {user.username} to confirm</p>
        <input
          type="text"
          value={confirmationInputValue}
          onChange={(e) => setConfirmationInputValue(e.target.value)}
          className="mb-6 w-1/2 rounded border border-gray-300 px-4 py-2 text-center text-2xl"
          disabled={isDeleting}
        />
        <div className="flex gap-4">
          <UmassPhotoButton
            className="bg-gray-400 text-white"
            onClick={closeCallback}
            disabled={isDeleting}
          >
            Cancel
          </UmassPhotoButton>
          <UmassPhotoButton
            className={`${confirmationInputValue === user.username && !isDeleting ? "bg-umass-red" : "cursor-not-allowed bg-gray-400"} text-white`}
            disabled={confirmationInputValue !== user.username || isDeleting}
            onClick={handleDelete}
          >
            {isDeleting ? "Deleting..." : "Delete Account"}
          </UmassPhotoButton>
        </div>
      </div>
    </ModalCommon>
  );
}
