"use client";
import { useState } from "react";
import { Tables } from "../../utils/supabase/database.types";
import AdminPageTableHeaderCell from "../common/AdminPageTableHeaderCell";
import UserManagementRow, { RowFlag } from "./UserManagementRow";
import AdminPageTable from "../common/AdminPageTable";
import TableEditorHeader from "../common/TableEditorHeader";
import { useRouter } from "next/navigation";
import { rowEquals } from "../common/rowEquals";

export default function UserEditor({
  defaultUserData,
  roleOptions,
}: {
  defaultUserData: Readonly<Record<string, Tables<"photoclubuser">>>;
  roleOptions: ReadonlyArray<string>;
}) {
  const [rowFlags, setRowFlags] = useState<Readonly<Record<string, RowFlag>>>(
    {},
  );
  const [userData, setUserData] =
    useState<Readonly<Record<string, Tables<"photoclubuser">>>>(
      defaultUserData,
    );

  const router = useRouter();

  const setRowFlag = (
    id: string,
    updater: (oldRowFlag: RowFlag) => RowFlag,
  ) => {
    setRowFlags((rowFlags) => {
      const newRowFlag = updater(rowFlags[id] ?? RowFlag.NONE);
      if (newRowFlag === RowFlag.NONE) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [id]: _, ...newRowFlags } = rowFlags;
        return newRowFlags;
      } else {
        return { ...rowFlags, [id]: newRowFlag };
      }
    });
  };

  const setUser = (
    id: string,
    updater: (
      oldUser: Readonly<Tables<"photoclubuser">>,
    ) => Readonly<Tables<"photoclubuser">>,
  ) => {
    setUserData((oldUserData) => {
      return {
        ...oldUserData,
        [id]: updater(oldUserData[id]),
      };
    });
  };

  const saveChanges = async () => {
    const toDelete: string[] = [];
    const toModify: Tables<"photoclubuser">[] = [];
    Object.entries(userData).forEach(([id, row]) => {
      if (rowFlags[id] === RowFlag.DELETED) toDelete.push(id);
      if (!rowEquals(row, defaultUserData[id])) toModify.push(row);
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
                  rowFlag={rowFlags[id] ?? RowFlag.NONE}
                  setRowFlag={(updater) => setRowFlag(id, updater)}
                  user={row}
                  setUser={(updater) => setUser(id, updater)}
                  roles={roleOptions}
                  savedUser={userData[id]}
                ></UserManagementRow>
              );
            })}
          </tbody>
        </AdminPageTable>
      </>
    );
  }
}
