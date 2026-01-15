"use client";

import { getBallColor } from "@/app/utils/getBallColor";
import clsx from "clsx";
import { RotateCcw } from "lucide-react";

type PickNumberGridProps = {
  selectedNumbers: number[];
  onToggle: (num: number) => void;
  onReset?: () => void;
  max?: number;
};

export default function PickNumberGrid({
  selectedNumbers,
  onToggle,
  onReset,
  max = 10,
}: PickNumberGridProps) {
  return (
    <div className="space-y-2">
      {/* 🔝 리셋 헤더 (있을 때만 렌더) */}
      {onReset && selectedNumbers.length > 0 && (
        <div className="flex justify-end px-1">
          <button
            onClick={onReset}
            className="
              flex items-center gap-1
              text-xs text-gray-400 hover:text-red-500
              transition
            "
            title="초기화"
          >
            리셋
            <RotateCcw size={14} />
          </button>
        </div>
      )}

      {/* 번호 그리드 */}
      <div className="overflow-x-hidden">
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 45 }, (_, i) => i + 1).map((num) => {
            const isSelected = selectedNumbers.includes(num);
            const isDisabled = !isSelected && selectedNumbers.length >= max;

            return (
              <button
                key={num}
                type="button"
                disabled={isDisabled}
                onClick={() => onToggle(num)}
                className={clsx(
                  "h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-semibold transition",
                  isSelected
                    ? `${getBallColor(num)} text-white scale-110`
                    : "bg-white text-gray-700 border border-gray-200",
                  isDisabled && "opacity-40 cursor-not-allowed"
                )}
              >
                {num}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
