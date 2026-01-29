"use client";
import { useEffect, useState } from "react";
import { Tables } from "../../utils/supabase/database.types";
import AdminPageTableHeaderCell from "../common/AdminPageTableHeaderCell";
import UserManagementRow, { RowFlag } from "./UserManagementRow";
import AdminPageTable from "../common/AdminPageTable";
import TableEditorHeader from "../common/TableEditorHeader";

export default function UserManagementTab() {
  const [rowFlags, setRowFlags] = useState<Record<string, RowFlag>>({});
  const [userData, setUserData] = useState<Record<
    string,
    Tables<"photoclubuser">
  > | null>(null);
  const [roles, setRoles] = useState<ReadonlyArray<string> | null>(null);
  const refreshData = async () => {
    setUserData(null);
    setRoles(null);
    const userList = await (await fetch("/api/get-user-all")).json();
    const userRecord = userList.map((user: Tables<"photoclubuser">) => [
      user.id,
      user,
    ]);
    setUserData(Object.fromEntries(userRecord));
    const roleList: Tables<"photoclubrole">[] = await (
      await fetch("/api/get-role-all")
    ).json();
    const roleNameList = roleList.map((role) => role.roleid);
    setRoles(roleNameList);
    setRowFlags({});
  };
  useEffect(() => {
    refreshData();
  }, []);
  const setRowFlag = (id: string, rowFlag: RowFlag) => {
    setRowFlags((rowFlags) => {
      const newRowFlags = { ...rowFlags };
      if (rowFlag === RowFlag.NONE) delete newRowFlags[id];
      else newRowFlags[id] = rowFlag;
      return newRowFlags;
    });
  };
  const getRowFlag = (id: string) => {
    return rowFlags[id] ?? RowFlag.NONE;
  };
  const setUser = (id: string, user: Tables<"photoclubuser">) => {
    const newUserData: Record<string, Tables<"photoclubuser">> = {
      ...userData,
    };
    newUserData[id] = user;
    setUserData(newUserData);
  };

  const saveChanges = async () => {
    if (userData === null)
      throw new Error("Called saveChanges with userdata==null!");
    const toDelete: string[] = [];
    const toModify: Tables<"photoclubuser">[] = [];
    Object.entries(userData).forEach(([id, row]) => {
      if (rowFlags[id] === RowFlag.DELETED) toDelete.push(id);
      if (rowFlags[id] === RowFlag.MODIFIED) toModify.push(row);
    });
    setUserData(null);
    await fetch("/api/update-user-data", {
      method: "POST",
      body: JSON.stringify({ toDelete, toModify }),
    });
    await refreshData();
  };

  if (userData === null || roles === null) {
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
              <AdminPageTableHeaderCell className="w-2"></AdminPageTableHeaderCell>
              <AdminPageTableHeaderCell>ID</AdminPageTableHeaderCell>
              <AdminPageTableHeaderCell>Username</AdminPageTableHeaderCell>
              <AdminPageTableHeaderCell>Email</AdminPageTableHeaderCell>
              <AdminPageTableHeaderCell>Bio</AdminPageTableHeaderCell>
              <AdminPageTableHeaderCell>Role</AdminPageTableHeaderCell>
              <AdminPageTableHeaderCell>Delete</AdminPageTableHeaderCell>
            </tr>
          </thead>
          <tbody>
            {Object.entries(userData).map(([id, row]) => {
              return (
                <UserManagementRow
                  key={id}
                  rowFlag={getRowFlag(id)}
                  setRowFlag={(rowFlag: RowFlag) => setRowFlag(id, rowFlag)}
                  user={row}
                  setUser={(user) => setUser(id, user)}
                  roles={roles}
                ></UserManagementRow>
              );
            })}
          </tbody>
        </AdminPageTable>
      </>
    );
  }
}
