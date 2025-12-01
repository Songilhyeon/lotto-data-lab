"use client";

import { LottoNumber } from "@/app/types/lotto";

export default function LottoPaper({ data }: { data: LottoNumber | null }) {
  if (!data) return null;

  const numbers = [
    data.drwtNo1,
    data.drwtNo2,
    data.drwtNo3,
    data.drwtNo4,
    data.drwtNo5,
    data.drwtNo6,
    data.bnusNo,
  ];

  const isSelected = (n: number) => numbers.includes(n);
  const isBonus = (n: number) => data.bnusNo === n;

  return (
    <div
      className="max-w-xl mx-auto rounded-2xl shadow-lg p-5 sm:p-6 border border-orange-300
        bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"
    >
      {/* Header */}
      <div className="mb-3 text-center">
        <div className="inline-block px-4 py-1 bg-orange-200 text-orange-900 rounded-md border border-orange-300">
          <span className="font-bold text-lg">{data.drwNo} 회차</span>
        </div>
      </div>

      {/* Lotto Table */}
      <div className="grid grid-cols-7 gap-2 p-3 border border-gray-300 rounded-lg bg-white">
        {[...Array(45)].map((_, i) => {
          const num = i + 1;

          return (
            <div
              key={num}
              className={`
                w-full aspect-square flex items-center justify-center 
                text-sm font-semibold rounded-md border
                ${
                  isSelected(num)
                    ? isBonus(num)
                      ? "bg-green-500 text-white border-green-700"
                      : "bg-blue-500 text-white border-blue-700"
                    : "bg-white text-gray-600 border-gray-300"
                }
              `}
            >
              {num}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-3 mt-4 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div> 일반 번호
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-500"></div> 보너스
        </div>
      </div>
    </div>
  );
}
