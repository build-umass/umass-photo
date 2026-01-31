import { Tables } from "@/app/utils/supabase/database.types";
import AdminPageTableCell from "../common/AdminPageTableCell";
import UmassPhotoButtonRed from "@/app/components/UmassPhotoButton/UmassPhotoButtonRed";
import AdminPageTableRow from "../common/AdminPageTableRow";
import { RowEditState, rowEquals } from "../common/rowEquals";
import { MdRefresh } from "react-icons/md";
import DateSelector from "./DateSelector";

export default function EventManagementRow({
  value,
  onChange,
  savedValue,
}: {
  value: Readonly<RowEditState<Tables<"event">>>;
  onChange: (
    updater: (
      oldEvent: Readonly<RowEditState<Tables<"event">>>,
    ) => Readonly<RowEditState<Tables<"event">>>,
  ) => void;
  savedValue: Readonly<Tables<"event">>;
}) {
  return (
    <AdminPageTableRow>
      <AdminPageTableCell>{value.value.id}</AdminPageTableCell>
      <AdminPageTableCell>
        <input
          value={value.value.name}
          onChange={(e) =>
            onChange((oldEvent) => ({
              ...oldEvent,
              value: {
                ...oldEvent.value,
                name: e.target.value,
              },
            }))
          }
        />
      </AdminPageTableCell>
      <AdminPageTableCell>
        <textarea
          value={value.value.description}
          onChange={(e) =>
            onChange((oldEvent) => ({
              ...oldEvent,
              value: {
                ...oldEvent.value,
                description: e.target.value,
              },
            }))
          }
        />
      </AdminPageTableCell>
      <AdminPageTableCell>
        <DateSelector
          value={value.value.startdate}
          onChange={(updater) =>
            onChange((oldEvent) => ({
              ...oldEvent,
              value: {
                ...oldEvent.value,
                startdate: updater(oldEvent.value.startdate),
              },
            }))
          }
        ></DateSelector>
      </AdminPageTableCell>
      <AdminPageTableCell>
        <DateSelector
          value={value.value.enddate}
          onChange={(updater) =>
            onChange((oldEvent) => ({
              ...oldEvent,
              value: {
                ...oldEvent.value,
                enddate: updater(oldEvent.value.enddate),
              },
            }))
          }
        ></DateSelector>
      </AdminPageTableCell>
      <AdminPageTableCell>{value.value.tag}</AdminPageTableCell>
      <AdminPageTableCell>
        <UmassPhotoButtonRed
          onClick={() =>
            onChange((oldEvent) => ({
              ...oldEvent,
              markedForDeletion: !oldEvent.markedForDeletion,
            }))
          }
        >
          {value.markedForDeletion ? "Restore" : "Delete"}
        </UmassPhotoButtonRed>
      </AdminPageTableCell>
      <AdminPageTableCell>
        <UmassPhotoButtonRed
          onClick={() =>
            onChange((oldEvent) => ({
              ...oldEvent,
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
