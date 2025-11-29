"use client";

import { useState, useEffect } from "react";
import { LottoNumber } from "@/app/types/lotto";
import LottoPaper from "@/app/components/LottoPaper";
import LottoCard from "@/app/components/LottoCard";
import SimplePattern from "@/app/components/SimplePattern";
import { apiUrl, getLatestRound } from "@/app/utils/getUtils";

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
        const res = await fetch(`${apiUrl}/api/lotto/round/${round}`);
        const json = await res.json();

        if (json.success !== true) {
          setError(json.message);
          setLottoData(null);
          return;
        }
        setError(null);
        setLottoData(json.data);
      } catch (err) {
        console.error(err);
        setLottoData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [round]);

  const handleInputChange = (val: string) => {
    const num = Number(val);
    if (Number.isNaN(num)) {
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
    <div className="min-h-screen bg-linear-to-br from-indigo-50 to-purple-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
            🎱 회차별 당첨 정보
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            특정 회차의 당첨 번호와 패턴을 간략히 분석합니다.
          </p>
        </div>

        {/* Round Navigation */}
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 justify-center w-full sm:w-auto">
            <button
              onClick={() => changeRound(-1)}
              disabled={round <= 1}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-sm sm:text-base shadow-md transition-all ${
                round <= 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-linear-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 hover:shadow-lg"
              }`}
            >
              ◀ 이전 회차
            </button>

            <div className="flex items-center gap-2">
              <input
                type="number"
                value={inputRound}
                onChange={(e) => handleInputChange(e.target.value)}
                min={1}
                max={latestRound}
                className="w-24 sm:w-28 text-center border-2 border-gray-300 rounded-xl px-3 py-2 text-sm sm:text-base font-bold shadow-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="text-gray-600 font-medium text-sm sm:text-base">
                회
              </span>
            </div>

            <button
              onClick={() => changeRound(1)}
              disabled={round >= latestRound}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-sm sm:text-base shadow-md transition-all ${
                round >= latestRound
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-linear-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 hover:shadow-lg"
              }`}
            >
              다음 회차 ▶
            </button>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => {
                setRound(1);
                setInputRound("1");
              }}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm sm:text-base font-medium transition"
            >
              첫 회차
            </button>
            <button
              onClick={() => {
                setRound(latestRound);
                setInputRound(String(latestRound));
              }}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm sm:text-base font-medium transition"
            >
              최신 회차
            </button>
            <button
              onClick={() => {
                const random = Math.floor(Math.random() * latestRound) + 1;
                setRound(random);
                setInputRound(String(random));
              }}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg text-sm sm:text-base font-medium transition"
            >
              🎲 랜덤 회차
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <svg
                className="animate-spin h-10 w-10 sm:h-12 sm:w-12 text-indigo-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="text-gray-600 font-medium text-base sm:text-lg">
                {round}회 데이터를 불러오는 중...
              </p>
            </div>
          </div>
        )}

        {/* Cards */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <LottoCard data={lottoData} />
            <SimplePattern data={lottoData} />
            <LottoPaper data={lottoData} />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-100 text-red-700 rounded-2xl shadow-xl p-8 sm:p-12 text-center">
            <p className="text-base sm:text-lg font-medium">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
