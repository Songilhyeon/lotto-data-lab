"use client";

import { Tooltip } from "react-tooltip";
import { useEffect, useState } from "react";
import RangeFilterBar from "@/app/components/RangeFilterBar";
import { apiUrl, getLatestRound } from "@/app/utils/getUtils";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartTooltip,
} from "recharts";
import HeatmapCell from "@/app/components/HeatmapCell";

interface MultiRoundResponse {
  start: number;
  end: number;
  includeBonus: boolean;
  frequency: Record<number, number>;
  roundResults?: LottoDraw[];
}

interface LottoDraw {
  drwNo: number;
  numbers: number[];
}

export default function NumberFrequency() {
  const [start, setStart] = useState(getLatestRound() - 9);
  const [end, setEnd] = useState(getLatestRound());
  const [includeBonus, setIncludeBonus] = useState(false);
  const [results, setResults] = useState<MultiRoundResponse | null>(null);
  const [draws, setDraws] = useState<LottoDraw[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecent, setSelectedRecent] = useState<number | null>(10);
  const [nextRound, setNextRound] = useState<LottoDraw | null>(null);

  const latestRound = getLatestRound();

  // 🔹 디바운스 상태
  const [debouncedStart, setDebouncedStart] = useState(start);
  const [debouncedEnd, setDebouncedEnd] = useState(end);

  // 디바운스 적용
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedStart(Math.min(start, end)); // 유효 범위 보정
      setDebouncedEnd(Math.max(start, end));
    }, 500); // 500ms 동안 입력이 없으면 적용

    return () => clearTimeout(handler);
  }, [start, end]);

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${apiUrl}/lotto/frequency?start=${debouncedStart}&end=${debouncedEnd}&includeBonus=${includeBonus}`
        );
        const data = await res.json();

        setResults(data.data);
        setDraws(data.data.roundResults || []);
        setNextRound(data.data.nextRound || null);
      } catch (err) {
        console.error(err);
        setResults(null);
        setDraws([]);
        setNextRound(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStatistics();
  }, [debouncedStart, debouncedEnd, includeBonus]);

  // --- end 입력 시 recent 선택 해제 ---
  const handleEndChange = (value: number) => {
    if (value < start) setStart(value);
    setEnd(value);
    setSelectedRecent(null); // 수동 변경 시 recent 해제
  };

  // --- start 직접 수정 ---
  const handleStartChange = (value: number) => {
    if (value > end) setEnd(value);
    setStart(value);
    setSelectedRecent(null); // 수동 변경 시 recent 해제
  };

  const handleRecent = (count: number) => {
    setSelectedRecent(count);
    setStart(Math.max(1, end - count + 1));
    if (count === latestRound) setEnd(count);
  };

  const clearRecentSelect = () => setSelectedRecent(null);

  const getMostAndLeast = () => {
    if (!results) return { most: [], least: [] };
    const values = Object.values(results.frequency);
    const max = Math.max(...values);
    const min = Math.min(...values);

    const most = Object.entries(results.frequency)
      .filter(([_, count]) => count === max)
      .map(([num]) => Number(num));
    const least = Object.entries(results.frequency)
      .filter(([_, count]) => count === min)
      .map(([num]) => Number(num));

    return { most, least };
  };

  const { most, least } = getMostAndLeast();

  const freqData: Record<number, { count: number; rounds: number[] }> = {};
  draws.forEach((draw) => {
    draw.numbers.forEach((n) => {
      if (!freqData[n]) freqData[n] = { count: 0, rounds: [] };
      freqData[n].count++;
      freqData[n].rounds.push(draw.drwNo);
    });
  });

  const freqValues = Object.values(results?.frequency || {});
  const maxFreq = Math.max(...freqValues);
  const minFreq = Math.min(...freqValues);

  // bar chart data for "frequencyNext" (unchanged)
  const barChartData = Array.from({ length: 45 }, (_, i) => {
    const num = i + 1;
    return { number: num, count: results?.frequency[num] ?? 0 };
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-cyan-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
            📈 번호 출현 빈도 분석
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            특정 기간 동안 각 번호가 얼마나 자주 출현했는지 분석합니다.
          </p>
        </div>

        {/* Range Filter */}
        <RangeFilterBar
          start={start}
          end={end}
          latest={latestRound}
          includeBonus={includeBonus}
          selectedRecent={selectedRecent}
          setStart={handleStartChange}
          setEnd={handleEndChange}
          setIncludeBonus={setIncludeBonus}
          onRecentSelect={handleRecent}
          clearRecentSelect={clearRecentSelect}
        />

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <svg
                className="animate-spin h-12 w-12 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="text-gray-600 font-medium">데이터 분석 중...</p>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        {!loading && !results && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-xl font-semibold text-gray-800">
              데이터가 없습니다
            </p>
          </div>
        )}

        {!loading && results && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              {/* 선택 회차 */}
              <div className="bg-white rounded-2xl shadow-xl p-3 md:p-4 text-center border-t-4 border-blue-500">
                <div className="text-2xl md:text-3xl mb-1 md:mb-1.5">🎯</div>
                <h3 className="text-[10px] md:text-xs text-gray-500 mb-1 md:mb-1 font-medium">
                  선택 회차
                </h3>
                <p className="text-lg md:text-2xl font-bold text-gray-800 mb-1">
                  {results.start} ~ {results.end}
                  <span className="ml-1 text-[8px] md:text-[10px] text-gray-600 font-semibold">
                    (총 {results.end - results.start + 1}회)
                  </span>
                </p>
                <p className="text-[8px] md:text-[10px] text-gray-500 mt-1 md:mt-1">
                  {results.includeBonus
                    ? "보너스 번호 포함"
                    : "보너스 번호 제외"}
                </p>
              </div>

              {/* 가장 자주 나온 번호 */}
              <div className="bg-linear-to-br from-red-50 to-orange-50 rounded-2xl shadow-xl p-3 md:p-4 text-center border-t-4 border-red-500">
                <div className="text-2xl md:text-3xl mb-1 md:mb-1.5">🔥</div>
                <h3 className="text-[10px] md:text-xs text-gray-600 mb-1 md:mb-1 font-medium">
                  가장 자주 나온 번호
                </h3>
                <p className="text-xl md:text-2xl font-bold text-red-600">
                  {most.join(", ")}
                </p>
                {most.length > 0 && (
                  <p className="text-[8px] md:text-[10px] text-gray-600 mt-1 md:mt-1">
                    {results.frequency[most[0]]}회 출현
                  </p>
                )}
              </div>

              {/* 가장 적게 나온 번호 */}
              <div className="bg-linear-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-xl p-3 md:p-4 text-center border-t-4 border-blue-500">
                <div className="text-2xl md:text-3xl mb-1 md:mb-1.5">❄️</div>
                <h3 className="text-[10px] md:text-xs text-gray-600 mb-1 md:mb-1 font-medium">
                  가장 적게 나온 번호
                </h3>
                <p className="text-xl md:text-2xl font-bold text-blue-600">
                  {least.join(", ")}
                </p>
                {least.length > 0 && (
                  <p className="text-[8px] md:text-[10px] text-gray-600 mt-1 md:mt-1">
                    {results.frequency[least[0]]}회 출현
                  </p>
                )}
              </div>
            </div>

            {/* Heat Map */}
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3 sm:gap-0">
                {/* 제목 영역 */}
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-1">
                    🗺️ 출현 빈도 히트맵
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600">
                    색이 진할수록 많이 출현한 번호입니다
                  </p>
                </div>

                {/* nextRound 영역 */}
                {nextRound && (
                  <div className="flex flex-col sm:flex-row sm:items-center text-sm sm:text-lg text-gray-600">
                    <span className="font-medium mb-1 sm:mb-0 sm:mr-2">
                      {nextRound.drwNo} 회 :
                    </span>

                    <p className="flex gap-1 flex-wrap text-base sm:text-lg">
                      {nextRound.numbers.map((num: number) => {
                        const isMost = most.includes(num);
                        const isLeast = least.includes(num);

                        const colorClass = isMost
                          ? "text-red-600 font-bold"
                          : isLeast
                          ? "text-blue-600 font-bold"
                          : "text-gray-600";

                        return (
                          <span key={num} className={colorClass}>
                            {num}
                          </span>
                        );
                      })}
                    </p>
                  </div>
                )}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">낮음</span>
                <div className="flex-1 h-6 rounded-full bg-linear-to-r from-blue-400 to-red-500"></div>
                <span className="text-sm font-medium text-gray-700">높음</span>
              </div>

              {/* Number Grid */}
              <div className="grid grid-cols-5 sm:grid-cols-9 lg:grid-cols-15 gap-2 sm:gap-3">
                {Array.from({ length: 45 }, (_, i) => {
                  const number = i + 1;
                  const item = freqData[number] || { count: 0, rounds: [] };

                  return (
                    <HeatmapCell
                      key={number}
                      number={number}
                      count={item.count}
                      rounds={item.rounds}
                      maxCount={maxFreq}
                      minCount={minFreq}
                    />
                  );
                })}
              </div>
            </div>

            <Tooltip
              id="lotto-tooltip"
              place="top"
              className="bg-transparent! p-0! shadow-none!"
            />
          </>
        )}

        {/* bar chart for "frequency" */}
        {results && Object.keys(results.frequency).length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-6">
            <h2 className="text-xl font-bold mb-4">📊 출현 빈도 그래프</h2>
            <div style={{ width: "100%", height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <XAxis dataKey="number" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <RechartTooltip />
                  <Bar dataKey="count" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, -4px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
