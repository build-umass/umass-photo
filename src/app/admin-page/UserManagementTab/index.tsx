"use client";
import { useEffect, useState } from "react";
import { Tables } from "../../utils/supabase/database.types";
import AdminPageTableHeaderCell from "../common/AdminPageTableHeaderCell";
import AdminPageButton from "../common/AdminPageButton";
import UserManagementRow, { RowFlag } from "./UserManagementRow";

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
      <div className="flex grow flex-col bg-gray-100 p-24">
        <div className="flex justify-between">
          <h1 className="text-umass-red text-6xl font-bold">Users</h1>
          <AdminPageButton onClick={saveChanges}>SAVE</AdminPageButton>
        </div>
        <table className="border-2 border-gray-200 drop-shadow-xl">
          <tbody>
            <tr>
              <AdminPageTableHeaderCell className="w-2"></AdminPageTableHeaderCell>
              <AdminPageTableHeaderCell>ID</AdminPageTableHeaderCell>
              <AdminPageTableHeaderCell>Username</AdminPageTableHeaderCell>
              <AdminPageTableHeaderCell>Email</AdminPageTableHeaderCell>
              <AdminPageTableHeaderCell>Bio</AdminPageTableHeaderCell>
              <AdminPageTableHeaderCell>Role</AdminPageTableHeaderCell>
              <AdminPageTableHeaderCell>Delete</AdminPageTableHeaderCell>
            </tr>
            {Object.entries(userData).map(([id, row], index) => {
              return (
                <UserManagementRow
                  key={id}
                  rowFlag={getRowFlag(id)}
                  setRowFlag={(rowFlag: RowFlag) => setRowFlag(id, rowFlag)}
                  user={row}
                  setUser={(user) => setUser(id, user)}
                  index={index}
                  roles={roles}
                ></UserManagementRow>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
