"use client";

import { NumberScoreDetail } from "@/app/types/api";

interface ScoreBarListProps {
  scores: NumberScoreDetail[];
  hitNumberSet?: Set<number> | null;
  bonusNumber?: number;
  title?: string;
}

export default function ScoreBarList({
  scores,
  hitNumberSet,
  bonusNumber,
  title = "🎛 전체 번호 점수 분포 (점수 높은 순)",
}: ScoreBarListProps) {
  if (!scores || scores.length === 0) return null;

  const sorted = [...scores].sort((a, b) => b.final - a.final);
  const maxScore = Math.max(...sorted.map((s) => s.final));

  return (
    <div className="mt-4 space-y-2">
      <h3 className="font-semibold text-sm sm:text-base text-gray-700">
        {title}
      </h3>

      {sorted.map((s) => {
        const width = (s.final / maxScore) * 100;
        const isHit = hitNumberSet?.has(s.num);
        const isBonus = bonusNumber === s.num;

        return (
          <div
            key={s.num}
            className={`flex items-center gap-2 sm:gap-3 px-1 rounded ${
              isBonus ? "bg-purple-50" : isHit ? "bg-yellow-50" : ""
            }`}
          >
            {/* 번호 */}
            <span
              className={`w-6 text-sm sm:text-base font-bold ${
                isBonus
                  ? "text-green-700"
                  : isHit
                  ? "text-red-600"
                  : "text-gray-800"
              }`}
            >
              {s.num}
            </span>

            {/* 점수 바 */}
            <div className="flex-1 bg-gray-200 h-4 rounded overflow-hidden">
              <div
                className={`h-4 rounded transition-all ${
                  isBonus
                    ? "bg-green-500"
                    : isHit
                    ? "bg-red-500"
                    : "bg-blue-500"
                }`}
                style={{ width: `${width}%` }}
              />
            </div>

            {/* 점수 */}
            <span className="w-14 text-xs sm:text-sm text-gray-600 text-right">
              {s.final.toFixed(2)}
            </span>

            {/* 아이콘 */}
            {/* {isHit && !isBonus && (
              <span className="text-xs font-semibold text-red-600">🎯</span>
            )}
            {isBonus && (
              <span className="text-xs font-semibold text-purple-600">⭐</span>
            )} */}
          </div>
        );
      })}
    </div>
  );
}
