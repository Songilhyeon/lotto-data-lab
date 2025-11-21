"use client";

import { useState, useEffect } from "react";
import { LottoNumber } from "@/app/types/lotto";
import LottoPaper from "@/app/components/LottoPaper";
import { getLatestRound } from "@/app/utils/getLatestRound";
import LottoCard from "@/app/components/LottoCard";
import OneRoundPattern from "@/app/components/OneRoundPattern";

export default function OneRoundAnalyze() {
  const [round, setRound] = useState(getLatestRound());
  const [lottoData, setLottoData] = useState<LottoNumber | null>(null);

  const latest = getLatestRound();

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL;
    fetch(`${url}/api/lotto/simple/${round}`)
      .then((res) => res.json())
      .then((res) => setLottoData(res.data))
      .catch(() => setLottoData(null));
  }, [round]);

  return (
    <div className="text-gray-900 px-4 py-6 sm:px-6 md:px-10 space-y-6">
      {/* 회차 이동 UI */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5">
        <button
          onClick={() => setRound((prev) => prev - 1)}
          className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 text-sm sm:text-base"
        >
          ◀ 이전 회차
        </button>

        <div className="text-base sm:text-lg font-semibold">{round}회</div>

        <button
          onClick={() => setRound((prev) => prev + 1)}
          disabled={round >= latest}
          className={`w-full sm:w-auto text-sm sm:text-base px-4 py-2 rounded-lg shadow ${
            round >= latest
              ? "bg-gray-300 cursor-not-allowed text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          다음 회차 ▶
        </button>
      </div>

      {/* LottoCard */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 justify-center gap-5">
        <LottoCard data={lottoData} />
        <OneRoundPattern data={lottoData} />
        <LottoPaper data={lottoData} />
      </div>
    </div>
  );
}
