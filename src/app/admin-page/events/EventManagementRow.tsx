import { Tables } from "@/app/utils/supabase/database.types";
import AdminPageTableCell from "../common/AdminPageTableCell";
import UmassPhotoButtonRed from "@/app/components/UmassPhotoButton/UmassPhotoButtonRed";
import AdminPageTableRow from "../common/AdminPageTableRow";
import { rowEquals } from "../common/rowEquals";
import { MdRefresh } from "react-icons/md";

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

  const currentStartDate = new Date(event.startdate);
  const currentEndDate = new Date(event.enddate);

  return (
    <AdminPageTableRow>
      <AdminPageTableCell>{event.id}</AdminPageTableCell>
      <AdminPageTableCell>
        <input value={event.name} onChange={(e) => setName(e.target.value)} />
      </AdminPageTableCell>
      <AdminPageTableCell>
        <textarea
          value={event.description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </AdminPageTableCell>
      <AdminPageTableCell>
        <input
          type="datetime-local"
          value={dateToDateTimeLocalString(currentStartDate)}
          onChange={(e) => setStart(new Date(e.target.value))}
        ></input>
      </AdminPageTableCell>
      <AdminPageTableCell>
        <input
          type="datetime-local"
          value={dateToDateTimeLocalString(currentEndDate)}
          onChange={(e) => setEnd(new Date(e.target.value))}
        ></input>
      </AdminPageTableCell>
      <AdminPageTableCell>{tag}</AdminPageTableCell>
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
          onClick={() => setEvent(() => savedEvent)}
          disabled={rowEquals(event, savedEvent)}
        >
          <MdRefresh></MdRefresh>
        </UmassPhotoButtonRed>
      </AdminPageTableCell>
    </AdminPageTableRow>
  );
}
