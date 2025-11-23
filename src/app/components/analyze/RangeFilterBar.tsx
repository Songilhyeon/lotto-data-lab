"use client";

interface RangeFilterBarProps {
  start: number;
  end: number;
  latest: number;
  includeBonus?: boolean; // optional
  setStart: (v: number) => void;
  setEnd: (v: number) => void;
  setIncludeBonus?: (v: boolean) => void; // optional
  onRecentSelect: (count: number) => void;
  showCheckBox?: boolean; // optional
}

export default function RangeFilterBar({
  start,
  end,
  latest,
  includeBonus = true,
  setStart,
  setEnd,
  setIncludeBonus,
  onRecentSelect,
  showCheckBox = true,
}: RangeFilterBarProps) {
  return (
    <div className="flex flex-wrap gap-4 items-end mb-6">
      {/* Start 회차 */}
      <div className="w-full sm:w-auto">
        <label className="block text-sm text-gray-700 mb-1">Start 회차</label>
        <input
          type="number"
          value={start}
          min={1}
          max={latest}
          onChange={(e) => setStart(Number(e.target.value))}
          onBlur={() => {
            if (start < 1) setStart(1);
            else if (start > latest) setStart(latest);
            else if (start > end) setStart(end);
          }}
          className="px-3 py-2 border rounded-md w-full md:w-32"
        />
      </div>

      {/* End 회차 */}
      <div className="w-full sm:w-auto">
        <label className="block text-sm text-gray-700 mb-1">End 회차</label>
        <input
          type="number"
          value={end}
          min={1}
          max={latest}
          onChange={(e) => setEnd(Number(e.target.value))}
          onBlur={() => {
            if (end < 1) setEnd(1);
            else if (end > latest) setEnd(latest);
            else if (end < start) setEnd(start);
          }}
          className="px-3 py-2 border rounded-md w-full sm:w-32"
        />
      </div>

      {/* 보너스 포함 체크 */}
      {showCheckBox &&
        includeBonus !== undefined &&
        setIncludeBonus !== undefined && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="checkbox"
              id="includeBonus"
              checked={includeBonus}
              onChange={(e) => setIncludeBonus(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="includeBonus" className="text-sm text-gray-700">
              보너스 번호 포함
            </label>
          </div>
        )}

      {/* 최근 버튼들 */}
      <div className="flex flex-wrap gap-2 w-full sm:w-auto">
        {[10, 20, 50, 100, latest].map((n) => {
          const label = n === latest ? "전체" : `최근 ${n}개`;
          const isActive = n === end - start + 1; // 선택 상태에 따라 조정 가능
          return (
            <button
              key={n}
              onClick={() => onRecentSelect(n)}
              className={`
          px-4 py-2 rounded-lg text-sm font-semibold
          transition transform
          ${
            isActive
              ? "bg-blue-500 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-blue-100"
          }
          active:scale-95
        `}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
