"use client";

import clsx from "clsx";
import { TodayInsight } from "@/app/types/insight";

type Props = {
  insight: TodayInsight;
};

/**
 * Insight type → UI level 매핑
 *
 * - warning: 주의가 필요한 패턴 (급변, 쏠림)
 * - signal: 참고할 만한 신호 (Hot 번호)
 * - info: 일반 정보 (균형, 데이터 부족)
 */
function getLevel(type: TodayInsight["type"]) {
  switch (type) {
    case "CONSECUTIVE_DROP":
    case "RANGE_BIAS":
      return "warning";

    case "HOT_NUMBER":
      return "signal";

    case "BALANCED":
    case "INSUFFICIENT_DATA":
    default:
      return "info";
  }
}

/**
 * 인사이트 배너 컴포넌트
 *
 * 로또 분석 인사이트를 시각적으로 표시합니다.
 * 과거 패턴을 제시하지만 미래를 예측하지 않습니다.
 */
export default function TodayInsightBanner({ insight }: Props) {
  const level = getLevel(insight.type);

  return (
    <div
      className={clsx(
        "mx-auto max-w-6xl px-4 sm:px-6 py-3 rounded-xl border text-sm sm:text-base transition-colors",
        level === "info" && "bg-gray-50 text-gray-700 border-gray-200",
        level === "signal" && "bg-blue-50 text-blue-800 border-blue-200",
        level === "warning" && "bg-amber-50 text-amber-800 border-amber-200"
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-wrap items-center gap-x-2">
        <span className="font-semibold">
          {insight.type === "INSUFFICIENT_DATA" ? "알림" : "이번주의 인사이트"}
        </span>
        <span className="text-gray-400">·</span>
        <span className="flex-1">{insight.message}</span>
      </div>

      {/* Hot 번호가 있는 경우 시각적 표시 (선택사항) */}
      {/* {insight.hotNumbers && insight.hotNumbers.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {insight.hotNumbers.map((num) => (
            <span
              key={num}
              className="inline-flex items-center justify-center w-7 h-7 text-xs font-bold rounded-full bg-blue-100 text-blue-800"
            >
              {num}
            </span>
          ))}
        </div>
      )} */}
    </div>
  );
}
