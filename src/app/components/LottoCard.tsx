"use client";

import { LottoNumber } from "@/app/types/lottoNumbers";
import { cardWidth, formatNumber } from "../utils/getUtils";
import LottoBall from "./LottoBall";

export default function LottoCard({
  data,
  includeBonus,
}: {
  data: LottoNumber | null;
  includeBonus: boolean;
}) {
  if (!data) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 flex items-center justify-center min-h-[200px] w-full max-w-xl mx-auto">
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

  const hasSecond =
    data.secondPrzwnerCo !== null ||
    data.secondWinamnt !== null ||
    data.secondAccumamnt !== null;

  const firstTotal =
    data.firstAccumamnt !== "0"
      ? Number(data.firstAccumamnt)
      : Number(data.firstPrzwnerCo) * Number(data.firstWinamnt);

  return (
    <div
      className={`${cardWidth} mx-auto rounded-2xl shadow-lg 
      p-4 sm:p-6 border bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-500`}
    >
      <div className="mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-1">
          🎰 당첨 번호 ({data.drwNo}회)
        </h2>
        <p className="text-xs sm:text-sm text-gray-600">
          {new Date(data.drwNoDate).toLocaleDateString()}
        </p>
      </div>

      {/* ✅ 번호: 스크롤 없음 / 한 줄 고정 / 모바일에서 크기+간격 축소 */}
      <div className="mb-3 sm:mb-4">
        <div className="flex items-center justify-center flex-nowrap">
          {/* ✅ 번호 6개 */}
          <div className="flex items-center flex-nowrap gap-1 sm:gap-3">
            {numbers.map((num, idx) => (
              <div key={idx} className="shrink-0">
                {/* 모바일: sm / sm 이상: md */}
                <LottoBall number={num} size="sm" className="sm:hidden" />
                <LottoBall number={num} size="md" className="hidden sm:flex" />
              </div>
            ))}
          </div>

          {/* ✅ 보너스 */}
          {includeBonus && (
            <div className="flex items-center flex-nowrap ml-1 sm:ml-3 gap-1 sm:gap-2">
              <span className="text-gray-500 font-bold text-base sm:text-xl leading-none">
                +
              </span>

              <div className="shrink-0">
                {/* 보너스는 모바일에서 더 작게 */}
                <LottoBall number={data.bnusNo} size="sm" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ✅ 1등/2등 요약: 모바일=1열, sm+=2열 */}
      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          {/* 1등 */}
          <div className="bg-white/70 rounded-xl border border-gray-200 p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-gray-600">1등</span>
              <span className="text-[11px] text-gray-500 tabular-nums">
                {data.firstPrzwnerCo}명
              </span>
            </div>

            <div className="mt-2 space-y-2">
              {/* 당첨금 */}
              <div>
                <p className="text-[10px] sm:text-xs text-gray-600 leading-none">
                  당첨금
                </p>
                <p className="mt-1 font-bold text-yellow-600 tabular-nums text-[13px] sm:text-base leading-tight">
                  {formatNumber(Number(data.firstWinamnt))}원
                </p>
              </div>

              {/* 총액 */}
              <div>
                <p className="text-[10px] sm:text-xs text-gray-600 leading-none">
                  총액
                </p>
                <p className="mt-1 font-semibold text-gray-800 tabular-nums text-[13px] sm:text-base leading-tight">
                  {firstTotal.toLocaleString()}원
                </p>
              </div>
            </div>
          </div>

          {/* 2등 */}
          <div className="bg-white/70 rounded-xl border border-gray-200 p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-gray-600">2등</span>
              <span className="text-[11px] text-gray-500 tabular-nums">
                {data.secondPrzwnerCo !== null
                  ? `${data.secondPrzwnerCo}명`
                  : "-"}
              </span>
            </div>

            {hasSecond ? (
              <>
                <div className="mt-2 space-y-2">
                  {/* 당첨금 */}
                  <div>
                    <p className="text-[10px] sm:text-xs text-gray-600 leading-none">
                      당첨금
                    </p>
                    <p className="mt-1 font-bold text-indigo-600 tabular-nums text-[13px] sm:text-base leading-tight">
                      {data.secondWinamnt !== null
                        ? `${formatNumber(Number(data.secondWinamnt))}원`
                        : "-"}
                    </p>
                  </div>

                  {/* 총액 */}
                  <div>
                    <p className="text-[10px] sm:text-xs text-gray-600 leading-none">
                      총액
                    </p>
                    <p className="mt-1 font-semibold text-gray-800 tabular-nums text-[13px] sm:text-base leading-tight">
                      {data.secondAccumamnt !== null
                        ? `${Number(data.secondAccumamnt).toLocaleString()}원`
                        : "-"}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-[11px] sm:text-sm text-gray-400 mt-1">
                데이터 없음
              </p>
            )}
          </div>
        </div>

        {/* 총 판매액 */}
        <div className="flex justify-between gap-3 text-[11px] sm:text-sm pt-1">
          <span className="text-gray-600 shrink-0">총 판매액</span>
          <span className="font-bold text-gray-800 tabular-nums truncate max-w-[65%] text-right">
            {Number(data.totSellamnt).toLocaleString()}원
          </span>
        </div>
      </div>

      {/* 📌 1등 당첨 방식 */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <h3 className="text-xs sm:text-sm text-gray-500 mb-2">1등 당첨 방식</h3>

        {/* 모바일에서 너무 넓지 않게 gap 줄임 */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white shadow-sm rounded-xl p-2 text-center border">
            <p className="text-[10px] sm:text-xs text-gray-500">자동</p>
            <p className="font-bold text-gray-800 text-sm sm:text-base tabular-nums">
              {data.autoWin ?? 0}명
            </p>
          </div>

          <div className="bg-white shadow-sm rounded-xl p-2 text-center border">
            <p className="text-[10px] sm:text-xs text-gray-500">반자동</p>
            <p className="font-bold text-gray-800 text-sm sm:text-base tabular-nums">
              {data.semiAutoWin ?? 0}명
            </p>
          </div>

          <div className="bg-white shadow-sm rounded-xl p-2 text-center border">
            <p className="text-[10px] sm:text-xs text-gray-500">수동</p>
            <p className="font-bold text-gray-800 text-sm sm:text-base tabular-nums">
              {data.manualWin ?? 0}명
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
