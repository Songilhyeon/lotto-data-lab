"use client";
import { FaPlus } from "react-icons/fa";
import type { LottoNumber } from "@/app/types/lottoNumbers";
import LottoBall from "@/app/components/LottoBall";

type ResultCardProps = {
  record: LottoNumber;
};

export default function ResultCard({ record }: ResultCardProps) {
  const numbers = [
    record.drwtNo1,
    record.drwtNo2,
    record.drwtNo3,
    record.drwtNo4,
    record.drwtNo5,
    record.drwtNo6,
  ];

  const sum = numbers.reduce((acc, num) => acc + num, 0);

  const firstTotal =
    Number(record.firstAccumamnt) === 0
      ? Number(record.firstWinamnt) * Number(record.firstPrzwnerCo)
      : Number(record.firstAccumamnt);

  const secondWin = Number(record.secondWinamnt ?? 0);
  const secondCo = Number(record.secondPrzwnerCo ?? 0);
  const secondTotal = secondWin > 0 && secondCo > 0 ? secondWin * secondCo : 0;

  return (
    <div className="p-4 max-w-full border rounded-lg bg-white shadow flex flex-col gap-3">
      {/* 상단 회차 + 날짜 */}
      <div className="flex justify-between items-center mb-2 text-sm sm:text-base">
        <span className="font-bold">회차 {record.drwNo}</span>
        <span className="text-gray-500">
          {new Date(record.drwNoDate).toISOString().slice(0, 10)}
        </span>
      </div>

      {/* 당첨 정보 */}
      <div className="flex flex-col gap-1 mb-2 text-xs sm:text-sm">
        {/* 1등 */}
        <div>
          💰 1등 총 당첨금:{" "}
          <span className="font-semibold">{firstTotal.toLocaleString()}원</span>
        </div>
        <div>
          💰 1등 1인당:{" "}
          <span className="font-semibold">
            {Number(record.firstWinamnt).toLocaleString()}원
          </span>
        </div>
        <div>
          👥 1등 당첨자:{" "}
          <span className="font-semibold">
            {Number(record.firstPrzwnerCo).toLocaleString()}명
          </span>
        </div>

        {/* 2등 */}
        <div className="pt-1 border-t border-dashed border-gray-200">
          💰 2등 1인당:{" "}
          <span className="font-semibold text-indigo-600">
            {secondWin > 0 ? `${secondWin.toLocaleString()}원` : "-"}
          </span>
        </div>
        <div>
          👥 2등 당첨자:{" "}
          <span className="font-semibold">
            {secondCo > 0 ? `${secondCo.toLocaleString()}명` : "-"}
          </span>
        </div>
        <div>
          🧾 2등 총액:{" "}
          <span className="font-semibold">
            {secondTotal > 0 ? `${secondTotal.toLocaleString()}원` : "-"}
          </span>
        </div>

        {/* 판매액 */}
        <div className="pt-1 text-gray-600">
          🏷 총 판매액: {Number(record.totSellamnt).toLocaleString()}원
        </div>
      </div>

      {/* 번호 */}
      <div className="flex flex-wrap gap-2 justify-start">
        {numbers.map((n) => (
          <LottoBall key={n} number={n} />
        ))}
        {record.bnusNo && (
          <div className="flex items-center gap-1">
            <span className="text-gray-500 text-xs sm:text-sm">
              <FaPlus />
            </span>
            <LottoBall number={record.bnusNo} />
          </div>
        )}
      </div>

      {/* 번호 합계 */}
      <div className="mt-2 text-sm sm:text-base font-semibold">
        번호합: {sum}{" "}
        <span className="text-gray-500 text-sm">(보너스 번호 제외)</span>
      </div>
    </div>
  );
}
