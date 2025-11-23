// components/LottoBall.tsx
"use client";

import { getBallColor } from "../utils/getBallColor";
import clsx from "clsx";

type LottoBallProps = {
  number: number;
  className?: string; // ← 추가됨 (부모 커스터마이징 가능)
  isSelected?: boolean;
};

export default function LottoBall({
  number,
  className,
  isSelected = false,
}: LottoBallProps) {
  return (
    <div
      className={clsx(
        "flex items-center justify-center text-white font-semibold text-[11px] sm:text-sm rounded-full w-7 h-7 sm:w-9 sm:h-9",
        getBallColor(number),
        isSelected
          ? "scale-120 animate-bounce shadow-[0_0_10px_4px_rgba(255,255,0,0.7)]"
          : "scale-90",
        className
      )}
    >
      {number}
    </div>
  );
}
