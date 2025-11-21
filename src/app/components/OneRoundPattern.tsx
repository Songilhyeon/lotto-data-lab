"use client";

import { LottoNumber } from "@/app/types/lotto";

export default function OneRoundPattern({
  data,
}: {
  data: LottoNumber | null;
}) {
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

  // Range count
  const ranges = [0, 0, 0, 0, 0];
  numbers.forEach((n) => {
    if (n <= 10) ranges[0]++;
    else if (n <= 20) ranges[1]++;
    else if (n <= 30) ranges[2]++;
    else if (n <= 40) ranges[3]++;
    else ranges[4]++;
  });

  return (
    <div className="p-4 sm:p-5 rounded-xl shadow-lg bg-white w-full max-w-md mx-auto">
      <h3 className="text-lg sm:text-xl font-bold text-blue-600 mb-3">
        단순 패턴
      </h3>

      {/* 홀짝 */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-700 mb-1">홀짝</p>
        <div className="flex gap-2 flex-wrap">
          {numbers.map((n, idx) => (
            <div key={idx} className="flex items-center">
              {idx === numbers.length - 1 && (
                <span className="mx-1 font-bold text-gray-600">+</span>
              )}

              <span
                className={`
                  flex items-center justify-center 
                  text-white font-bold rounded-full
                  w-7 h-7 sm:w-9 sm:h-9 
                  text-[11px] sm:text-xs
                  ${n % 2 === 0 ? "bg-blue-500" : "bg-red-500"}
                `}
              >
                {n % 2 === 0 ? "짝" : "홀"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 구간별 */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-700 mb-1">구간별 분포</p>
        <div className="space-y-2">
          {ranges.map((count, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="w-14 text-[11px] text-gray-600 sm:w-16 sm:text-xs">
                {idx === 0
                  ? "1~10"
                  : idx === 1
                  ? "11~20"
                  : idx === 2
                  ? "21~30"
                  : idx === 3
                  ? "31~40"
                  : "41~45"}
                :
              </span>

              <div className="bg-gray-200 w-full h-2 sm:h-3 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full"
                  style={{ width: `${(count / 6) * 100}%` }}
                />
              </div>

              <span className="text-[11px] sm:text-xs text-gray-600">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 연속 숫자 */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-1">연속 숫자</p>
        {consecutiveGroups.length > 0 ? (
          consecutiveGroups.map((group, idx) => (
            <p key={idx} className="text-sm font-bold text-red-500">
              {group.join(", ")} 🔥
            </p>
          ))
        ) : (
          <p className="text-sm font-bold text-gray-500">없음</p>
        )}
      </div>
    </div>
  );
}
