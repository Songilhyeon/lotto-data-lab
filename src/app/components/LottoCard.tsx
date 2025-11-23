"use client";

import { LottoNumber } from "@/app/types/lotto";
import LottoBall from "./LottoBall";

export default function LottoCard({ data }: { data: LottoNumber | null }) {
  if (!data) return <div>표시할 로또 정보가 존재하지 않습니다.</div>;

  return (
    <div className="p-3 sm:p-4 border rounded-xl shadow-md bg-white w-full max-w-md mx-auto">
      <h2 className="text-lg sm:text-xl font-bold mb-2">{data.drwNo} 회</h2>

      <p className="text-sm mb-2">
        추첨일: {new Date(data.drwNoDate).toLocaleDateString()}
      </p>

      {/* 번호 출력 */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {[
          data.drwtNo1,
          data.drwtNo2,
          data.drwtNo3,
          data.drwtNo4,
          data.drwtNo5,
          data.drwtNo6,
        ].map((n) => (
          <LottoBall key={n} number={n} className="w-8 h-8 sm:w-10 sm:h-10" />
        ))}

        <span className="px-1 font-bold text-lg">+</span>

        <LottoBall
          key={data.bnusNo}
          number={data.bnusNo}
          className="w-8 h-8 sm:w-10 sm:h-10"
        />
      </div>

      <div className="text-sm sm:text-base leading-relaxed space-y-1">
        <p>총 판매액: {Number(data.totSellamnt).toLocaleString()}원</p>
        <p>1등 총 당첨금: {Number(data.firstAccumamnt).toLocaleString()}원</p>
        <p>1등 당첨금: {Number(data.firstWinamnt).toLocaleString()}원</p>
        <p>1등 인원: {data.firstPrzwnerCo}명</p>
      </div>
    </div>
  );
}
