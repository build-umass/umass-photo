import { Tables } from "@/app/utils/supabase/database.types";
import AdminPageTableCell from "../common/AdminPageTableCell";
import AdminPageButton from "../common/AdminPageButton";

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
    index,
}: {
    rowFlag: RowFlag;
    setRowFlag: (rowFlag: RowFlag) => void;
    user: Tables<"photoclubuser">;
    setUser: (isDeleted: Tables<"photoclubuser">) => void;
    index: number;
}) {
    const role = user.role;
    const setRole = (role: string) => {
        const newUser: Tables<"photoclubuser"> = { ...user };
        newUser.role = role
        setUser(newUser);
        setRowFlag(RowFlag.MODIFIED)
    }

    const indicatorColor = rowFlag === RowFlag.MODIFIED ? "bg-yellow-500" :
        rowFlag === RowFlag.DELETED ? "bg-red-500" : "";

    const rowBackgroundColor = index % 2 == 1 ? "bg-gray-200" : "bg-gray-100";

    return <tr className={rowBackgroundColor}>
        <AdminPageTableCell className={`w-2 ${indicatorColor}`}></AdminPageTableCell>
        <AdminPageTableCell>{user.id}</AdminPageTableCell>
        <AdminPageTableCell>{user.username}</AdminPageTableCell>
        <AdminPageTableCell>{user.email}</AdminPageTableCell>
        <AdminPageTableCell>{user.bio}</AdminPageTableCell>
        <AdminPageTableCell>
            <input className="bg-amber-200" value={role} onChange={(e) => setRole(e.target.value)}></input>
        </AdminPageTableCell>
        <AdminPageTableCell>
            <AdminPageButton className="bg-umass-red text-white" onClick={() => setRowFlag(RowFlag.DELETED)}>X</AdminPageButton>
        </AdminPageTableCell>
    </tr>
}