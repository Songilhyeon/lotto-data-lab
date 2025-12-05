"use client";

import { useEffect, useState, useRef } from "react";
import LottoBall from "../LottoBall";
import RangeFilterBar from "../RangeFilterBar";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartTooltip,
  Cell,
} from "recharts";
import SimilarPagination from "./SimilarPagination";
import { apiUrl, getLatestRound } from "@/app/utils/getUtils";

interface AnalysisResult {
  numbers: number[];
  round: number;
  nextNumbers: number[];
}

interface LottoDraw {
  drwNo: number;
  numbers: number[];
}

export default function SimilarPatterns() {
  const latestRound = getLatestRound();
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [selectedRound, setSelectedRound] = useState<AnalysisResult | null>(
    null
  );
  const [nextRound, setNextRound] = useState<LottoDraw | null>(null);
  const [frequency, setFrequency] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(false);

  const [minMatch, setMinMatch] = useState(2);
  const [start, setStart] = useState(latestRound - 9);
  const [end, setEnd] = useState(latestRound);
  const [includeBonus, setIncludeBonus] = useState(false);
  const [selectedRecent, setSelectedRecent] = useState<number | null>(10);

  const prevParamsRef = useRef({
    start: -1,
    end: -1,
    includeBonus: false,
    minMatch: 2,
  });

  /** ️⃣ API 호출 함수 */
  const fetchData = async () => {
    const prev = prevParamsRef.current;
    if (
      prev.start === start &&
      prev.end === end &&
      prev.includeBonus === includeBonus &&
      prev.minMatch === minMatch
    ) {
      console.log("⭐ same params, skip fetch");
      return; // ← fetch 실행 안 함
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${apiUrl}/lotto/similar?start=${start}&end=${end}&includeBonus=${includeBonus}&minMatch=${minMatch}`
      );
      const json = await res.json();

      if (!json.success || !json.data) {
        setSelectedRound(null);
        setResults([]);
        setNextRound(null);
        setFrequency({});
        return;
      }

      setNextRound(json.data.nextRound);
      setSelectedRound(json.data.selectedRound);
      setResults(json.data.results);
      setFrequency(json.data.nextFrequency);
    } catch (err) {
      console.error(err);
      setNextRound(null);
      setSelectedRound(null);
      setResults([]);
      setFrequency({});
    } finally {
      setLoading(false);
      prevParamsRef.current = { start, end, includeBonus, minMatch }; // ← params 저장
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const chartData = Array.from({ length: 45 }, (_, i) => {
    const num = i + 1;
    return {
      number: num,
      count: frequency[num] ?? 0,
    };
  });

  const color = "#3b82f6";
  const maxValue = Math.max(...chartData.map((d) => d.count));
  const minValue = Math.min(...chartData.map((d) => d.count)); // (원하면 사용)

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
            🔮 다음 회차 번호 분석
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            특정 회차 당첨 번호가 과거 회차에 등장한 경우, 그 다음 회차에서 나온
            번호들의 출현 횟수를 보여줍니다.
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

        {/* 조회하기 버튼 */}
        <div className="flex justify-start mt-2 mb-6">
          <button
            onClick={fetchData}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
          >
            {loading ? "조회 중..." : "조회하기"}
          </button>
        </div>

        {/* Match Count Tabs */}
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            기준 회차와 당첨 번호 일치 개수
          </h2>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4].map((match) => (
              <button
                key={match}
                onClick={() => setMinMatch(match)}
                className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-md ${
                  minMatch === match
                    ? "bg-linear-to-r from-purple-600 to-pink-600 text-white scale-105 shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                }`}
              >
                {match === 4 ? "4개 이상" : `${match}개`}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <svg
                className="animate-spin h-12 w-12 text-purple-600"
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
              <p className="text-gray-600 font-medium">분석 중...</p>
            </div>
          </div>
        )}

        {/* Selected Round Info */}
        {!loading && selectedRound && (
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* 기준 회차 */}
              <div className="flex-1 bg-linear-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-gray-800">
                    📌 기준 회차: {selectedRound.round}회
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {selectedRound.numbers.map((num) => (
                    <LottoBall key={num} number={num} />
                  ))}
                </div>
              </div>

              {/* 🔵 다음 회차 (있을 경우만 표시) */}
              {nextRound && (
                <div className="flex-1 bg-linear-to-br from-sky-50 to-blue-50 rounded-xl p-4 border-2 border-sky-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-gray-800">
                      ⏭️ 다음 회차: {nextRound.drwNo}회
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {nextRound.numbers.map((num) => (
                      <LottoBall key={num} number={num} />
                    ))}
                  </div>
                </div>
              )}

              {/* 검색 결과 카드 */}
              <div className="flex-1 bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">검색 결과</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {results.length}
                    <span className="text-base font-normal text-gray-600">
                      {" "}
                      / {end - start + 1} 회차
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {minMatch === 4 ? "4개 이상" : `${minMatch}개`} 일치
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bar Chart */}
        {!loading && Object.keys(frequency).length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
              📊 다음 회차 출현 빈도
            </h2>
            <div className="w-full h-64 sm:h-80 mb-4">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <XAxis dataKey="number" />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <RechartTooltip />

                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {chartData.map((d, index) => {
                      // 강조 규칙
                      const isMax = d.count === maxValue;
                      const isMin = d.count === minValue; // (사용 선택)

                      let barColor = color;

                      if (isMax) barColor = "#ef4444"; // (최댓값 강조)
                      if (isMin) barColor = "#facc15"; // (최솟값 강조) ← 선택

                      return <Cell key={index} fill={barColor} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center text-sm sm:text-base text-gray-600 bg-purple-50 rounded-lg p-3">
              {minMatch === 4
                ? "당첨 번호가 4개 이상 일치하는 회차의 다음 회차에 많이 나온 번호"
                : `당첨 번호가 ${minMatch}개 일치하는 회차의 다음 회차에 많이 나온 번호`}
            </p>
          </div>
        )}

        {/* No Results */}
        {!loading && results.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl font-semibold text-gray-800 mb-2">
              유사한 회차 데이터가 없습니다
            </p>
            <p className="text-gray-600">다른 조건으로 검색해보세요</p>
          </div>
        )}

        {/* Results List */}
        {!loading && results.length > 0 && (
          <SimilarPagination
            results={results}
            selectedRound={selectedRound ?? undefined}
          />
        )}
      </div>
    </div>
  );
}
