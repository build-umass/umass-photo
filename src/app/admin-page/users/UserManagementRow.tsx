import { Tables } from "@/app/utils/supabase/database.types";
import AdminPageTableCell from "../common/AdminPageTableCell";
import UmassPhotoButtonRed from "@/app/components/UmassPhotoButton/UmassPhotoButtonRed";
import AdminPageTableRow from "../common/AdminPageTableRow";

export enum RowFlag {
  MODIFIED,
  DELETED,
  NONE,
}

export default function UserManagementRow({
  rowFlag,
  setRowFlag,
  user,
  setUser,
  roles,
}: {
  rowFlag: RowFlag;
  setRowFlag: (rowFlag: RowFlag) => void;
  user: Tables<"photoclubuser">;
  setUser: (isDeleted: Tables<"photoclubuser">) => void;
  roles: ReadonlyArray<string>;
}) {
  const role = user.role;
  const setRole = (role: string) => {
    const newUser: Tables<"photoclubuser"> = { ...user };
    newUser.role = role;
    setUser(newUser);
    setRowFlag(RowFlag.MODIFIED);
  };

  const indicatorColor =
    rowFlag === RowFlag.MODIFIED
      ? "bg-yellow-500"
      : rowFlag === RowFlag.DELETED
        ? "bg-red-500"
        : "";

  return (
    <AdminPageTableRow>
      <AdminPageTableCell
        className={`w-2 ${indicatorColor}`}
      ></AdminPageTableCell>
      <AdminPageTableCell>{user.id}</AdminPageTableCell>
      <AdminPageTableCell>{user.username}</AdminPageTableCell>
      <AdminPageTableCell>{user.email}</AdminPageTableCell>
      <AdminPageTableCell>{user.bio}</AdminPageTableCell>
      <AdminPageTableCell>
        <select defaultValue={role} onChange={(e) => setRole(e.target.value)}>
          {roles.map((role) => (
            <option value={role} key={role}>
              {role}
            </option>
          ))}
        </select>
      </AdminPageTableCell>
      <AdminPageTableCell>
        <UmassPhotoButtonRed onClick={() => setRowFlag(RowFlag.DELETED)}>
          X
        </UmassPhotoButtonRed>
      </AdminPageTableCell>
    </AdminPageTableRow>
  );
}
