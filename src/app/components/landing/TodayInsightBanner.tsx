"use client";

import clsx from "clsx";
import { TodayInsight } from "@/app/types/insight";

type Props = {
  insight: TodayInsight;
};

/**
 * Insight type → UI level 매핑 (최종)
 */
function getLevel(type: TodayInsight["type"]) {
  switch (type) {
    case "CONSECUTIVE_DROP":
    case "RANGE_BIAS":
      return "warning";

    case "HOT_NUMBER":
      return "signal";

    case "BALANCED":
    default:
      return "info";
  }
}

export default function TodayInsightBanner({ insight }: Props) {
  const level = getLevel(insight.type);

  return (
    <div
      className={clsx(
        "mx-auto max-w-6xl px-4 sm:px-6 py-3 rounded-xl border text-sm sm:text-base",
        level === "info" && "bg-gray-50 text-gray-700 border-gray-200",
        level === "signal" && "bg-blue-50 text-blue-800 border-blue-200",
        level === "warning" && "bg-red-50 text-red-800 border-red-200"
      )}
    >
      <span className="font-medium">이번주의 인사이트</span>
      <span className="mx-2">·</span>
      <span>{insight.message}</span>
    </div>
  );
}
