"use client";

import { useEffect, useState, useRef } from "react";
import RangeFilterBar from "../RangeFilterBar";
import { apiUrl, getLatestRound } from "@/app/utils/getUtils";
import SimpleBarChart from "./SimpleBarChart";
import NextFrequencyChart from "./RangeNextChart";
import LottoBall from "../LottoBall";
import { analysisDivStyle, rangeFilterDivStyle } from "@/app/utils/getDivStyle";
import ComponentHeader from "@/app/components/ComponentHeader";
import LookUpButton from "@/app/components/analyze/LookUpButton";
import DraggableNextRound from "./DraggableNextRound";

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
  selectedRound: { round: number; numbers: number[]; bonus: number };
  nextRound: { round: number; numbers: number[]; bonus: number } | null;
  ranges: { "10": RangeResult; "7": RangeResult };
}

interface LottoDraw {
  round: number;
  numbers: number[];
  bonus: number;
}

export default function NumberRangeMatch() {
  const latestRound = getLatestRound();
  const [selectedRound, setSelectedRound] = useState<LottoDraw | null>(null);
  const [nextRound, setNextRound] = useState<LottoDraw | null>(null);
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(latestRound);
  const [includeBonus, setIncludeBonus] = useState(false);
  const [tolerance, setTolerance] = useState(0); // 🔹 추가
  const [selectedRecent, setSelectedRecent] = useState<number | null>(
    latestRound
  );
  const [data, setData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(false);

  const prevParamsRef = useRef({
    start: -1,
    end: -1,
    includeBonus: !includeBonus,
    tolerance: -1, // 🔹 추가
  });

  const fetchData = async () => {
    const prev = prevParamsRef.current;
    if (
      prev.start === start &&
      prev.end === end &&
      prev.includeBonus === includeBonus &&
      prev.tolerance === tolerance // 🔹 비교
    ) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${apiUrl}/lotto/range?start=${start}&end=${end}&includeBonus=${includeBonus}&tolerance=${tolerance}`
      );

      const json = await res.json();
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
      prevParamsRef.current = { start, end, includeBonus, tolerance }; // 🔹 저장
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
    if (!data) return { most: [], least: [] };

    const calc = (freq: Record<number, number>) => {
      const values = Object.values(freq);
      const max = Math.max(...values);
      const min = Math.min(...values);

      const maxList = Object.entries(freq)
        .filter(([_, c]) => c === max)
        .map(([n]) => Number(n));

      const minList = Object.entries(freq)
        .filter(([_, c]) => c === min)
        .map(([n]) => Number(n));

      return { maxList, minList };
    };

    const f10 = calc(data.ranges["10"].nextFrequency);
    const f7 = calc(data.ranges["7"].nextFrequency);

    return {
      most: [...f10.maxList, ...f7.maxList],
      least: [...f10.minList, ...f7.minList],
    };
  };

  const { most, least } = getMostAndLeast();

  return (
    <div className={`${analysisDivStyle()} from-green-50 to-pink-100`}>
      {/* Header */}
      <ComponentHeader
        title="🔮 구간별 출현 패턴 분석"
        content="특정 회차의 구간별 번호 구성이 동일한 과거 회차를 찾고, 그 다음 회차에서 등장한 번호의 빈도를 표시합니다."
      />
      {/* Filter */}
      <div className={rangeFilterDivStyle}>
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

      {/* 조회하기 + Tolerance 선택 */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mt-2 mb-6">
        {/* 조회하기 버튼 */}

        <LookUpButton onClick={fetchData} loading={loading} />

        {/* 🔹 Tolerance 선택 */}
        <div className="flex items-center gap-2">
          <label className="font-medium text-gray-700">
            허용 오차(tolerance):
          </label>
          <select
            className="border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={tolerance}
            onChange={(e) => setTolerance(Number(e.target.value))}
          >
            <option value={0}>0</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* 기준 회차 카드 */}
          <div className="flex-1 bg-transparent rounded-xl p-4 border border-emerald-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-bold text-gray-800 shrink-0">
                📌 기준 회차: {selectedRound?.round ?? "N/A"}회
              </span>

              {/* 번호 표시 영역 */}
              <div className="flex items-center gap-2 flex-wrap justify-end">
                {selectedRound?.numbers.map((num, index) => (
                  <div key={index} className="flex items-center">
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
          </div>
        </div>
      </div>
      {/* 다음 회차 */}
      {nextRound && <DraggableNextRound nextRound={nextRound} />}

      {loading && <div className="text-center">⏳ 로딩중...</div>}

      {!loading && data && (
        <>
          {/* 10단위 */}
          <SimpleBarChart
            title="10단위 구간별 출현"
            data={Object.entries(data.ranges["10"].counts).map(
              ([label, count]) => ({
                label,
                count,
              })
            )}
          />
          <div className="text-sm text-gray-700 mb-2">
            매칭 회차 ({data.ranges["10"].matchingRounds.length}개):{" "}
            {data.ranges["10"].matchingRounds.length === 0
              ? "없음"
              : tolerance === 0 &&
                data.ranges["10"].matchingRounds.map((r) => r.round).join(", ")}
          </div>
          <NextFrequencyChart
            title="10단위 패턴 → 다음 회차 빈도수"
            frequency={data.ranges["10"].nextFrequency}
          />

          {/* 7단위 */}
          <SimpleBarChart
            title="7단위 구간별 출현"
            data={Object.entries(data.ranges["7"].counts).map(
              ([label, count]) => ({
                label,
                count,
              })
            )}
          />
          <div className="text-sm text-gray-700 mb-2">
            매칭 회차 ({data.ranges["7"].matchingRounds.length}개):{" "}
            {data.ranges["7"].matchingRounds.length === 0
              ? "없음"
              : tolerance === 0 &&
                data.ranges["7"].matchingRounds.map((r) => r.round).join(", ")}
          </div>
          <NextFrequencyChart
            title="7단위 패턴 → 다음 회차 빈도수"
            frequency={data.ranges["7"].nextFrequency}
          />
        </>
      )}
    </div>
  );
}
