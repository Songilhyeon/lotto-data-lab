"use client";

import PerNumberTable from "./IntervalPerNumberTable";
import { PerNumberRow } from "@/app/types/api";

export default function IntervalPatternTable({
  data,
}: {
  data: PerNumberRow[];
}) {
  const tableData = data.map((row) => ({
    ...row,
    latestPattern: row.latestPattern ?? null,
    currentGap: row.currentGap ?? null,
    lastGap: row.lastGap ?? null,
  }));

  return <PerNumberTable data={tableData} />;
}
