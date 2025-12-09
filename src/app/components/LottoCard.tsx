"use client";

import { LottoNumber } from "@/app/types/lotto";
import { cardWidth } from "../utils/getUtils";
import LottoBall from "./LottoBall";

const formatNumber = (num: number) => {
  return new Intl.NumberFormat("ko-KR").format(num);
};

export default function LottoCard({
  data,
  includeBonus,
}: {
  data: LottoNumber | null;
  includeBonus: boolean;
}) {
  if (!data) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 flex items-center justify-center min-h-[200px] max-w-xl mx-auto">
        <p className="text-gray-400 text-sm sm:text-base">
          데이터를 불러오는 중...
        </p>
      </div>
    );
  }

  const numbers = [
    data.drwtNo1,
    data.drwtNo2,
    data.drwtNo3,
    data.drwtNo4,
    data.drwtNo5,
    data.drwtNo6,
  ];

  return (
    // <div className="bg-linear-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-lg p-4 sm:p-6 border-t-4 border-yellow-500 max-w-xl mx-auto">
    <div
      className={`${cardWidth}  mx-auto rounded-2xl shadow-lg p-5 sm:p-6 border bg-linear-to-br from-yellow-50 to-orange-50 border-yellow-500`}
    >
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
          🎰 당첨 번호 ({data.drwNo}회)
        </h2>
        <p className="text-xs sm:text-sm text-gray-600">
          {new Date(data.drwNoDate).toLocaleDateString()}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-4">
        {numbers.map((num, idx) => (
          <LottoBall key={idx} number={num} size="lg" />
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 sm:gap-3 py-2 border-t border-gray-200">
        {includeBonus && (
          <>
            <span className="text-xs sm:text-sm text-gray-600">보너스</span>
            <LottoBall number={data.bnusNo} size="md" />
          </>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 space-y-1 sm:space-y-2 text-sm sm:text-base">
        <div className="flex justify-between">
          <span className="text-gray-600">1등 당첨금</span>
          <span className="font-bold text-yellow-600">
            {formatNumber(Number(data.firstWinamnt))}원
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">1등 당첨자 수</span>
          <span className="font-bold text-gray-800">
            {data.firstPrzwnerCo}명
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">1등 총 당첨금</span>
          <span className="font-bold text-gray-800">
            {data.firstAccumamnt !== "0"
              ? Number(data.firstAccumamnt).toLocaleString()
              : (
                  Number(data.firstPrzwnerCo) * Number(data.firstWinamnt)
                ).toLocaleString()}
            원
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">총 판매액</span>
          <span className="font-bold text-gray-800">
            {Number(data.totSellamnt).toLocaleString()}원
          </span>
        </div>
      </div>
    </div>
  );
}
