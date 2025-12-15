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
import DraggableNextRound from "../DraggableNextRound";
import { analysisDivStyle, rangeFilterDivStyle } from "@/app/utils/getDivStyle";
import ComponentHeader from "@/app/components/ComponentHeader";
import LookUpButton from "@/app/components/analyze/LookUpButton";
import { LottoDraw } from "@/app/types/lottoNumbers";

interface AnalysisResult {
  numbers: number[];
  round: number;
  nextNumbers: number[];
}

export default function NextPatterns() {
  const latestRound = getLatestRound();
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [selectedRound, setSelectedRound] = useState<LottoDraw | null>(null);
  const [nextRound, setNextRound] = useState<LottoDraw | null>(null);
  const [frequency, setFrequency] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(false);

  const [minMatch, setMinMatch] = useState(2);
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(latestRound);
  const [includeBonus, setIncludeBonus] = useState(false);
  const [selectedRecent, setSelectedRecent] = useState<number | null>(
    latestRound
  );

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
      // 파라미터 동일하면 fetch 스킵
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${apiUrl}/lotto/next?start=${start}&end=${end}&includeBonus=${includeBonus}&minMatch=${minMatch}`
      );
      const json = await res.json();

      if (!json.success || !json.data) {
        setSelectedRound(null);
        setResults([]);
        setNextRound(null);
        setFrequency({});
        return;
      }

      setNextRound(json.data.nextRound ?? null);
      setSelectedRound(json.data.selectedRound ?? null);
      setResults(json.data.results ?? []);
      setFrequency(json.data.nextFrequency ?? {});
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
    // 최초 로드
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // --- Chart data ---
  const chartData = Array.from({ length: 45 }, (_, i) => {
    const num = i + 1;
    return {
      number: num,
      count: frequency[num] ?? 0,
    };
  });

  const color = "#3b82f6";
  // 안전한 max/min (데이터가 없을 때 NaN 방지)
  const safeCounts = chartData.map((d) => d.count);
  const maxValue = safeCounts.length > 0 ? Math.max(...safeCounts) : 0;
  const minValue = safeCounts.length > 0 ? Math.min(...safeCounts) : 0;

  return (
    <div className={`${analysisDivStyle()} from-blue-50 to-pink-100`}>
      {/* Header */}
      <ComponentHeader
        title="🔮 다음 회차 번호 분석"
        content={`특정 회차 당첨 번호가 과거 회차에 등장한 경우, 그 다음 회차에서 나온 번호들의 출현 횟수를 보여줍니다.
                  End 회차를 선택하여 과거 회차에 어떤 번호가 당첨 되었는지 분석할 수 있습니다.`}
      />

      {/* Range Filter */}
      <div className={rangeFilterDivStyle + " mt-4"}>
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

      {/* 조회하기 버튼 + 탭 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-3 mb-6">
        <div className="shrink-0">
          <LookUpButton onClick={fetchData} loading={loading} />
        </div>

        <div className="w-full sm:w-auto bg-white rounded-2xl shadow-xl p-3 sm:p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-3">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 shrink-0">
              기준 회차와 당첨 번호 일치 개수
            </h2>

            <div className="flex flex-wrap gap-2 justify-start md:justify-center">
              {[1, 2, 3, 4].map((match) => (
                <button
                  key={match}
                  onClick={() => setMinMatch(match)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-sm ${
                    minMatch === match
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white transform scale-105 shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {match === 4 ? "4개 이상" : `${match}개`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center mb-6">
          <div className="flex flex-col items-center gap-3">
            <svg
              className="animate-spin h-10 w-10 text-purple-600"
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
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className="text-gray-600 font-medium">분석 중...</p>
          </div>
        </div>
      )}

      {/* Selected Round Info */}
      {!loading && selectedRound && (
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* 기준 회차 */}
            <div className="flex-1 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-gray-800">
                  📌 기준 회차: {selectedRound.round}회
                </span>
              </div>
              <div className="flex flex-wrap gap-2 justify-center items-center">
                {selectedRound.numbers.map((num, index) => (
                  <div key={index}>
                    <LottoBall number={num} />
                  </div>
                ))}
                {/* 보너스 */}
                {includeBonus && selectedRound?.bonus && (
                  <div className="flex items-center">
                    <span className="mx-1 text-sm font-semibold text-yellow-600">
                      /
                    </span>
                    <LottoBall number={selectedRound.bonus} />
                  </div>
                )}
              </div>
            </div>

            {/* 검색 결과 + 다음 회차 */}
            <div className="w-full lg:w-96 flex flex-col gap-3">
              {nextRound && (
                <div className="min-w-0">
                  {/* DraggableNextRound는 내부에서 고정 포지셔닝을 처리함 */}
                  <DraggableNextRound
                    nextRound={nextRound}
                    most={[]}
                    least={[]}
                  />
                </div>
              )}

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200 flex items-center justify-center">
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
        </div>
      )}

      {/* Bar Chart */}
      {!loading && Object.keys(frequency).length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 mb-6 w-full min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
            📊 다음 회차 출현 빈도
          </h2>

          {/* Chart wrapper: min-w-0 + overflow-x-auto ensures ResponsiveContainer reads width correctly */}
          <div
            className="w-full min-w-0 max-w-full overflow-x-auto"
            style={{ height: 220 }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="number" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <RechartTooltip />

                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {chartData.map((d, index) => {
                    const isMax = d.count === maxValue && maxValue > 0;
                    const isMin = d.count === minValue && minValue > 0;

                    let barColor = color;
                    if (isMax) barColor = "#ef4444";
                    if (isMin) barColor = "#facc15";

                    return <Cell key={index} fill={barColor} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-center text-sm sm:text-base text-gray-600 bg-purple-50 rounded-lg p-3 mt-3">
            {minMatch === 4
              ? "당첨 번호가 4개 이상 일치하는 회차의 다음 회차에 많이 나온 번호"
              : `당첨 번호가 ${minMatch}개 일치하는 회차의 다음 회차에 많이 나온 번호`}
          </p>
        </div>
      )}

      {/* No Results */}
      {!loading && results.length === 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-5xl mb-3">🔍</div>
          <p className="text-xl font-semibold text-gray-800 mb-2">
            유사한 회차 데이터가 없습니다
          </p>
          <p className="text-gray-600">다른 조건으로 검색해보세요</p>
        </div>
      )}

      {/* Results List */}
      {!loading && results.length > 0 && (
        <div className="mt-4">
          <SimilarPagination
            results={results}
            selectedRound={selectedRound ?? undefined}
          />
        </div>
      )}
    </div>
  );
}
