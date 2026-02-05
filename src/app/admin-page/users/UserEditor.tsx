"use client";
import { useEffect, useMemo, useState } from "react";
import { Tables } from "../../utils/supabase/database.types";
import AdminPageTableHeaderCell from "../common/AdminPageTableHeaderCell";
import UserManagementRow from "./UserManagementRow";
import AdminPageTable from "../common/AdminPageTable";
import TableEditorHeader from "../common/TableEditorHeader";
import { useRouter } from "next/navigation";
import { RowEditState, rowEquals } from "../common/rowEquals";

export default function UserEditor({
  savedUserData: savedUserData,
  roleOptions,
}: {
  savedUserData: Readonly<Record<string, Tables<"photoclubuser">>>;
  roleOptions: ReadonlyArray<string>;
}) {
  const initialEditorState = Object.fromEntries(
    Object.entries(savedUserData).map(([id, value]) => [
      id,
      { markedForDeletion: false, value } as RowEditState<
        Tables<"photoclubuser">
      >,
    ]),
  );

  const [userData, setUserData] = useState(initialEditorState);

  const router = useRouter();

  // Check if there are unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    return Object.entries(userData).some(([id, row]) => {
      if (row.markedForDeletion) return true;
      if (!savedUserData[id]) return true;
      return !rowEquals(row.value, savedUserData[id]);
    });
  }, [userData, savedUserData]);

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

  const saveChanges = async () => {
    const toDelete: string[] = [];
    const toModify: Tables<"photoclubuser">[] = [];
    Object.entries(userData).forEach(([id, row]) => {
      if (row.markedForDeletion) toDelete.push(id);
      else if (!rowEquals(row.value, savedUserData[id]))
        toModify.push(row.value);
    });
    await fetch("/api/update-user-data", {
      method: "POST",
      body: JSON.stringify({ toDelete, toModify }),
    });
    router.refresh();
  };

  if (userData === null) {
    return <>loading...</>;
  } else {
    return (
      <>
        <TableEditorHeader
          tableName="Events"
          onSave={saveChanges}
        ></TableEditorHeader>
        <AdminPageTable>
          <thead>
            <tr>
              <AdminPageTableHeaderCell>ID</AdminPageTableHeaderCell>
              <AdminPageTableHeaderCell>Username</AdminPageTableHeaderCell>
              <AdminPageTableHeaderCell>Email</AdminPageTableHeaderCell>
              <AdminPageTableHeaderCell>Bio</AdminPageTableHeaderCell>
              <AdminPageTableHeaderCell>Role</AdminPageTableHeaderCell>
              <AdminPageTableHeaderCell>Delete</AdminPageTableHeaderCell>
              <AdminPageTableHeaderCell>Reset</AdminPageTableHeaderCell>
            </tr>
          </thead>
          <tbody>
            {Object.entries(userData).map(([id, row]) => {
              return (
                <UserManagementRow
                  key={id}
                  value={row}
                  onChange={(updater) =>
                    setUserData((oldData) => ({
                      ...oldData,
                      [id]: updater(oldData[id]),
                    }))
                  }
                  roles={roleOptions}
                  savedValue={savedUserData[id]}
                ></UserManagementRow>
              );
            })}
          </tbody>
        </AdminPageTable>
      </>
    );
  }
}
