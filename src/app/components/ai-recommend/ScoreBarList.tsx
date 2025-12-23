"use client";

import { AiScoreBase } from "@/app/types/api";

interface ScoreBarListProps {
  scores: AiScoreBase[];
  mode?: "raw" | "normalized";
  hitNumberSet?: Set<number> | null;
  bonusNumber?: number;
  title?: string;
  onSelect?: (score: AiScoreBase) => void;
}

export default function ScoreBarList({
  scores,
  hitNumberSet,
  bonusNumber,
  title = "🎛 전체 번호 점수 분포 (점수 높은 순)",
  onSelect,
  mode = "raw", // 기본값 raw
}: ScoreBarListProps) {
  if (!scores || scores.length === 0) return null;

  // mode에 따라 점수 선택
  const getScore = (s: AiScoreBase) => {
    if (mode === "normalized") return s.final ?? s.finalRaw;
    return s.finalRaw;
  };

  const sorted = [...scores].sort((a, b) => getScore(b) - getScore(a));
  const maxScore = Math.max(...sorted.map(getScore));

  return (
    <div className="mt-4 space-y-2">
      <h3 className="font-semibold text-sm sm:text-base text-gray-700">
        {title} ({mode})
      </h3>

      {sorted.map((s) => {
        const score = getScore(s);
        const width = (score / maxScore) * 100;
        const isHit = hitNumberSet?.has(s.num);
        const isBonus = bonusNumber === s.num;

        return (
          <div
            key={s.num}
            onClick={() => onSelect?.(s)}
            className={`flex items-center gap-2 sm:gap-3 px-1 rounded cursor-pointer
              hover:bg-blue-50 transition
              ${isBonus ? "bg-purple-50" : isHit ? "bg-yellow-50" : ""}
            `}
          >
            {/* 번호 */}
            <span className="w-6 font-bold">{s.num}</span>

            {/* 점수 바 */}
            <div className="flex-1 bg-gray-200 h-4 rounded overflow-hidden">
              <div
                className={`h-4 rounded ${
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
            <span className="w-14 text-xs text-right">{score.toFixed(1)}</span>
          </div>
        );
      })}
    </div>
  );
}
