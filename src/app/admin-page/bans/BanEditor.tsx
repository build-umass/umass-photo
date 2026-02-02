"use client";

import { Tables } from "@/app/utils/supabase/database.types";
import BanManagementRow from "./BanManagementRow";
import AdminPageTable from "../common/AdminPageTable";
import { RowEditState } from "../common/rowEquals";
import { useState } from "react";
import TableEditorHeader from "../common/TableEditorHeader";
import AdminPageTableHeaderCell from "../common/AdminPageTableHeaderCell";

export default function BanEditor({
  savedBans,
}: {
  savedBans: Readonly<Record<string, Readonly<Tables<"ban">>>>;
}) {
  const [editorState, setEditorState] = useState<
    ReadonlyArray<RowEditState<Tables<"ban">>>
  >(
    Object.values(savedBans).map((ban) => ({
      value: ban,
      markedForDeletion: false,
    })),
  );

  return (
    <>
      <TableEditorHeader onSave={() => {}} tableName="Bans"></TableEditorHeader>
      <AdminPageTable>
        <thead>
          <tr>
            <AdminPageTableHeaderCell>Email</AdminPageTableHeaderCell>
            <AdminPageTableHeaderCell>IP</AdminPageTableHeaderCell>
            <AdminPageTableHeaderCell>Username</AdminPageTableHeaderCell>
            <AdminPageTableHeaderCell>Reason</AdminPageTableHeaderCell>
            <AdminPageTableHeaderCell>Delete</AdminPageTableHeaderCell>
            <AdminPageTableHeaderCell>Reset</AdminPageTableHeaderCell>
          </tr>
        </thead>
        {editorState.map((banState, index) => (
          <BanManagementRow
            key={banState.value.id}
            value={banState}
            savedValue={savedBans[banState.value.id]}
            onChange={(updater) => {
              setEditorState((oldState) => {
                const newState = [...oldState];
                newState[index] = updater(oldState[index]);
                return newState;
              });
            }}
          ></BanManagementRow>
        ))}
      </AdminPageTable>
    </>
  );
}
