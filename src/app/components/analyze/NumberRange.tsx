"use client";

import { useEffect, useState } from "react";
import RangeFilterBar from "../RangeFilterBar";
import { apiUrl, getLatestRound } from "@/app/utils/getUtils";
import SimpleBarChart from "./SimpleBarChart";
import NextFrequencyChart from "./RangeNextChart"; // 🔥 추가
import LottoBall from "../LottoBall";

interface MatchingRoundInfo {
  round: number;
  numbers: number[];
  nextFrequency: Record<number, number>;
}

interface RangeResult {
  counts: Record<string, number>;
  matchingRounds: MatchingRoundInfo[];
  nextFrequency: Record<number, number>;
}

interface ApiData {
  selectedRound: { round: number; numbers: number[] };
  ranges: { "10": RangeResult; "7": RangeResult };
}

interface LottoDraw {
  round: number;
  numbers: number[];
}

export default function NumberRangeMatch() {
  const latestRound = getLatestRound();

  const [selectedRound, setSelectedRound] = useState<LottoDraw | null>(null);
  const [nextRound, setNextRound] = useState<LottoDraw | null>(null);
  const [start, setStart] = useState(latestRound - 9);
  const [end, setEnd] = useState(latestRound);
  const [includeBonus, setIncludeBonus] = useState(false);
  const [selectedRecent, setSelectedRecent] = useState<number | null>(10);
  const [data, setData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(false);

  const [debouncedStart, setDebouncedStart] = useState(start);
  const [debouncedEnd, setDebouncedEnd] = useState(end);

  // 디바운스
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedStart(Math.min(start, end));
      setDebouncedEnd(Math.max(start, end));
    }, 500);
    return () => clearTimeout(handler);
  }, [start, end]);

  // fetch
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${apiUrl}/lotto/range?start=${debouncedStart}&end=${debouncedEnd}&includeBonus=${includeBonus}`
        );

        const json = await res.json();
        console.log(json);
        if (json.success && json.data) {
          setData(json.data);
          setSelectedRound(json.data.selectedRound);
          setNextRound(json.data.nextRound);
        } else {
          setData(null);
          setSelectedRound(null);
          setNextRound(null);
        }
      } catch (err) {
        console.error(err);
        setData(null);
        setSelectedRound(null);
        setNextRound(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedStart, debouncedEnd, includeBonus]);

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

  return (
    <div className="min-h-screen bg-linear-to-br from-teal-50 to-pink-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🔮 구간별 출현 패턴 분석
          </h1>
          <p className="text-gray-600">
            특정 회차의 구간별 번호 구성이 동일한 과거 회차를 찾고, 그 다음
            회차에서 등장한 번호의 빈도를 표시합니다.
          </p>
        </div>

        {/* Filter */}
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

        <div className="flex flex-col sm:flex-row gap-4">
          {/* 기준 회차 */}
          <div className="flex-1 bg-linear-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-bold text-gray-800">
                📌 기준 회차: {selectedRound?.round || "N/A"}회
              </span>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {selectedRound?.numbers.map((num) => (
                <LottoBall key={num} number={num} />
              ))}
            </div>
          </div>

          {/* 🔵 다음 회차 (있을 경우만 표시) */}
          {nextRound && (
            <div className="flex-1 bg-linear-to-br from-sky-50 to-blue-50 rounded-xl p-4 border-2 border-sky-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-gray-800">
                  ⏭️ 다음 회차: {nextRound.round}회
                </span>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {nextRound.numbers.map((num) => (
                  <LottoBall key={num} number={num} />
                ))}
              </div>
            </div>
          )}
        </div>
        {loading && <div className="text-center">⏳ 로딩중...</div>}

        {!loading && data && (
          <>
            {/* 10단위 */}
            <SimpleBarChart
              title="10단위 구간별 출현"
              data={Object.entries(data.ranges["10"].counts).map(
                ([label, count]) => ({ label, count })
              )}
            />

            <div className="text-sm text-gray-700 mb-2">
              매칭 회차 ({data.ranges["10"].matchingRounds.length}개):{" "}
              {data.ranges["10"].matchingRounds.length === 0
                ? "없음"
                : data.ranges["10"].matchingRounds
                    .map((r) => r.round)
                    .join(", ")}
            </div>

            {/* 💥 다음 회차 빈도수 — 네 스타일 컴포넌트 */}
            <NextFrequencyChart
              title="10단위 패턴 → 다음 회차 빈도수"
              frequency={data.ranges["10"].nextFrequency}
            />

            {/* 7단위 */}
            <SimpleBarChart
              title="7단위 구간별 출현"
              data={Object.entries(data.ranges["7"].counts).map(
                ([label, count]) => ({ label, count })
              )}
            />

            <div className="text-sm text-gray-700 mb-2">
              매칭 회차 ({data.ranges["7"].matchingRounds.length}개):{" "}
              {data.ranges["7"].matchingRounds.length === 0
                ? "없음"
                : data.ranges["7"].matchingRounds
                    .map((r) => r.round)
                    .join(", ")}
            </div>

            <NextFrequencyChart
              title="7단위 패턴 → 다음 회차 빈도수"
              frequency={data.ranges["7"].nextFrequency}
            />
          </>
        )}
      </div>
    </div>
  );
}
