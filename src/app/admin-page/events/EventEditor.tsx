"use client";

import { useState } from "react";
import EventManagementRow, { RowFlag } from "./EventManagementRow";
import { Tables } from "@/app/utils/supabase/database.types";
import EditEventChip from "@/app/components/event-chip/EditEventChip";
import TableEditorHeader from "../common/TableEditorHeader";
import AdminPageTable from "../common/AdminPageTable";
import AdminPageTableHeaderCell from "../common/AdminPageTableHeaderCell";
import UmassPhotoButtonRed from "@/app/components/UmassPhotoButton/UmassPhotoButtonRed";
import { rowEquals } from "../common/rowEquals";

export default function EventEditor({
  initialEventData,
}: {
  initialEventData: Readonly<Record<string, Tables<"event">>>;
}) {
  const [rowFlags, setRowFlags] = useState<Readonly<Record<string, RowFlag>>>(
    {},
  );
  const [eventData, setEventData] =
    useState<Readonly<Record<string, Tables<"event">>>>(initialEventData);
  const [editingEvent, setEditingEvent] = useState<boolean>(false);

  const getRowFlag = (id: string) => {
    return rowFlags[id] ?? RowFlag.NONE;
  };
  const setRowFlag = (
    id: string,
    updater: (oldRowFlag: RowFlag) => RowFlag,
  ) => {
    setRowFlags((oldRowFlags) => {
      const newRowFlag = updater(oldRowFlags[id] ?? RowFlag.NONE);
      if (newRowFlag === RowFlag.NONE) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [id]: _, ...rest } = oldRowFlags;
        return rest;
      } else {
        return {
          ...oldRowFlags,
          [id]: newRowFlag,
        };
      }
    });
  };

  const setEventById = (
    id: string,
    updater: (old: Readonly<Tables<"event">>) => Readonly<Tables<"event">>,
  ) => {
    setEventData((oldEventData: Readonly<Record<string, Tables<"event">>>) => {
      return { ...oldEventData, [id]: updater(oldEventData[id]) };
    });
  };

  const saveChanges = async () => {
    const toDelete: number[] = [];
    const toModify: Tables<"event">[] = [];
    Object.entries(eventData).forEach(([id, row]) => {
      if (rowFlags[id] === RowFlag.DELETED) toDelete.push(Number(id));
      if (rowEquals(row, initialEventData[id])) toModify.push(row);
    });
    await fetch("/api/update-event-data", {
      method: "POST",
      body: JSON.stringify({ toDelete, toModify }),
    });
  };

  if (eventData === null) {
    return <>loading...</>;
  } else {
    return (
      <>
        {editingEvent && (
          <EditEventChip
            closeCallback={() => {
              setEditingEvent(false);
            }}
          ></EditEventChip>
        )}
        <TableEditorHeader
          tableName="Events"
          onSave={saveChanges}
        ></TableEditorHeader>
        <AdminPageTable>
          <thead>
            <tr>
              <AdminPageTableHeaderCell className="w-2"></AdminPageTableHeaderCell>
              <AdminPageTableHeaderCell>ID</AdminPageTableHeaderCell>
              <AdminPageTableHeaderCell>Name</AdminPageTableHeaderCell>
              <AdminPageTableHeaderCell>Description</AdminPageTableHeaderCell>
              <AdminPageTableHeaderCell>Start</AdminPageTableHeaderCell>
              <AdminPageTableHeaderCell>End</AdminPageTableHeaderCell>
              <AdminPageTableHeaderCell>Tag</AdminPageTableHeaderCell>
              <AdminPageTableHeaderCell>Delete</AdminPageTableHeaderCell>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-gray-100 even:bg-gray-200">
              <td colSpan={8}>
                <div className="flex justify-center py-2">
                  <UmassPhotoButtonRed
                    onClick={() => {
                      setEditingEvent(true);
                    }}
                  >
                    + Add New Event
                  </UmassPhotoButtonRed>
                </div>
              </td>
            </tr>
            {Object.entries(eventData).map(([id, row]) => {
              return (
                <EventManagementRow
                  key={id}
                  rowFlag={getRowFlag(id)}
                  setRowFlag={(updater: (newRowFlag: RowFlag) => RowFlag) =>
                    setRowFlag(id, updater)
                  }
                  event={row}
                  setEvent={(
                    updater: (oldEvent: Tables<"event">) => Tables<"event">,
                  ) => setEventById(id, updater)}
                  savedEvent={initialEventData[id]}
                ></EventManagementRow>
              );
            })}
          </tbody>
        </AdminPageTable>
      </>
    );
  }
}
