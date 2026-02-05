import { Tables } from "@/app/utils/supabase/database.types";
import { RowEditState, rowEquals } from "../common/rowEquals";
import AdminPageTableRow from "../common/AdminPageTableRow";
import AdminPageTableCell from "../common/AdminPageTableCell";
import UmassPhotoButtonRed from "@/app/components/UmassPhotoButton/UmassPhotoButtonRed";
import { MdRefresh } from "react-icons/md";

export default function BanManagementRow({
  value,
  onChange,
  savedValue,
}: {
  value: Readonly<RowEditState<Tables<"ban">>>;
  onChange: (
    updater: (
      oldUser: Readonly<RowEditState<Tables<"ban">>>,
    ) => Readonly<RowEditState<Tables<"ban">>>,
  ) => void;
  savedValue: Readonly<Tables<"ban">>;
}) {
  return (
    <AdminPageTableRow>
      <AdminPageTableCell>
        <input
          className="text-center"
          type="text"
          value={value.value.email ?? ""}
          placeholder="None"
          onChange={(e) =>
            onChange((oldBan) => ({
              ...oldBan,
              value: {
                ...oldBan.value,
                email: e.target.value || null,
              },
            }))
          }
        />
      </AdminPageTableCell>
      <AdminPageTableCell>
        <input
          className="text-center"
          type="text"
          value={value.value.ip ?? ""}
          placeholder="None"
          onChange={(e) =>
            onChange((oldBan) => ({
              ...oldBan,
              value: {
                ...oldBan.value,
                ip: e.target.value || null,
              },
            }))
          }
        />
      </AdminPageTableCell>
      <AdminPageTableCell>
        <input
          className="text-center"
          type="text"
          value={value.value.username ?? ""}
          placeholder="None"
          onChange={(e) =>
            onChange((oldBan) => ({
              ...oldBan,
              value: {
                ...oldBan.value,
                username: e.target.value || null,
              },
            }))
          }
        />
      </AdminPageTableCell>
      <AdminPageTableCell>
        <input
          type="text"
          value={value.value.reason ?? ""}
          onChange={(e) =>
            onChange((oldBan) => ({
              ...oldBan,
              value: {
                ...oldBan.value,
                reason: e.target.value,
              },
            }))
          }
        />
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
