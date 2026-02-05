import { Tables } from "@/app/utils/supabase/database.types";
import AdminPageTableCell from "../common/AdminPageTableCell";
import UmassPhotoButtonRed from "@/app/components/UmassPhotoButton/UmassPhotoButtonRed";
import AdminPageTableRow from "../common/AdminPageTableRow";
import { RowEditState, rowEquals } from "../common/rowEquals";
import { MdRefresh } from "react-icons/md";

export default function UserManagementRow({
  value,
  onChange,
  roles,
  savedValue,
}: {
  value: Readonly<RowEditState<Tables<"photoclubuser">>>;
  onChange: (
    updater: (
      oldUser: Readonly<RowEditState<Tables<"photoclubuser">>>,
    ) => Readonly<RowEditState<Tables<"photoclubuser">>>,
  ) => void;
  roles: ReadonlyArray<string>;
  savedValue: Readonly<Tables<"photoclubuser">>;
}) {
  const role = value.value.role;

  return (
    <AdminPageTableRow>
      <AdminPageTableCell>{value.value.id}</AdminPageTableCell>
      <AdminPageTableCell>{value.value.username}</AdminPageTableCell>
      <AdminPageTableCell>{value.value.email}</AdminPageTableCell>
      <AdminPageTableCell>{value.value.bio}</AdminPageTableCell>
      <AdminPageTableCell>
        <select
          value={role}
          onChange={(e) =>
            onChange((oldUser) => ({
              ...oldUser,
              value: {
                ...oldUser.value,
                role: e.target.value,
              },
            }))
          }
        >
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
            onChange((oldUser) => ({
              ...oldUser,
              markedForDeletion: !oldUser.markedForDeletion,
            }))
          }
        >
          {value.markedForDeletion ? "Restore" : "Delete"}
        </UmassPhotoButtonRed>
      </AdminPageTableCell>
      <AdminPageTableCell>
        <UmassPhotoButtonRed
          onClick={() =>
            onChange((oldUser) => ({
              ...oldUser,
              markedForDeletion: false,
              value: savedValue,
            }))
          }
          disabled={
            rowEquals(value.value, savedValue) && !value.markedForDeletion
          }
        >
          <MdRefresh></MdRefresh>
        </UmassPhotoButtonRed>
      </AdminPageTableCell>
    </AdminPageTableRow>
  );
}
