"use client";

import PerNumberTable from "./IntervalPerNumberTable";
import { PerNumberRow } from "@/app/types/api";

export default function IntervalPatternTable({
  data,
  patternLabel,
  patternLen = 3,
}: {
  data: PerNumberRow[];
  patternLabel?: string;
  patternLen?: number;
}) {
  const tableData = data.map((row) => ({
    ...row,
    latestPattern: row.latestBuckets
      ? row.latestBuckets.length >= patternLen
        ? row.latestBuckets.slice(-patternLen).join("-")
        : null
      : row.latestPattern ?? null,
    patternSampleCount:
      row.patternSampleCountByLen?.[patternLen] ?? row.patternSampleCount,
    currentGap: row.currentGap ?? null,
    lastGap: row.lastGap ?? null,
  }));

  return <PerNumberTable data={tableData} patternLabel={patternLabel} />;
}
