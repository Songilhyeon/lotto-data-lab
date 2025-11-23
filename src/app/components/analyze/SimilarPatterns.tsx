"use client";

import { useEffect, useState } from "react";
import LottoBall from "../LottoBall";
import RangeFilterBar from "./RangeFilterBar";
import { getLatestRound } from "@/app/utils/getLatestRound";

interface AnalysisResult {
  numbers: number[];
  similarRound: number;
}

const url = process.env.NEXT_PUBLIC_BACKEND_URL;
const latest = getLatestRound();

export default function SimilarPatterns() {
  const [data, setData] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [minMatch, setMinMatch] = useState(4);
  const [selectedRound, setSelectedRound] = useState<AnalysisResult | null>(
    null
  );
  const [start, setStart] = useState(latest - 9);
  const [end, setEnd] = useState(latest);
  const [includeBonus, setIncludeBonus] = useState(false); // 보너스 포함 여부

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${url}/api/lotto/similar?start=${start}&end=${end}&includeBonus=${includeBonus}&minMatch=${minMatch}`
        );
        const json = await res.json();

        setSelectedRound(json.data[0]);
        setData(json.data);
      } catch (err) {
        console.error(err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [minMatch, start, end, includeBonus]);

  if (loading) return <p>Loading...</p>;
  if (!data.length) return <p>유사한 회차 데이터가 없습니다.</p>;

  // 최근 n개 버튼 클릭
  const handleRecent = (count: number) => {
    setStart(latest - count + 1);
    setEnd(latest);
  };

  return (
    <div className="p-4 space-y-6">
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

      {/* 최소 일치 번호 선택 */}
      <div className="flex items-center gap-2 mb-4">
        <label htmlFor="minMatch" className="font-medium text-gray-700">
          최소 일치 번호:
        </label>
        <select
          id="minMatch"
          value={minMatch}
          onChange={(e) => setMinMatch(Number(e.target.value))}
          className="px-2 py-1 border rounded-md text-gray-700"
        >
          {[3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      {/* 회차별 번호 표시 */}
      {data.map((item) => (
        <div
          key={item.similarRound}
          className="p-4 rounded-xl shadow-lg bg-white border"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-gray-700 text-lg">
              {item.similarRound} 회
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {item.numbers.map((num) => {
              return (
                <LottoBall
                  key={num}
                  number={num}
                  className="w-8 h-8 sm:w-10 sm:h-10"
                  isSelected={selectedRound?.numbers
                    .map((n) => n === num)
                    .includes(true)}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
