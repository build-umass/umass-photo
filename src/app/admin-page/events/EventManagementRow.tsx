import { Tables } from "@/app/utils/supabase/database.types";
import AdminPageTableCell from "../common/AdminPageTableCell";
import UmassPhotoButtonRed from "@/app/components/UmassPhotoButton/UmassPhotoButtonRed";
import AdminPageTableRow from "../common/AdminPageTableRow";

/**
 * Converts a Date object into the datetime-local format
 */
function dateToDateTimeLocalString(date: Date) {
  date = new Date(date);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

export enum RowFlag {
  MODIFIED,
  DELETED,
  NONE,
}

export default function EventManagementRow({
  rowFlag,
  setRowFlag,
  event,
  setEvent,
}: {
  rowFlag: RowFlag;
  setRowFlag: (rowFlag: RowFlag) => void;
  event: Tables<"event">;
  setEvent: (ev: Tables<"event">) => void;
}) {
  const tag = event.tag;

  const setName = (name: string) => {
    const newEvent: Tables<"event"> = { ...event };
    newEvent.name = name;
    setEvent(newEvent);
    setRowFlag(RowFlag.MODIFIED);
  };

  const setDescription = (description: string) => {
    const newEvent: Tables<"event"> = { ...event };
    newEvent.description = description;
    setEvent(newEvent);
    setRowFlag(RowFlag.MODIFIED);
  };

  const setStart = (value: Date) => {
    const newEvent: Tables<"event"> = { ...event };
    newEvent.startdate = value.toISOString();
    setEvent(newEvent);
    setRowFlag(RowFlag.MODIFIED);
  };

  const setEnd = (value: Date) => {
    const newEvent: Tables<"event"> = { ...event };
    newEvent.enddate = value.toISOString();
    setEvent(newEvent);
    setRowFlag(RowFlag.MODIFIED);
  };

  const indicatorColor =
    rowFlag === RowFlag.MODIFIED
      ? "bg-yellow-500"
      : rowFlag === RowFlag.DELETED
        ? "bg-red-500"
        : "";

  const currentStartDate = new Date(event.startdate);
  const currentEndDate = new Date(event.enddate);

  return (
    <AdminPageTableRow>
      <AdminPageTableCell
        className={`w-2 ${indicatorColor}`}
      ></AdminPageTableCell>
      <AdminPageTableCell>{event.id}</AdminPageTableCell>
      <AdminPageTableCell>
        <input
          defaultValue={event.name}
          onChange={(e) => setName(e.target.value)}
        />
      </AdminPageTableCell>
      <AdminPageTableCell>
        <textarea
          defaultValue={event.description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </AdminPageTableCell>
      <AdminPageTableCell>
        <input
          type="datetime-local"
          defaultValue={dateToDateTimeLocalString(currentStartDate)}
          onChange={(e) => setStart(new Date(e.target.value))}
        ></input>
      </AdminPageTableCell>
      <AdminPageTableCell>
        <input
          type="datetime-local"
          defaultValue={dateToDateTimeLocalString(currentEndDate)}
          onChange={(e) => setEnd(new Date(e.target.value))}
        ></input>
      </AdminPageTableCell>
      <AdminPageTableCell>{tag}</AdminPageTableCell>
      <AdminPageTableCell>
        <UmassPhotoButtonRed onClick={() => setRowFlag(RowFlag.DELETED)}>
          X
        </UmassPhotoButtonRed>
      </AdminPageTableCell>
    </AdminPageTableRow>
  );
}
