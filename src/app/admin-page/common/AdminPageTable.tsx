"use client";

import { ReactNode } from "react";

export default function AdminPageTable({ children }: { children: ReactNode }) {
  return (
    <table className="rounded-default overflow-hidden drop-shadow-xl">
      {children}
    </table>
  );
}
