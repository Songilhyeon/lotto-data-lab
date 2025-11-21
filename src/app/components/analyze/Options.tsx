import React from "react";

interface Props {
  numDraws: number;
  setNumDraws: (n: number) => void;
  sortMode: "default" | "odd" | "even";
  setSortMode: (v: "default" | "odd" | "even") => void;
  includeBonus: boolean;
  setIncludeBonus: (b: boolean) => void;
}

export default function Options({
  numDraws,
  setNumDraws,
  sortMode,
  setSortMode,
  includeBonus,
  setIncludeBonus,
}: Props) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <label className="flex items-center gap-2">
        최근 N회:
        <select
          className="border rounded px-2 py-1"
          value={numDraws}
          onChange={(e) => setNumDraws(parseInt(e.target.value))}
        >
          {[5, 10, 20, 50, 100].map((n) => (
            <option key={n} value={n}>
              {n}회
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2">
        회차 정렬:
        <select
          className="border rounded px-2 py-1"
          value={sortMode}
          onChange={(e) =>
            setSortMode(e.target.value as "default" | "odd" | "even")
          }
        >
          <option value="default">기본(회차 번호)</option>
          <option value="odd">홀수가 많은 순</option>
          <option value="even">짝수가 많은 순</option>
        </select>
      </label>

      <label className="flex items-center gap-2">
        보너스 포함:
        <input
          type="checkbox"
          checked={includeBonus}
          onChange={(e) => setIncludeBonus(e.target.checked)}
          className="w-5 h-5"
        />
      </label>
    </div>
  );
}
