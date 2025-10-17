"use client"
import { useEffect, useState } from "react";
import { Tables } from "../../utils/supabase/database.types";
import AdminPageTableHeaderCell from "../common/AdminPageTableHeaderCell";
import AdminPageButton from "../common/AdminPageButton";
import UserManagementRow, { RowFlag } from "./UserManagementRow";


export default function UserManagementTab() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [rowFlags, setRowFlags] = useState<Record<string, RowFlag>>({});
    const [userData, setUserData] = useState<Record<string, Tables<"photoclubuser">>>({});
    const refreshData = async () => {
        const response = await fetch("/api/get-user-all");
        const data = await response.json();
        const recordEntries = data.map((user: Tables<"photoclubuser">) => [user.id, user])
        setUserData(Object.fromEntries(recordEntries));
        setRowFlags({});
        setIsLoaded(true)
    }
    useEffect(() => {
        refreshData()
    }, [])
    const setRowFlag = (id: string, rowFlag: RowFlag) => {
        setRowFlags((rowFlags) => {
            const newRowFlags = { ...rowFlags };
            if (rowFlag === RowFlag.NONE) delete newRowFlags[id];
            else newRowFlags[id] = rowFlag;
            return newRowFlags;
        });
    }
    const getRowFlag = (id: string) => {
        return rowFlags[id] ?? RowFlag.NONE;
    }
    const setUser = (id: string, user: Tables<"photoclubuser">) => {
        const newUserData: Record<string, Tables<"photoclubuser">> = { ...userData }
        newUserData[id] = user;
        setUserData(newUserData);
    }

    const saveChanges = async () => {
        const toDelete: string[] = []
        const toModify: Tables<"photoclubuser">[] = []
        Object.entries(userData).forEach(([id, row]) => {
            if (rowFlags[id] === RowFlag.DELETED)
                toDelete.push(id);
            if (rowFlags[id] === RowFlag.MODIFIED)
                toModify.push(row);
        });
        setIsLoaded(false);
        await fetch("/api/update-user-data", {
            method: "POST",
            body: JSON.stringify({ toDelete, toModify })
        });
        await refreshData();
    }
    if (!isLoaded) {
        return <>loading...</>
    } else {
        return <div className="p-64">
            <h1 className="text-6xl text-umass-red">Users</h1>
            <table className="border-2">
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
                    {Object.entries(userData).map(([id, row]) => {
                        return <UserManagementRow
                            key={id}
                            rowFlag={getRowFlag(id)}
                            setRowFlag={(rowFlag: RowFlag) => (setRowFlag(id, rowFlag))}
                            user={row}
                            setUser={(user) => setUser(id, user)}
                        ></UserManagementRow>;
                    })}
                </tbody>
            </table>
            <AdminPageButton onClick={saveChanges}>SAVE</AdminPageButton>
        </div>
    }
}
