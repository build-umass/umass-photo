import { Tables } from "@/app/utils/supabase/database.types";
import AdminPageTableCell from "../common/AdminPageTableCell";
import UmassPhotoButtonRed from "@/app/components/UmassPhotoButton/UmassPhotoButtonRed";
import AdminPageTableRow from "../common/AdminPageTableRow";
import { rowEquals } from "../common/rowEquals";

/**
 * Converts a Date object into the datetime-local format
 */
function dateToDateTimeLocalString(date: Date) {
  date = new Date(date);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

export enum RowFlag {
  DELETED,
  NONE,
}

export default function EventManagementRow({
  rowFlag,
  setRowFlag,
  event,
  setEvent,
  savedEvent,
}: {
  rowFlag: RowFlag;
  setRowFlag: (updater: (oldRowFlag: RowFlag) => RowFlag) => void;
  event: Readonly<Tables<"event">>;
  setEvent: (
    updater: (oldEvent: Readonly<Tables<"event">>) => Readonly<Tables<"event">>,
  ) => void;
  savedEvent: Readonly<Tables<"event">>;
}) {
  const tag = event.tag;

  const setName = (name: string) => {
    setEvent((oldEvent) => {
      return {
        ...oldEvent,
        name,
      };
    });
  };

  const setDescription = (description: string) => {
    setEvent((oldEvent) => {
      return {
        ...oldEvent,
        description,
      };
    });
  };

  const setStart = (value: Date) => {
    setEvent((oldEvent) => {
      return {
        ...oldEvent,
        startdate: value.toISOString(),
      };
    });
  };

  const setEnd = (value: Date) => {
    setEvent((oldEvent) => {
      return {
        ...oldEvent,
        enddate: value.toISOString(),
      };
    });
  };

  const indicatorColor =
    rowFlag === RowFlag.DELETED
      ? "bg-red-500"
      : rowEquals(event, savedEvent)
        ? ""
        : "bg-yellow-500";

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
        <UmassPhotoButtonRed onClick={() => setRowFlag(() => RowFlag.DELETED)}>
          X
        </UmassPhotoButtonRed>
      </AdminPageTableCell>
    </AdminPageTableRow>
  );
}
