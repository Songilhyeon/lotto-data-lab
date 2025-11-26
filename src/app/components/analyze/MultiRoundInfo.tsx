"use client";

import { useState, useEffect } from "react";
import LottoPaper from "@/app/components/LottoPaper";
import LottoCard from "@/app/components/LottoCard";
import SimplePattern from "@/app/components/SimplePattern";
import { getLatestRound } from "@/app/utils/getLatestRound";
import RangeFilterBar from "@/app/components/RangeFilterBar";
import { LottoNumber } from "@/app/types/lotto";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;
const latest = getLatestRound();

export default function OneRoundInfo() {
  const [start, setStart] = useState(latest - 9);
  const [end, setEnd] = useState(latest);
  const [lottoData, setLottoData] = useState<LottoNumber[] | null>([]);
  const [viewType, setViewType] = useState<"card" | "pattern" | "paper">(
    "card"
  );
  const [selectedRecent, setSelectedRecent] = useState<number | null>(10);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${url}/api/lotto/rounds?start=${start}&end=${end}`
        );
        const json = await res.json();

        if (!json.data || !json.success) {
          if (!isMounted) return;
          setLottoData([]);
          return;
        }

        if (!isMounted) return;
        const sorted = [...json.data].sort((a, b) => b.drwNo - a.drwNo);
        setLottoData(sorted);
      } catch (err) {
        console.error(err);
        if (!isMounted) return;
        setLottoData(null);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [start, end]);

  // --- end 입력 시 recent 선택 해제 ---
  const handleEndChange = (value: number) => {
    setEnd(value);
    setSelectedRecent(null); // 수동 변경 시 recent 해제
  };

  // --- start 직접 수정 ---
  const handleStartChange = (value: number) => {
    setStart(value);
    setSelectedRecent(null); // 수동 변경 시 recent 해제
  };

  const handleRecent = (count: number) => {
    setSelectedRecent(count);
    setStart(end - count + 1);
  };

  const clearRecentSelect = () => setSelectedRecent(null);

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-purple-100 p-4 sm:p-6 lg:p-8">
      {/* Range UI */}
      <RangeFilterBar
        start={start}
        end={end}
        selectedRecent={selectedRecent}
        setStart={handleStartChange}
        setEnd={handleEndChange}
        latest={latest}
        onRecentSelect={handleRecent}
        clearRecentSelect={clearRecentSelect}
        showCheckBox={false}
      />

      {/* 🔥 컴포넌트 선택 버튼 */}
      <div className="flex gap-3 justify-center mt-4">
        <button
          onClick={() => setViewType("card")}
          className={`px-4 py-2 rounded-lg border ${
            viewType === "card"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300"
          }`}
        >
          당첨 정보
        </button>

        <button
          onClick={() => setViewType("pattern")}
          className={`px-4 py-2 rounded-lg border ${
            viewType === "pattern"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300"
          }`}
        >
          단순 패턴
        </button>

        <button
          onClick={() => setViewType("paper")}
          className={`px-4 py-2 rounded-lg border ${
            viewType === "paper"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300"
          }`}
        >
          용지 패턴
        </button>
      </div>

      {/* 🔥 선택된 컴포넌트만 표시 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 justify-center gap-5 mt-6">
        {lottoData &&
          lottoData.map((data) => {
            if (viewType === "card")
              return <LottoCard key={data.drwNo} data={data} />;
            if (viewType === "pattern")
              return <SimplePattern key={data.drwNo} data={data} />;
            if (viewType === "paper")
              return <LottoPaper key={data.drwNo} data={data} />;
            return null;
          })}
      </div>
    </div>
  );
}
