"use client";

import { useState, useEffect } from "react";
import { LottoNumber } from "@/app/types/lotto";
import LottoPaper from "@/app/components/LottoPaper";
import LottoCard from "@/app/components/LottoCard";
import SimplePattern from "@/app/components/SimplePattern";
import { apiUrl, getLatestRound } from "@/app/utils/getUtils";
import ComponentHeader from "@/app/components/ComponentHeader";
import { analysisDivStyle } from "@/app/utils/getDivStyle";

export default function OneRoundInfo() {
  const [round, setRound] = useState(getLatestRound());
  const [inputRound, setInputRound] = useState(String(getLatestRound()));
  const [lottoData, setLottoData] = useState<LottoNumber | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const latestRound = getLatestRound();

  useEffect(() => {
    if (!round) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/lotto/round/${round}`);
        const json = await res.json();

        if (!json.success) {
          setError(json.message);
          setLottoData(null);
          return;
        }

        setError(null);
        setLottoData(json.data);
      } catch (err) {
        console.error(err);
        setError("데이터 로딩 중 오류가 발생했습니다.");
        setLottoData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [round]);

  const handleInputChange = (val: string) => {
    const num = Number(val);
    if (isNaN(num)) {
      setInputRound(val);
      return;
    }
    const corrected = Math.min(Math.max(num, 1), latestRound);
    setRound(corrected);
    setInputRound(String(corrected));
  };

  const changeRound = (delta: number) => {
    setRound((prev) => {
      const newRound = Math.min(Math.max(prev + delta, 1), latestRound);
      setInputRound(String(newRound));
      return newRound;
    });
  };

  return (
    <div className={`${analysisDivStyle()} from-indigo-50 to-purple-100`}>
      {/* Header */}
      <ComponentHeader
        title="🎱 회차별 당첨 정보"
        content="특정 회차의 당첨 번호와 패턴을 간략히 분석합니다."
      />

      {/* Round Navigation (반응형 최적화) */}
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 flex flex-col gap-5">
        {/* 버튼 및 입력 레이아웃 */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4 w-full">
          {/* 좌/우 이동 및 입력창 */}
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 sm:gap-4">
            {/* 이전 회차 */}
            <button
              onClick={() => changeRound(-1)}
              disabled={round <= 1}
              className={`px-4 py-2 rounded-xl font-semibold text-sm shadow-md transition-all
                ${
                  round <= 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }
              `}
            >
              ◀ 이전
            </button>

            {/* 입력창 */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={inputRound}
                onChange={(e) => handleInputChange(e.target.value)}
                className="w-24 text-center border-2 border-gray-300 rounded-xl px-3 py-2 text-sm font-bold shadow-sm focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-600 font-medium">회</span>
            </div>

            {/* 다음 회차 */}
            <button
              onClick={() => changeRound(1)}
              disabled={round >= latestRound}
              className={`px-4 py-2 rounded-xl font-semibold text-sm shadow-md transition-all
                ${
                  round >= latestRound
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }
              `}
            >
              다음 ▶
            </button>
          </div>

          {/* 보조 버튼: 첫 회차 / 최신 회차 / 랜덤 */}
          <div className="flex flex-wrap justify-center sm:justify-end gap-2">
            <button
              onClick={() => {
                setRound(1);
                setInputRound("1");
              }}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium"
            >
              첫 회차
            </button>

            <button
              onClick={() => {
                setRound(latestRound);
                setInputRound(String(latestRound));
              }}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium"
            >
              최신 회차
            </button>

            <button
              onClick={() => {
                const random = Math.floor(Math.random() * latestRound) + 1;
                setRound(random);
                setInputRound(String(random));
              }}
              className="px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white rounded-lg text-sm font-medium"
            >
              🎲 랜덤
            </button>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin h-10 w-10 border-4 border-indigo-300 border-t-indigo-600 rounded-full"></div>
            <p className="text-gray-600 font-medium">
              {round}회 데이터를 불러오는 중...
            </p>
          </div>
        </div>
      )}

      {/* 카드 3개 */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <LottoCard data={lottoData} includeBonus={true} />
          <SimplePattern data={lottoData} includeBonus={true} />
          <LottoPaper data={lottoData} includeBonus={true} />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="bg-red-100 text-red-700 rounded-2xl shadow-xl p-8 sm:p-12 text-center">
          <p className="text-base sm:text-lg font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}
