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

  useEffect(() => {
    fetch(`${url}/api/lotto/rounds?start=${start}&end=${end}`)
      .then((res) => res.json())
      .then((res) => {
        const sorted = [...res.data].sort((a, b) => b.drwNo - a.drwNo);
        setLottoData(sorted);
      })
      .catch(() => setLottoData(null));
  }, [start, end]);

  const handleRecent = (count: number) => {
    setStart(latest - count + 1);
    setEnd(latest);
  };

  return (
    <div className="text-gray-900 px-4 py-6 sm:px-6 md:px-10 space-y-6">
      {/* Range UI */}
      <RangeFilterBar
        start={start}
        end={end}
        setStart={setStart}
        setEnd={setEnd}
        latest={latest}
        onRecentSelect={handleRecent}
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
