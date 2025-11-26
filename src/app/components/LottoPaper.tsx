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

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-lg p-4 sm:p-6 max-w-xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 text-center">
        {data.drwNo} 회
      </h2>
      <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center">
        {[...Array(45)].map((_, i) => {
          const num = i + 1;
          const isHit = numbers.includes(num) && data.bnusNo !== num;
          const isBonus = data.bnusNo === num;
          return (
            <div
              key={num}
              className={`
                w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center
                border rounded-full font-semibold text-xs sm:text-sm
                ${
                  isHit
                    ? "bg-yellow-400 text-black"
                    : isBonus
                    ? "bg-green-400 text-black"
                    : "bg-white text-gray-400"
                }
              `}
            >
              {num}
            </div>
          );
        })}
      </div>
    </div>
  );
}
