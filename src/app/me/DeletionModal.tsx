import { useState } from "react";
import ModalCommon from "../components/ChipLayout";
import UmassPhotoButton from "../components/UmassPhotoButton";
import { Tables } from "../utils/supabase/database.types";

export default function DeletionModal({
  closeCallback,
  user,
}: {
  closeCallback: () => void;
  user: Tables<"photoclubuser">;
}) {
  const [confirmationInputValue, setConfirmationInputValue] = useState("");
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
        />
        <div className="flex gap-4">
          <UmassPhotoButton
            className="bg-gray-400 text-white"
            onClick={closeCallback}
          >
            Cancel
          </UmassPhotoButton>
          <UmassPhotoButton
            className={`${confirmationInputValue === user.username ? "bg-umass-red" : "bg-gray-400 cursor-not-allowed"} text-white`}
            disabled={confirmationInputValue !== user.username}
            onClick={async () => {
                console.log("Delete account clicked");
              // Add account deletion logic here
            }}
          >
            Delete Account
          </UmassPhotoButton>
        </div>
      </div>
    </ModalCommon>
  );
}
