import { Tables } from "@/app/utils/supabase/database.types";
import AdminPageTableCell from "../common/AdminPageTableCell";

export enum RowFlag {
    MODIFIED,
    DELETED,
    NONE
}

export default function UserManagementRow({
    rowFlag,
    setRowFlag,
    user,
    setUser,
}: {
    rowFlag: RowFlag;
    setRowFlag: (rowFlag: RowFlag) => void;
    user: Tables<"photoclubuser">;
    setUser: (isDeleted: Tables<"photoclubuser">) => void;
}) {
    const role = user.role;
    const setRole = (role: string) => {
        const newUser: Tables<"photoclubuser"> = { ...user };
        newUser.role = role
        setUser(newUser);
        setRowFlag(RowFlag.MODIFIED)
    }

    const colorClass = rowFlag === RowFlag.MODIFIED ? "bg-yellow-500" :
        rowFlag === RowFlag.DELETED ? "bg-red-500" : "";
    return <tr>
        <AdminPageTableCell className={`w-2 ${colorClass}`}></AdminPageTableCell>
        <AdminPageTableCell>{user.id}</AdminPageTableCell>
        <AdminPageTableCell>{user.username}</AdminPageTableCell>
        <AdminPageTableCell>{user.email}</AdminPageTableCell>
        <AdminPageTableCell>{user.bio}</AdminPageTableCell>
        <AdminPageTableCell>
            <input className="bg-amber-200" value={role} onChange={(e) => setRole(e.target.value)}></input>
        </AdminPageTableCell>
        <AdminPageTableCell>
            <button className="bg-red-500" onClick={() => setRowFlag(RowFlag.DELETED)}>DELETE</button>
        </AdminPageTableCell>
    </tr>
}