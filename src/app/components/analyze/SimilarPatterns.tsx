"use client";

import { useEffect, useState } from "react";
import LottoBall from "../LottoBall";
import RangeFilterBar from "../RangeFilterBar";
import { getLatestRound } from "@/app/utils/getLatestRound";
import { ApiResponse } from "@/app/types/api";

interface AnalysisResult {
  numbers: number[];
  round: number;
  nextNumbers: number[];
}

interface ApiPayload {
  selectedRound: AnalysisResult;
  results: AnalysisResult[];
  frequency: Record<number, number>;
}

const url = process.env.NEXT_PUBLIC_BACKEND_URL;
const latest = getLatestRound();

export default function SimilarPatterns() {
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [selectedRound, setSelectedRound] = useState<AnalysisResult | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const [minMatch, setMinMatch] = useState(2);
  const [start, setStart] = useState(latest - 9);
  const [end, setEnd] = useState(latest);
  const [includeBonus, setIncludeBonus] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${url}/api/lotto/similar?start=${start}&end=${end}&includeBonus=${includeBonus}&minMatch=${minMatch}`
        );
        const json = (await res.json()) as ApiResponse<ApiPayload>;

        if (!json.success || !json.data) {
          setSelectedRound(null);
          setResults([]);
          return;
        }

        setSelectedRound(json.data.selectedRound);
        setResults(json.data.results);
      } catch (err) {
        console.error(err);
        setSelectedRound(null);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [minMatch, start, end, includeBonus]);

  const handleRecent = (count: number) => {
    setStart(latest - count + 1);
    setEnd(latest);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4 space-y-8">
      {/* ------------------------------- */}
      {/* 상단 헤더 설명 */}
      {/* ------------------------------- */}
      <div className="space-y-2">
        <h1 className="text-xl font-bold text-gray-800">다음 회차 번호 분석</h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          특정 회차에서 번호가 얼마나 일치했는지에 따라, 다음 회차에서 어떤
          번호가 자주 등장했는지 분석한 통계입니다.
        </p>
      </div>

      {/* Range UI */}
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
      {results.length === 0 && <p>유사한 회차 데이터가 없습니다.</p>}
      {/* ------------------------------- */}
      {/* 최소 일치 탭 Navigation */}
      {/* ------------------------------- */}
      <div className="flex gap-2 border-b pb-2">
        {[1, 2, 3, 4].map((match) => (
          <button
            key={match}
            onClick={() => setMinMatch(match === 4 ? 4 : match)}
            className={`px-3 py-1 rounded-t-md font-medium text-sm
              ${
                minMatch === match
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {match === 4 ? "4개 이상" : `${match}개`}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-2">
        <div className="p-4 rounded-xl shadow-md bg-green-200 border">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-gray-700 text-lg">
              {selectedRound && selectedRound.round} 회
            </span>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {selectedRound &&
              selectedRound.numbers.map((num) => (
                <LottoBall
                  key={num}
                  number={num}
                  className="w-8 h-8 sm:w-10 sm:h-10"
                  isSelected={selectedRound?.numbers.includes(num)}
                />
              ))}
          </div>
        </div>
        <div className="p-4 rounded-xl shadow-md bg-green-200 border">
          <span className="font-bold text-gray-700 text-md">
            {minMatch === 4 ? "4개 이상" : `${minMatch}개`} 일치{" : "}
            {end - start + 1} 회차 중 {results.length} 개 검색
          </span>
        </div>
      </div>

      {/* ------------------------------- */}
      {/* 회차별 분석 리스트 */}
      {/* ------------------------------- */}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {results.map((item) => (
          <div
            key={item.round}
            className="p-4 rounded-xl shadow-md bg-white border"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-gray-700 text-lg">
                {item.round} 회
              </span>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {item.numbers.map((num) => (
                <LottoBall
                  key={num}
                  number={num}
                  className="w-8 h-8 sm:w-10 sm:h-10"
                  isSelected={selectedRound?.numbers.includes(num)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
