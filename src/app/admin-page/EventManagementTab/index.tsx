"use client";
import { useEffect, useState } from "react";
import { Tables } from "../../utils/supabase/database.types";
import AdminPageTableHeaderCell from "../common/AdminPageTableHeaderCell";
import AdminPageButton from "../common/AdminPageButton";
import EventManagementRow, { RowFlag } from "./EventManagementRow";
import EditEventChip from "@/app/components/event-chip/EditEventChip";

export default function EventManagementTab() {
  const [rowFlags, setRowFlags] = useState<Record<string, RowFlag>>({});
  const [eventData, setEventData] = useState<Record<
    string,
    Tables<"event">
  > | null>(null);
  const [editingEvent, setEditingEvent] = useState<boolean>(false);
  const refreshData = async () => {
    setEventData(null);
    const eventList: Tables<"event">[] = await (
      await fetch("/api/get-event-all")
    ).json();
    const eventRecord = eventList.map((ev: Tables<"event">) => [
      String(ev.id),
      ev,
    ]);
    setEventData(Object.fromEntries(eventRecord));
    setRowFlags({});
  };
  useEffect(() => {
    refreshData();
  }, []);
  const setRowFlag = (id: string, rowFlag: RowFlag) => {
    setRowFlags((rowFlags) => {
      const newRowFlags = { ...rowFlags };
      if (rowFlag === RowFlag.NONE) delete newRowFlags[id];
      else newRowFlags[id] = rowFlag;
      return newRowFlags;
    });
  };
  const getRowFlag = (id: string) => {
    return rowFlags[id] ?? RowFlag.NONE;
  };
  const setEventById = (id: string, ev: Tables<"event">) => {
    const newEventData: Record<string, Tables<"event">> = {
      ...eventData,
    } as Record<string, Tables<"event">>;
    newEventData[id] = ev;
    setEventData(newEventData);
  };

  const saveChanges = async () => {
    if (eventData === null)
      throw new Error("Called saveChanges with eventData==null!");
    const toDelete: number[] = [];
    const toModify: Tables<"event">[] = [];
    Object.entries(eventData).forEach(([id, row]) => {
      if (rowFlags[id] === RowFlag.DELETED) toDelete.push(Number(id));
      if (rowFlags[id] === RowFlag.MODIFIED) toModify.push(row);
    });
    setEventData(null);
    await fetch("/api/update-event-data", {
      method: "POST",
      body: JSON.stringify({ toDelete, toModify }),
    });
    await refreshData();
  };

  if (eventData === null) {
    return <>loading...</>;
  } else {
    return (
      <div className="flex grow flex-col bg-gray-100 p-24">
        {editingEvent && (
          <EditEventChip
            closeCallback={() => {
              setEditingEvent(false);
              refreshData();
            }}
          ></EditEventChip>
        )}
        <div className="flex justify-between">
          <h1 className="text-umass-red text-6xl font-bold">Events</h1>
          <AdminPageButton onClick={saveChanges}>SAVE</AdminPageButton>
        </div>
        <table className="border-2 border-gray-200 drop-shadow-xl">
          <tbody>
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
            <tr>
              <td colSpan={8}>
                <button
                  onClick={() => {
                    setEditingEvent(true);
                  }}
                  className="text-umass-red border-umass-red w-full border-8 text-center"
                >
                  + Add New Event
                </button>
              </td>
            </tr>
            {Object.entries(eventData).map(([id, row], index) => {
              return (
                <EventManagementRow
                  key={id}
                  rowFlag={getRowFlag(id)}
                  setRowFlag={(rowFlag: RowFlag) => setRowFlag(id, rowFlag)}
                  event={row}
                  setEvent={(ev: Tables<"event">) => setEventById(id, ev)}
                  index={index}
                ></EventManagementRow>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
