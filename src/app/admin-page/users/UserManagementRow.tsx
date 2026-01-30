import { Tables } from "@/app/utils/supabase/database.types";
import AdminPageTableCell from "../common/AdminPageTableCell";
import UmassPhotoButtonRed from "@/app/components/UmassPhotoButton/UmassPhotoButtonRed";
import AdminPageTableRow from "../common/AdminPageTableRow";
import { rowEquals } from "../common/rowEquals";
import { MdRefresh } from "react-icons/md";

export enum RowFlag {
  DELETED,
  NONE,
}

export default function UserManagementRow({
  rowFlag,
  setRowFlag,
  user,
  setUser,
  roles,
  savedUser,
}: {
  rowFlag: RowFlag;
  setRowFlag: (updater: (oldRowFlag: RowFlag) => RowFlag) => void;
  user: Readonly<Tables<"photoclubuser">>;
  setUser: (
    updater: (
      oldUser: Readonly<Tables<"photoclubuser">>,
    ) => Readonly<Tables<"photoclubuser">>,
  ) => void;
  roles: ReadonlyArray<string>;
  savedUser: Readonly<Tables<"photoclubuser">>;
}) {
  const role = user.role;
  const setRole = (role: string) => {
    setUser((oldUser) => {
      return {
        ...oldUser,
        role,
      };
    });
  };

  return (
    <AdminPageTableRow>
      <AdminPageTableCell>{user.id}</AdminPageTableCell>
      <AdminPageTableCell>{user.username}</AdminPageTableCell>
      <AdminPageTableCell>{user.email}</AdminPageTableCell>
      <AdminPageTableCell>{user.bio}</AdminPageTableCell>
      <AdminPageTableCell>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          {roles.map((role) => (
            <option value={role} key={role}>
              {role}
            </option>
          ))}
        </select>
      </AdminPageTableCell>
      <AdminPageTableCell>
        <UmassPhotoButtonRed
          onClick={() =>
            setRowFlag((flag) =>
              flag === RowFlag.DELETED ? RowFlag.NONE : RowFlag.DELETED,
            )
          }
        >
          {rowFlag === RowFlag.DELETED ? "Restore" : "Delete"}
        </UmassPhotoButtonRed>
      </AdminPageTableCell>
      <AdminPageTableCell>
        <UmassPhotoButtonRed
          onClick={() => setUser(() => savedUser)}
          disabled={rowEquals(user, savedUser)}
        >
          <MdRefresh></MdRefresh>
        </UmassPhotoButtonRed>
      </AdminPageTableCell>
    </AdminPageTableRow>
  );
}
