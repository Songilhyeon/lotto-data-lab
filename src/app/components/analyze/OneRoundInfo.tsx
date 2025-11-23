"use client";

import { useState, useEffect } from "react";
import { LottoNumber } from "@/app/types/lotto";
import LottoPaper from "@/app/components/LottoPaper";
import { getLatestRound } from "@/app/utils/getLatestRound";
import LottoCard from "@/app/components/LottoCard";
import SimplePattern from "@/app/components/SimplePattern";

const latest = getLatestRound();
const url = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function OneRoundInfo() {
  const [round, setRound] = useState(latest);
  const [inputRound, setInputRound] = useState(String(latest));
  const [lottoData, setLottoData] = useState<LottoNumber | null>(null);

  // 🔹 API 호출
  useEffect(() => {
    if (!round) return;

    fetch(`${url}/api/lotto/round/${round}`)
      .then((res) => res.json())
      .then((res) => setLottoData(res.data))
      .catch(() => setLottoData(null));
  }, [round]);

  // 🔹 회차 입력 처리
  const handleInputChange = (val: string) => {
    const num = Number(val);

    // 숫자가 아닌 경우 그냥 입력 유지
    if (Number.isNaN(num)) {
      setInputRound(val);
      return;
    }

    // 범위 보정
    let corrected = num;
    if (num < 1) corrected = 1;
    else if (num > latest) corrected = latest;

    setRound(corrected);
    setInputRound(String(corrected)); // input에도 보정된 값 적용
  };

  // 🔹 버튼 클릭 시 회차 변경
  const changeRound = (delta: number) => {
    setRound((prev) => {
      const newRound = Math.min(Math.max(prev + delta, 1), latest);
      setInputRound(String(newRound));
      return newRound;
    });
  };

  return (
    <div className="text-gray-900 px-4 py-6 sm:px-6 md:px-10 space-y-6">
      {/* 회차 이동 UI */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5">
        <button
          onClick={() => changeRound(-1)}
          className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 text-sm sm:text-base"
        >
          ◀ 이전 회차
        </button>

        <input
          type="number"
          value={inputRound}
          onChange={(e) => handleInputChange(e.target.value)}
          min={1}
          max={latest}
          className="w-28 text-center border border-gray-300 rounded-lg px-2 py-1 text-base sm:text-lg shadow"
        />

        <button
          onClick={() => changeRound(1)}
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

      {/* LottoCard / Pattern / Paper */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 justify-center gap-5">
        <LottoCard data={lottoData} />
        <SimplePattern data={lottoData} />
        <LottoPaper data={lottoData} />
      </div>
    </div>
  );
}
