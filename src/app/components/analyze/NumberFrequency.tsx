"use client";

import { Tooltip } from "react-tooltip";
import { useEffect, useState, useRef } from "react";
import RangeFilterBar from "@/app/components/RangeFilterBar";
import { apiUrl, getLatestRound } from "@/app/utils/getUtils";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartTooltip,
  Cell,
} from "recharts";
import HeatmapCell from "@/app/components/HeatmapCell";
import DraggableNextRound from "./DraggableNextRound";
import { analysisDivStyle, rangeFilterDivStyle } from "@/app/utils/getDivStyle";
import ComponentHeader from "@/app/components/ComponentHeader";
import LookUpButton from "@/app/components/analyze/LookUpButton";

interface MultiRoundResponse {
  start: number;
  end: number;
  includeBonus: boolean;
  frequency: Record<number, number>;
  roundResults?: LottoDraw[];
}

interface LottoDraw {
  round: number;
  numbers: number[];
  bonus?: number;
}

export default function NumberFrequency() {
  const latestRound = getLatestRound();
  const [start, setStart] = useState(latestRound - 9);
  const [end, setEnd] = useState(latestRound);
  const [includeBonus, setIncludeBonus] = useState(false);
  const [results, setResults] = useState<MultiRoundResponse | null>(null);
  const [draws, setDraws] = useState<LottoDraw[]>([]);
  const [selectedRecent, setSelectedRecent] = useState<number | null>(10);
  const [nextRound, setNextRound] = useState<LottoDraw | null>(null);
  const [loading, setLoading] = useState(false);

  const prevParamsRef = useRef({
    start: -1,
    end: -1,
    includeBonus: !includeBonus,
  });

  const fetchData = async () => {
    const prev = prevParamsRef.current;
    if (
      prev.start === start &&
      prev.end === end &&
      prev.includeBonus === includeBonus
    ) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${apiUrl}/lotto/frequency?start=${start}&end=${end}&includeBonus=${includeBonus}`
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
      prevParamsRef.current = { start, end, includeBonus };
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEndChange = (value: number) => {
    if (value < start) setStart(value);
    setEnd(value);
    setSelectedRecent(null);
  };

  const handleStartChange = (value: number) => {
    if (value > end) setEnd(value);
    setStart(value);
    setSelectedRecent(null);
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
      freqData[n].rounds.push(draw.round);
    });
  });

  const freqValues = Object.values(results?.frequency || {});
  const maxFreq = Math.max(...freqValues);
  const minFreq = Math.min(...freqValues);

  const chartData = Array.from({ length: 45 }, (_, i) => {
    const num = i + 1;
    return { number: num, count: results?.frequency[num] ?? 0 };
  });

  const color = "#3b82f6";

  return (
    <div className={`${analysisDivStyle()} from-blue-50 to-cyan-100`}>
      {/* Header */}
      <ComponentHeader
        title="📈 번호 출현 빈도 분석"
        content="특정 기간 동안 각 번호가 얼마나 자주 출현했는지 분석합니다."
      />

      {nextRound && (
        <div className="mt-2 sm:mt-4">
          <DraggableNextRound nextRound={nextRound} most={most} least={least} />
        </div>
      )}

      {/* Range Filter */}
      <div className={rangeFilterDivStyle + " mt-4 sm:mt-6"}>
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
      </div>

      {/* 조회 버튼 */}
      <div className="flex justify-start mt-1 mb-4 sm:mb-6">
        <LookUpButton onClick={fetchData} loading={loading} />
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-xl shadow p-10 text-center">
          <div className="flex flex-col items-center gap-3">
            <svg className="animate-spin h-10 w-10 text-blue-600" fill="none">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
            </svg>
            <p className="text-gray-600">데이터 분석 중...</p>
          </div>
        </div>
      )}

      {/* No Data */}
      {!loading && !results && (
        <div className="bg-white rounded-xl shadow p-10 text-center">
          <div className="text-5xl mb-2">📊</div>
          <p className="text-lg font-semibold text-gray-800">
            데이터가 없습니다.
          </p>
        </div>
      )}

      {/* Results */}
      {!loading && results && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
            {/* 카드 1 */}
            <div className="bg-white rounded-xl shadow p-3 md:p-4 text-center border-t-4 border-blue-500">
              <div className="text-xl md:text-2xl">🎯</div>
              <h3 className="text-[10px] sm:text-xs text-gray-500">
                선택 회차
              </h3>
              <p className="text-base sm:text-xl font-bold text-gray-800">
                {results.start} ~ {results.end}
                <span className="ml-1 text-[8px] text-gray-600">
                  (총 {results.end - results.start + 1}회)
                </span>
              </p>
              <p className="text-[8px] sm:text-[10px] text-gray-500 mt-1">
                {results.includeBonus ? "보너스 포함" : "보너스 제외"}
              </p>
            </div>

            {/* 카드 2 */}
            <div className="bg-linear-to-br from-red-50 to-orange-50 rounded-xl shadow p-3 md:p-4 text-center border-t-4 border-red-500">
              <div className="text-xl md:text-2xl">🔥</div>
              <h3 className="text-[10px] sm:text-xs text-gray-600">
                가장 자주 나온 번호
              </h3>
              <p className="text-base sm:text-xl font-bold text-red-600">
                {most.join(", ")}
              </p>
              {most.length > 0 && (
                <p className="text-[8px] sm:text-[10px] text-gray-600 mt-1">
                  {results.frequency[most[0]]}회 출현
                </p>
              )}
            </div>

            {/* 카드 3 */}
            <div className="bg-linear-to-br from-blue-50 to-cyan-50 rounded-xl shadow p-3 md:p-4 text-center border-t-4 border-blue-500">
              <div className="text-xl md:text-2xl">❄️</div>
              <h3 className="text-[10px] sm:text-xs text-gray-600">
                가장 적게 나온 번호
              </h3>
              <p className="text-base sm:text-xl font-bold text-blue-600">
                {least.join(", ")}
              </p>
              {least.length > 0 && (
                <p className="text-[8px] sm:text-[10px] text-gray-600 mt-1">
                  {results.frequency[least[0]]}회 출현
                </p>
              )}
            </div>
          </div>

          {/* Heatmap */}
          <div className="bg-white rounded-xl shadow p-4 sm:p-6 mb-6">
            <div className="mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                🗺️ 출현 빈도 히트맵
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                색이 진할수록 많이 나온 번호입니다
              </p>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-md">
              <span className="text-xs sm:text-sm text-gray-700">낮음</span>
              <div className="flex-1 h-4 rounded-full bg-linear-to-r from-blue-400 to-red-500" />
              <span className="text-xs sm:text-sm text-gray-700">높음</span>
            </div>

            {/* Grid */}
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
            className="bg-transparent! p-0!"
          />
        </>
      )}

      {/* Chart */}
      {results && Object.keys(results.frequency).length > 0 && (
        <div className="bg-white rounded-xl shadow p-4 sm:p-6 mb-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4">
            📊 출현 빈도 그래프
          </h2>

          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="number" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />

                <RechartTooltip />

                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {chartData.map((d, index) => {
                    const isMax = d.count === maxFreq;
                    const isMin = d.count === minFreq;
                    let barColor = color;

                    if (isMax) barColor = "#ef4444";
                    if (isMin) barColor = "#facc15";

                    return <Cell key={index} fill={barColor} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

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
