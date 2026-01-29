"use client";

import LottoBall from "@/app/components/LottoBall";
import { FreqChart } from "@/app/components/analyze/FreqChartComponent";

type PatternDataShape =
  | Record<number, number>
  | { patternKey: string; freq: Record<number, number> };

interface PatternNextProps {
  title: string;
  data: PatternDataShape;
}

function isPatternObj(
  d: PatternDataShape,
): d is { patternKey: string; freq: Record<number, number> } {
  if (d === null || typeof d !== "object") return false;
  if (!("freq" in (d as object))) return false;
  const maybeFreq = (d as { freq: Record<number, number> }).freq;
  return typeof maybeFreq === "object" && maybeFreq !== null;
}

export default function PatternNextFreqSection({
  title,
  data,
}: PatternNextProps) {
  const isObj = isPatternObj(data);
  const freq: Record<number, number> = isObj
    ? data.freq
    : (data as Record<number, number>);
  const patternKey: string | null = isObj ? (data.patternKey ?? null) : null;

  const nums = Array.from({ length: 45 }, (_, i) => i + 1);
  const values = nums.map((n) => freq[n] ?? 0);

  const maxVal = values.length > 0 ? Math.max(...values) : 0;
  const minVal = values.length > 0 ? Math.min(...values) : 0;

  const maxNums = nums.filter((n) => (freq[n] ?? 0) === maxVal);
  const minNums = nums.filter((n) => (freq[n] ?? 0) === minVal);

  const hideMax = maxVal <= 1;
  const hideMin = minVal === 0 && maxVal <= 1;

  return (
    <div className="mb-6 min-w-[280px]">
      <div className="flex flex-wrap items-baseline justify-between mb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        {patternKey && (
          <span className="text-sm text-gray-500 ml-2">패턴: {patternKey}</span>
        )}
      </div>

      {/* 차트 */}
      <div className="mb-4 overflow-x-auto">
        <FreqChart
          record={freq}
          title={patternKey ?? undefined}
          color="#06b6d4"
        />
      </div>

      <div className="space-y-2 flex flex-col sm:flex-row sm:flex-wrap sm:gap-4">
        {!hideMax && maxNums.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-green-700 font-medium">최다</span>
            <div className="flex gap-1 flex-wrap">
              {maxNums.map((num) => (
                <LottoBall key={`max-${num}`} number={num} size="sm" />
              ))}
            </div>
          </div>
        )}

        {!hideMin && minNums.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-red-700 font-medium">최소</span>
            <div className="flex gap-1 flex-wrap">
              {minNums.map((num) => (
                <LottoBall key={`min-${num}`} number={num} size="sm" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
