import { Tables } from "@/app/utils/supabase/database.types";
import { RowEditState, rowEquals } from "../common/rowEquals";
import AdminPageTableRow from "../common/AdminPageTableRow";
import AdminPageTableCell from "../common/AdminPageTableCell";
import UmassPhotoButtonRed from "@/app/components/UmassPhotoButton/UmassPhotoButtonRed";
import { MdRefresh } from "react-icons/md";

export default function TagManagementRow({
  value,
  onChange,
  savedValue,
  eventName,
}: {
  value: Readonly<RowEditState<Tables<"tag">>>;
  onChange: (
    updater: (
      oldTag: Readonly<RowEditState<Tables<"tag">>>,
    ) => Readonly<RowEditState<Tables<"tag">>>,
  ) => void;
  savedValue: Readonly<Tables<"tag">>;
  eventName?: string;
}) {
  return (
    <AdminPageTableRow>
      <AdminPageTableCell>
        <span
          className={`${value.markedForDeletion ? "text-gray-400 line-through" : ""}`}
        >
          {value.value.name}
        </span>
      </AdminPageTableCell>
      <AdminPageTableCell>
        {eventName}
      </AdminPageTableCell>
      <AdminPageTableCell>
        <UmassPhotoButtonRed
          onClick={() =>
            onChange((oldTag) => ({
              ...oldTag,
              markedForDeletion: !oldTag.markedForDeletion,
            }))
          }
          disabled={!!eventName}
        >
          {value.markedForDeletion ? "Restore" : "Delete"}
        </UmassPhotoButtonRed>
      </AdminPageTableCell>
      <AdminPageTableCell>
        <UmassPhotoButtonRed
          onClick={() =>
            onChange(() => ({ markedForDeletion: false, value: savedValue }))
          }
          disabled={rowEquals(value.value, savedValue) && !value.markedForDeletion}
        >
          <MdRefresh size={24} className="mx-auto" />
        </UmassPhotoButtonRed>
      </AdminPageTableCell>
    </AdminPageTableRow>
  );
}
