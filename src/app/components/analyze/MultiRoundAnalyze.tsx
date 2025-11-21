"use client";

import { useEffect, useState } from "react";
import { getLatestRound } from "@/app/utils/getLatestRound";
import RangeFilterBar from "@/app/components/analyze/RangeFilterBar";
import LottoPaperCard from "@/app/components/analyze/LottoPaperCard";

interface MultiRoundResponse {
  start: number;
  end: number;
  includeBonus: boolean;
  mostFrequentNumber: number;
  leastFrequentNumber: number;
  frequency: Record<number, number>;
}

const url = process.env.NEXT_PUBLIC_BACKEND_URL;
const latest = getLatestRound();

export default function MultiRoundAnalyze() {
  const [start, setStart] = useState(latest - 10);
  const [end, setEnd] = useState(latest);
  const [includeBonus, setIncludeBonus] = useState(false); // 보너스 포함 여부
  const [stats, setStats] = useState<MultiRoundResponse | null>(null);

  useEffect(() => {
    const fetchStatistics = () => {
      fetch(
        `${url}/api/lotto/simple/statistics?start=${start}&end=${end}&includeBonus=${includeBonus}`
      )
        .then((res) => res.json())
        .then((res) => setStats(res.data))
        .catch(() => setStats(null));
    };
    fetchStatistics();
  }, [start, end, includeBonus]);

  // 최근 n개 버튼 클릭
  const handleRecent = (count: number) => {
    setStart(latest - count + 1);
    setEnd(latest);
  };

  // 최빈값 / 최저값 여러개 계산
  const getMostAndLeast = () => {
    if (!stats) return { most: [], least: [] };
    const values = Object.values(stats.frequency);
    const max = Math.max(...values);
    const min = Math.min(...values);

    const most = Object.entries(stats.frequency)
      .filter(([_, count]) => count === max)
      .map(([num]) => Number(num));
    const least = Object.entries(stats.frequency)
      .filter(([_, count]) => count === min)
      .map(([num]) => Number(num));

    return { most, least };
  };

  const { most, least } = getMostAndLeast();

  return (
    <section className="mt-8">
      <h2 className="text-lg font-bold mb-4">기간별 번호 횟수</h2>
      {/* 범위 입력 + 옵션 */}
      <RangeFilterBar
        start={start}
        end={end}
        latest={latest}
        includeBonus={includeBonus}
        setStart={setStart}
        setEnd={setEnd}
        setIncludeBonus={setIncludeBonus}
        onRecentSelect={handleRecent}
      />

      {/* 통계 카드 */}
      {!stats ? (
        <p className="text-gray-500">데이터가 없습니다.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl shadow text-center">
            <h3 className="text-sm text-gray-500 mb-1">선택 회차</h3>
            <p className="text-xl font-semibold text-gray-700">
              {stats.start} ~ {stats.end} {"("}
              {stats.end - stats.start + 1}
              {"주)"}
            </p>
            <p className="text-sm text-gray-500">
              {stats.includeBonus ? "보너스 번호 포함" : "보너스 번호 제외"}
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow text-center">
            <h3 className="text-sm text-gray-500 mb-1">가장 자주 나온 번호</h3>
            <p className="text-3xl font-bold text-red-500">{most.join(", ")}</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow text-center">
            <h3 className="text-sm text-gray-500 mb-1">가장 적게 나온 번호</h3>
            <p className="text-3xl font-bold text-blue-600">
              {least.join(", ")}
            </p>
          </div>
        </div>
      )}

      {/* 번호별 출현 횟수 그리드 (빨강 → 파랑 그라데이션) */}
      {stats && (
        <div className="mt-6">
          <div className="grid grid-cols-5 sm:grid-cols-9 md:grid-cols-15 gap-2">
            {(() => {
              const freqValues = Object.values(stats.frequency);
              const max = Math.max(...freqValues);
              const min = Math.min(...freqValues);

              return Array.from({ length: 45 }, (_, i) => {
                const number = i + 1;
                const count = stats.frequency[number] || 0;
                const ratio = max === min ? 0 : (count - min) / (max - min);

                const color = `rgb(
                  ${Math.round(239 * ratio + 59 * (1 - ratio))},
                  ${Math.round(68 * ratio + 130 * (1 - ratio))},
                  ${Math.round(68 * ratio + 246 * (1 - ratio))}
                )`;

                return (
                  <div
                    key={number}
                    className="flex flex-col items-center justify-center p-2 border rounded text-white"
                    style={{ backgroundColor: color }}
                  >
                    <span className="text-xs">#{number}</span>
                    <span className="text-sm font-semibold">{count}</span>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}
    </section>
  );
}
