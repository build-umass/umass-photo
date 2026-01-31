"use client";

import { useState } from "react";
import EventManagementRow from "./EventManagementRow";
import { Tables } from "@/app/utils/supabase/database.types";
import EditEventChip from "@/app/components/event-chip/EditEventChip";
import TableEditorHeader from "../common/TableEditorHeader";
import AdminPageTable from "../common/AdminPageTable";
import AdminPageTableHeaderCell from "../common/AdminPageTableHeaderCell";
import UmassPhotoButtonRed from "@/app/components/UmassPhotoButton/UmassPhotoButtonRed";
import { RowEditState, rowEquals } from "../common/rowEquals";

export default function EventEditor({
  savedEventData: savedEventData,
}: {
  savedEventData: Readonly<Record<string, Tables<"event">>>;
}) {
  const initialEditorState = Object.fromEntries(
    Object.entries(savedEventData).map(([id, value]) => [
      id,
      { markedForDeletion: false, value } as RowEditState<Tables<"event">>,
    ]),
  );

  const [eventData, setEventData] = useState(initialEditorState);
  const [editingEvent, setEditingEvent] = useState<boolean>(false);

  const saveChanges = async () => {
    const toDelete: string[] = [];
    const toModify: Tables<"event">[] = [];
    Object.entries(eventData).forEach(([id, row]) => {
      if (row.markedForDeletion) toDelete.push(id);
      else if (!rowEquals(row.value, savedEventData[id]))
        toModify.push(row.value);
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
              <AdminPageTableHeaderCell>ID</AdminPageTableHeaderCell>
              <AdminPageTableHeaderCell>Name</AdminPageTableHeaderCell>
              <AdminPageTableHeaderCell>Description</AdminPageTableHeaderCell>
              <AdminPageTableHeaderCell>Start</AdminPageTableHeaderCell>
              <AdminPageTableHeaderCell>End</AdminPageTableHeaderCell>
              <AdminPageTableHeaderCell>Tag</AdminPageTableHeaderCell>
              <AdminPageTableHeaderCell>Delete</AdminPageTableHeaderCell>
              <AdminPageTableHeaderCell>Reset</AdminPageTableHeaderCell>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-gray-100 even:bg-gray-200">
              <td colSpan={9}>
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
                  value={row}
                  onChange={(updater) =>
                    setEventData((oldData) => ({
                      ...oldData,
                      [id]: updater(oldData[id]),
                    }))
                  }
                  savedValue={savedEventData[id]}
                ></EventManagementRow>
              );
            })}
          </tbody>
        </AdminPageTable>
      </>
    );
  }
}
