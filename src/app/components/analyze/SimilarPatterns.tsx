"use client";

import { useEffect, useState } from "react";

type LottoNumber = {
  drwNo: number;
  drwtNo1: number;
  drwtNo2: number;
  drwtNo3: number;
  drwtNo4: number;
  drwtNo5: number;
  drwtNo6: number;
  bnusNo: number;
};

interface AnalysisResult extends LottoNumber {
  numbers: number[];
  highlightMost: boolean;
  highlightLeast: boolean;
  similarCount: number;
}

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function SimilarPatterns() {
  const [data, setData] = useState<AnalysisResult[]>([]);
  const [numberStats, setNumberStats] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(false);
  const [minMatch, setMinMatch] = useState(4);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${url}/api/lotto/similar?limit=50&minMatch=${minMatch}`
        );
        const json = await res.json();
        setData(json.data.similarRounds);
        setNumberStats(json.data.numberStats);
      } catch (err) {
        console.error(err);
        setData([]);
        setNumberStats({});
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [minMatch]);

  if (loading) return <p>Loading...</p>;
  if (!data.length) return <p>유사한 회차 데이터가 없습니다.</p>;

  return (
    <div className="p-4 space-y-6">
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
          key={item.drwNo}
          className="p-4 rounded-xl shadow-lg bg-white border"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-gray-700 text-lg">
              회차: {item.drwNo}
            </span>
            <span className="text-sm text-gray-500">
              유사 번호 {item.similarCount}개
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {item.numbers.map((num) => {
              const count = numberStats[num] || 0;

              let bgColor = "bg-gray-100 text-gray-700";
              if (
                item.highlightMost &&
                count ===
                  Math.max(...item.numbers.map((n) => numberStats[n] || 0))
              ) {
                bgColor = "bg-yellow-300 text-black";
              }
              if (
                item.highlightLeast &&
                count ===
                  Math.min(...item.numbers.map((n) => numberStats[n] || 0))
              ) {
                bgColor = "bg-green-300 text-black";
              }
              if (
                item.similarCount > 0 &&
                item.numbers.includes(num) &&
                item.numbers.filter((n) => item.numbers.includes(n)).length <=
                  item.similarCount
              ) {
                bgColor = "bg-blue-300 text-black";
              }

              return (
                <div
                  key={num}
                  className={`w-10 h-10 flex items-center justify-center text-sm font-semibold border rounded ${bgColor}`}
                >
                  {num}
                </div>
              );
            })}
            {/* 보너스 번호 표시 */}
            <div className="w-10 h-10 flex items-center justify-center text-sm font-bold border rounded bg-red-200 text-black">
              {item.bnusNo}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
