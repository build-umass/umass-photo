"use client";

import { Tables } from "@/app/utils/supabase/database.types";
import TagManagementRow from "./TagManagementRow";
import AdminPageTable from "../common/AdminPageTable";
import { RowEditState } from "../common/rowEquals";
import { useState } from "react";
import TableEditorHeader from "../common/TableEditorHeader";
import AdminPageTableHeaderCell from "../common/AdminPageTableHeaderCell";
import { saveTags } from "./saveTags";

export default function TagEditor({
  savedTags,
  tagToEventName,
}: {
  savedTags: Readonly<Record<string, Readonly<Tables<"tag">>>>;
  tagToEventName: Readonly<Record<string, string>>;
}) {
  const initialEditorState: ReadonlyArray<RowEditState<Tables<"tag">>> =
    Object.values(savedTags).map((tag) => ({
      value: tag,
      markedForDeletion: false,
    }));
  const [editorState, setEditorState] =
    useState<ReadonlyArray<RowEditState<Tables<"tag">>>>(initialEditorState);

  async function saveData() {
    const toDelete = editorState
      .filter((row) => row.markedForDeletion)
      .map((row) => row.value.name);
    try {
      await saveTags(toDelete);
    } catch {}
  }

  return (
    <>
      <TableEditorHeader onSave={saveData} tableName="Tags"></TableEditorHeader>
      <AdminPageTable>
        <thead>
          <tr>
            <AdminPageTableHeaderCell>Name</AdminPageTableHeaderCell>
            <AdminPageTableHeaderCell>Event</AdminPageTableHeaderCell>
            <AdminPageTableHeaderCell>Delete</AdminPageTableHeaderCell>
            <AdminPageTableHeaderCell>Reset</AdminPageTableHeaderCell>
          </tr>
        </thead>
        <tbody>
          {editorState.map((tagState, index) => (
            <TagManagementRow
              key={tagState.value.name}
              value={tagState}
              savedValue={savedTags[tagState.value.name]}
              eventName={tagToEventName[tagState.value.name]}
              onChange={(updater) => {
                setEditorState((oldState) => {
                  const newState = [...oldState];
                  newState[index] = updater(oldState[index]);
                  return newState;
                });
              }}
            ></TagManagementRow>
          ))}
        </tbody>
      </AdminPageTable>
    </>
  );
}
