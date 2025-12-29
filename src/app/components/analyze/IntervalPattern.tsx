"use client";

import PerNumberTable, { PerNumberRow } from "./IntervalPerNumberTable";

export default function IntervalPattern({ data }: { data: PerNumberRow[] }) {
  const tableData = data.map((row) => ({
    ...row,
    latestPattern: row.latestPattern ?? null,
    currentGap: row.currentGap ?? null,
    lastGap: row.lastGap ?? null,
  }));

  return <PerNumberTable data={tableData} />;
}
