// components/LottoBall.tsx
"use client";

import { getBallColor } from "../utils/getBallColor";
import clsx from "clsx";

type LottoBallProps = {
  number: number;
  className?: string; // ← 추가됨 (부모 커스터마이징 가능)
};

export default function LottoBall({ number, className }: LottoBallProps) {
  return (
    <div
      className={clsx(
        `
        flex items-center justify-center 
        ${getBallColor(number)} 
        text-white font-semibold 
        text-[11px] sm:text-sm 
        rounded-full 
        w-7 h-7 sm:w-9 sm:h-9 
        shadow-md
      `,
        className
      )}
    >
      {number}
    </div>
  );
}
