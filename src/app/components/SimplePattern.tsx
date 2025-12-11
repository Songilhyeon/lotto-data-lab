"use client";

import { LottoNumber } from "@/app/types/lotto";
import { cardWidth } from "@/app/utils/getUtils";

export default function SimplePattern({
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
    ...(includeBonus ? [data.bnusNo] : []),
  ];

  const oddCount = numbers.filter((n) => n % 2 === 1).length;
  const evenCount = numbers.length - oddCount;

  const ranges = [0, 0, 0, 0, 0];
  numbers.forEach((n) => {
    if (n <= 10) ranges[0]++;
    else if (n <= 20) ranges[1]++;
    else if (n <= 30) ranges[2]++;
    else if (n <= 40) ranges[3]++;
    else ranges[4]++;
  });

  const sum = numbers.reduce((a, b) => a + b, 0);

  const consecutiveGroups: number[][] = [];
  let tempGroup: number[] = [];

  for (let i = 0; i < numbers.length; i++) {
    if (tempGroup.length === 0) {
      tempGroup.push(numbers[i]);
    } else {
      if (numbers[i] === tempGroup[tempGroup.length - 1] + 1) {
        tempGroup.push(numbers[i]);
      } else {
        if (tempGroup.length > 1) consecutiveGroups.push([...tempGroup]);
        tempGroup = [numbers[i]];
      }
    }
  }
  if (tempGroup.length > 1) consecutiveGroups.push(tempGroup);

  const lastDigitCounts = Array(10).fill(0);
  numbers.forEach((n) => lastDigitCounts[n % 10]++);

  return (
    <div
      className={`${cardWidth} mx-auto rounded-2xl shadow-lg 
      p-4 sm:p-6 border bg-linear-to-br from-blue-50 to-cyan-50 border-blue-500`}
    >
      <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
        📊 패턴 분석 ({data.drwNo}회)
      </h2>

      <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
        {/* 홀짝 */}
        <div>
          <h3 className="text-[11px] sm:text-xs font-semibold text-gray-700 mb-1">
            홀짝 비율
          </h3>
          <div className="flex gap-2">
            <div className="flex-1 bg-blue-500 text-white rounded-lg p-2 text-center">
              <div className="text-[10px] sm:text-xs mb-1">홀수</div>
              <div className="text-base sm:text-lg font-bold">{oddCount}</div>
            </div>
            <div className="flex-1 bg-red-500 text-white rounded-lg p-2 text-center">
              <div className="text-[10px] sm:text-xs mb-1">짝수</div>
              <div className="text-base sm:text-lg font-bold">{evenCount}</div>
            </div>
          </div>
        </div>

        {/* 구간 분포 */}
        <div>
          <h3 className="text-[11px] sm:text-xs font-semibold text-gray-700 mb-1">
            구간 분포
          </h3>
          <div className="grid grid-cols-5 gap-1 sm:gap-2">
            {["1-10", "11-20", "21-30", "31-40", "41-45"].map((label, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg p-1.5 text-center border-2 border-gray-200"
              >
                <div className="text-[9px] sm:text-[11px] text-gray-600">
                  {label}
                </div>
                <div className="text-lg sm:text-xl font-bold text-gray-800">
                  {ranges[idx]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 끝자리 */}
        <div>
          <h3 className="text-[11px] sm:text-xs font-semibold text-gray-700 mb-1">
            끝자리 분포 (0~9)
          </h3>

          {/* 모바일 = 5열 / 데스크탑 = 10열 */}
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1 sm:gap-2">
            {lastDigitCounts.map((count, idx) => (
              <div
                key={idx}
                className="bg-white rounded-md p-1 text-center border border-gray-200"
              >
                <div className="text-[8px] sm:text-[11px] text-gray-600">
                  {idx}
                </div>
                <div className="text-sm sm:text-base font-bold">{count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 연속 숫자 */}
        <div>
          <p className="text-[11px] sm:text-xs font-semibold text-gray-700 mb-1">
            연속 숫자
          </p>
          {consecutiveGroups.length > 0 ? (
            consecutiveGroups.map((g, idx) => (
              <p
                key={idx}
                className="text-xs sm:text-sm font-bold text-red-500"
              >
                {g.join(", ")} 🔥
              </p>
            ))
          ) : (
            <p className="text-xs sm:text-sm font-bold text-gray-500">없음</p>
          )}
        </div>

        {/* 합계 */}
        <div>
          <h3 className="text-[11px] sm:text-xs font-semibold text-gray-700 mb-1">
            번호 합계
          </h3>
          <div className="bg-white rounded-lg p-2 text-center border-2 border-gray-200">
            <div className="text-xl sm:text-2xl font-bold text-gray-800">
              {sum}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
