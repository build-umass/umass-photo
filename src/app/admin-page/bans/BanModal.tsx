import ModalCommon from "@/app/components/ChipLayout";
import UmassPhotoButtonRed from "@/app/components/UmassPhotoButton/UmassPhotoButtonRed";
import { Tables, TablesInsert } from "@/app/utils/supabase/database.types";
import { useId, useMemo, useState } from "react";
import { uploadBan } from "./uploadBan";
import Link from "next/link";
import { MdRefresh } from "react-icons/md";
import { useRouter } from "next/navigation";

export default function BanModal({ onClose }: { onClose: () => void }) {
  const initialBan: TablesInsert<"ban"> = {
    reason: "",
  };
  const [newBan, setNewBan] = useState<TablesInsert<"ban">>(initialBan);
  const [usersBanned, setUsersBanned] = useState<
    ReadonlyArray<Tables<"photoclubuser">>
  >([]);
  const [fetchingUsers, setFetchingUsers] = useState(false);
  const [lastVerifiedFilters, setLastVerifiedFilters] =
    useState<TablesInsert<"ban">>(initialBan);
  const [pendingSubmission, setPendingSubmission] = useState(false);
  const router = useRouter();

  const modifiedSinceLastVerify = useMemo(() => {
    return (
      newBan.email !== lastVerifiedFilters.email ||
      newBan.ip !== lastVerifiedFilters.ip ||
      newBan.username !== lastVerifiedFilters.username
    );
  }, [
    newBan.email,
    newBan.ip,
    newBan.username,
    lastVerifiedFilters.email,
    lastVerifiedFilters.ip,
    lastVerifiedFilters.username,
  ]);

  async function updateBannedUsers() {
    // TODO implement this
  }

  const emailInputId = useId();
  const usernameInputId = useId();
  const ipInputId = useId();
  const reasonInputId = useId();

  return (
    <ModalCommon>
      <form
        className="flex grow flex-col items-center gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          setPendingSubmission(true);
          try {
            await uploadBan(newBan);
            router.refresh();
            onClose();
          } catch (e) {
            console.error("Failed to upload ban:", e);
            setPendingSubmission(false);
          }
        }}
      >
        <h1 className="text-xl font-bold">Create a New Ban Rule</h1>
        <p>
          Users might be banned for a variety of reasons. As such, you may want
          to set broad filters for filtering users. Leave fields blank to ignore
          them. You can use regex to filter these properties. For instance, to
          ban users that have a certain IP range, use{" "}
          <code className="bg-gray-300">^192\.168\.%</code> to ban all IPs
          starting with <code className="bg-gray-300">192.168</code>. See{" "}
          <Link
            className="underline"
            href="https://www.postgresql.org/docs/current/functions-matching.html#FUNCTIONS-POSIX-REGEXP"
            target="_blank"
          >
            Postgres Documentation
          </Link>{" "}
          for more information on how to write patterns.
          {/* TODO: complete this description */}
        </p>
        <label htmlFor={emailInputId} className="text-lg">
          Email pattern
        </label>
        <input
          className="text-center"
          name="email"
          id={emailInputId}
          placeholder="None"
          value={newBan.email ?? ""}
          onChange={(e) =>
            setNewBan({ ...newBan, email: e.target.value || null })
          }
        ></input>
        <label htmlFor={usernameInputId} className="text-lg">
          Username pattern
        </label>
        <input
          className="text-center"
          name="username"
          id={usernameInputId}
          placeholder="None"
          value={newBan.username ?? ""}
          onChange={(e) =>
            setNewBan({ ...newBan, username: e.target.value || null })
          }
        ></input>
        <label htmlFor={ipInputId} className="text-lg">
          IP pattern
        </label>
        <input
          className="text-center"
          name="ip"
          id={ipInputId}
          placeholder="None"
          value={newBan.ip ?? ""}
          onChange={(e) => setNewBan({ ...newBan, ip: e.target.value || null })}
        ></input>
        <label htmlFor={reasonInputId} className="text-lg">
          Reason
        </label>
        <input
          className="text-center"
          name="reason"
          placeholder="Provide a reason for the ban"
          id={reasonInputId}
          value={newBan.reason}
          onChange={(e) => setNewBan({ ...newBan, reason: e.target.value })}
        ></input>
        The following users will be banned by this rule:
        <div className="flex gap-2">
          {usersBanned.map((user) => (
            <span key={user.id} className="bg-gray-300">
              {user.username} &lt;{user.email}&gt;
            </span>
          ))}
        </div>
        <UmassPhotoButtonRed
          onClick={updateBannedUsers}
          disabled={!modifiedSinceLastVerify}
          type="button"
        >
          <MdRefresh></MdRefresh>
        </UmassPhotoButtonRed>
        <div className="mt-auto flex justify-between self-stretch">
          <UmassPhotoButtonRed onClick={onClose} type="button">
            Close
          </UmassPhotoButtonRed>
          <UmassPhotoButtonRed type="submit" disabled={pendingSubmission}>
            Save
          </UmassPhotoButtonRed>
        </div>
      </form>
    </ModalCommon>
  );
}
