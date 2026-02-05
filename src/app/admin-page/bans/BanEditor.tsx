"use client";

import { Tables } from "@/app/utils/supabase/database.types";
import BanManagementRow from "./BanManagementRow";
import AdminPageTable from "../common/AdminPageTable";
import { RowEditState, rowEquals } from "../common/rowEquals";
import { useEffect, useMemo, useState } from "react";
import TableEditorHeader from "../common/TableEditorHeader";
import AdminPageTableHeaderCell from "../common/AdminPageTableHeaderCell";
import UmassPhotoButtonRed from "@/app/components/UmassPhotoButton/UmassPhotoButtonRed";
import BanModal from "./BanModal";
import { useRouter } from "next/navigation";
import { saveBans } from "./saveBans";

export default function BanEditor({
  savedBans,
}: {
  savedBans: Readonly<Record<string, Readonly<Tables<"ban">>>>;
}) {
  const initialEditorState: ReadonlyArray<RowEditState<Tables<"ban">>> =
    Object.values(savedBans).map((ban) => ({
      value: ban,
      markedForDeletion: false,
    }));
  const [editorState, setEditorState] =
    useState<ReadonlyArray<RowEditState<Tables<"ban">>>>(initialEditorState);
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);

  const router = useRouter();

  // Check if there are unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    return editorState.some((row) => {
      if (row.markedForDeletion) return true;
      const savedBan = savedBans[row.value.id];
      if (!savedBan) return true;
      return !rowEquals(row.value, savedBan);
    });
  }, [editorState, savedBans]);

  // Show browser confirmation dialog when navigating away with unsaved changes
  useEffect(() => {
    if (hasUnsavedChanges) {
      const handler = (event: BeforeUnloadEvent) => {
        event.preventDefault();
      };
      window.addEventListener("beforeunload", handler);
      return () => {
        window.removeEventListener("beforeunload", handler);
      };
    }
  }, [hasUnsavedChanges]);

  function reSyncEditorState() {
    router.refresh();
    console.log("Resyncing editor state");
    setEditorState(initialEditorState);
  }

  async function saveData() {
    const toDelete = editorState
      .filter((row) => row.markedForDeletion)
      .map((row) => row.value.id);
    const toUpdate = editorState
      .filter(
        (row) =>
          !row.markedForDeletion &&
          !rowEquals(row.value, savedBans[row.value.id]),
      )
      .map((row) => row.value);
    try {
      await saveBans(toUpdate, toDelete);
    } catch {}
  }

  return (
    <>
      <TableEditorHeader onSave={saveData} tableName="Bans"></TableEditorHeader>
      <AdminPageTable>
        <thead>
          <tr>
            <AdminPageTableHeaderCell>Email</AdminPageTableHeaderCell>
            <AdminPageTableHeaderCell>IP</AdminPageTableHeaderCell>
            <AdminPageTableHeaderCell>Username</AdminPageTableHeaderCell>
            <AdminPageTableHeaderCell>Reason</AdminPageTableHeaderCell>
            <AdminPageTableHeaderCell>Delete</AdminPageTableHeaderCell>
            <AdminPageTableHeaderCell>Reset</AdminPageTableHeaderCell>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-gray-100 even:bg-gray-200">
            <td colSpan={6}>
              <div className="flex justify-center py-2">
                <UmassPhotoButtonRed onClick={() => setIsEditorOpen(true)}>
                  + Add New Ban
                </UmassPhotoButtonRed>
              </div>
            </td>
          </tr>
          {editorState.map((banState, index) => (
            <BanManagementRow
              key={banState.value.id}
              value={banState}
              savedValue={savedBans[banState.value.id]}
              onChange={(updater) => {
                setEditorState((oldState) => {
                  const newState = [...oldState];
                  newState[index] = updater(oldState[index]);
                  return newState;
                });
              }}
            ></BanManagementRow>
          ))}
        </tbody>
      </AdminPageTable>
      {isEditorOpen && (
        <BanModal
          onClose={() => {
            setIsEditorOpen(false);
          }}
          onSave={() => {
            reSyncEditorState();
          }}
        ></BanModal>
      )}
    </>
  );
}
