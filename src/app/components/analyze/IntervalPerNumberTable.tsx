import React from "react";

export type PerNumberRow = {
  num: number;
  latestPattern: string | null;
  sampleCount: number;
  currentGap: number | null;
  lastGap: number | null;
};

export default function PerNumberTable({ data }: { data: PerNumberRow[] }) {
  const formatPattern = (pattern: string | null) => {
    if (!pattern || pattern.trim() === "") {
      return <span className="text-gray-400 text-xs">데이터 부족</span>;
    }
    return <span className="font-mono text-xs">{pattern}</span>;
  };

  const formatSample = (pattern: string | null, count: number) => {
    if (!pattern || pattern.trim() === "") {
      return <span className="text-gray-400 text-xs">-</span>;
    }
    return <span className="text-gray-700">{count}회</span>;
  };

  const formatCurrentGap = (gap: number | null) => {
    if (gap === null) {
      return <span className="text-gray-400 text-xs">범위 내 미출현</span>;
    }

    if (gap === 0) {
      return (
        <span className="text-green-600 font-semibold">현재 회차 출현 ✓</span>
      );
    }

    const colorClass =
      gap >= 15
        ? "text-red-600 font-semibold"
        : gap >= 10
        ? "text-orange-500 font-medium"
        : gap >= 5
        ? "text-yellow-600"
        : "text-gray-700";

    return <span className={colorClass}>{gap}회</span>;
  };

  const formatLastGap = (gap: number | null) => {
    if (gap === null) {
      return <span className="text-gray-400 text-xs">데이터 부족</span>;
    }
    return <span className="text-gray-600">{gap}회</span>;
  };

  return (
    <div className="overflow-x-auto">
      <table className="table-auto text-sm border w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left">번호</th>
            <th className="px-3 py-2 text-left">
              <div>간격 패턴</div>
              <div className="text-xs font-normal text-gray-500">
                (최근 3회)
              </div>
            </th>
            <th className="px-3 py-2 text-left">
              <div>패턴 빈도</div>
              <div className="text-xs font-normal text-gray-500">(범위 내)</div>
            </th>
            <th className="px-3 py-2 text-left">
              <div>현재 미출현</div>
              <div className="text-xs font-normal text-gray-500">
                (마지막 출현 후)
              </div>
            </th>
            <th className="px-3 py-2 text-left">
              <div>직전 간격</div>
              <div className="text-xs font-normal text-gray-500">
                (이전 출현 간)
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.num}
              className="border-t hover:bg-gray-50 transition-colors"
            >
              <td className="px-3 py-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-semibold">
                  {row.num}
                </span>
              </td>
              <td className="px-3 py-2">{formatPattern(row.latestPattern)}</td>
              <td className="px-3 py-2">
                {formatSample(row.latestPattern, row.sampleCount)}
              </td>
              <td className="px-3 py-2">{formatCurrentGap(row.currentGap)}</td>
              <td className="px-3 py-2">{formatLastGap(row.lastGap)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 p-3 bg-blue-50 rounded text-xs text-gray-700">
        <p className="font-semibold mb-2">📊 컬럼 설명</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>
            <strong>간격 패턴</strong>: S(≤5회), M(6-10회), L(11-20회),
            XL(21회+)
          </li>
          <li>
            <strong>패턴 빈도</strong>: 해당 패턴이 조회 범위 내에서 출현한 횟수
          </li>
          <li>
            <strong>현재 미출현</strong>: 마지막 출현 후 경과 회차 (0 = 현재
            출현)
          </li>
          <li>
            <strong>직전 간격</strong>: 마지막 두 출현 사이의 간격
          </li>
        </ul>
      </div>
    </div>
  );
}
