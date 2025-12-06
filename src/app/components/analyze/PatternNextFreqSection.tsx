"use client";

import LottoBall from "@/app/components/LottoBall";
import { FreqChart } from "@/app/components/analyze/FreqChartComponent";

type PatternDataShape =
  | Record<number, number>
  | {
      patternKey: string;
      freq: Record<number, number>;
    };

interface PatternNextProps {
  title: string;
  data: PatternDataShape;
}

/** 타입 가드: data가 { patternKey, freq } 형태인지 검사 */
function isPatternObj(
  d: PatternDataShape
): d is { patternKey: string; freq: Record<number, number> } {
  // d가 null이 아니고 object여야 하며 'freq' 속성이 존재하고
  // freq가 객체 형태인지(Record인지)까지 확인
  if (d === null || typeof d !== "object") return false;
  // 'freq' 키 존재 여부 검사 (object로 단언해서 사용)
  if (!("freq" in (d as object))) return false;
  // freq가 실제 객체인지 확인
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
  const patternKey: string | null = isObj ? data.patternKey ?? null : null;

  // 안전하게 1..45 번호 목록 생성 (데이터에 번호가 없을 경우 대비)
  const nums = Array.from({ length: 45 }, (_, i) => i + 1);

  // 값 배열 생성 (존재하지 않는 번호는 0으로 처리)
  const values = nums.map((n) => freq[n] ?? 0);

  // 최다 / 최소 계산 (빈 데이터 방지)
  const maxVal = values.length > 0 ? Math.max(...values) : 0;
  const minVal = values.length > 0 ? Math.min(...values) : 0;

  const maxNums = nums.filter((n) => (freq[n] ?? 0) === maxVal);
  const minNums = nums.filter((n) => (freq[n] ?? 0) === minVal);

  const hideMax = maxVal === 1; // 최다가 1이면 표시 안 함
  const hideMin = minVal === 0; // 최소가 0이면 표시 안 함

  return (
    <div className="mb-6">
      <div className="flex items-baseline justify-between">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        {patternKey && (
          <span className="text-sm text-gray-500 ml-2">패턴: {patternKey}</span>
        )}
      </div>

      {/* 차트 */}
      <div className="mb-4">
        <FreqChart
          record={freq}
          title={patternKey ?? undefined}
          color="#06b6d4"
        />
      </div>

      <div className="space-y-2">
        {/* 최다 (1이면 표시 안함) */}
        {!hideMax && maxNums.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-green-700 font-medium">최다</span>
            <div className="flex gap-1 flex-wrap">
              {maxNums.map((num) => (
                <LottoBall key={`max-${num}`} number={num} size="sm" />
              ))}
            </div>
          </div>
        )}

        {/* 최소 (0이면 표시 안함) */}
        {!hideMin && minNums.length > 0 && (
          <div className="flex items-center gap-2">
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
