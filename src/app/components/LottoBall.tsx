"use client";

import { getBallColor } from "../utils/getBallColor";
import { useProfile } from "@/app/context/profileContext";
import clsx from "clsx";

type LottoBallProps = {
  number: number;
  className?: string;
  isSelected?: boolean;
  isNext?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  pulse?: boolean;
  noBounce?: boolean;
  highlightMax?: boolean; // 최대 빈도 테두리
  highlightMin?: boolean; // 최소 빈도 테두리
  showPrefBadge?: boolean;
};

export default function LottoBall({
  number,
  className,
  isSelected = false,
  isNext = false,
  size,
  pulse = false,
  noBounce = false,
  highlightMax = false,
  highlightMin = false,
  showPrefBadge = true,
}: LottoBallProps) {
  const { profile } = useProfile();
  const favoriteNumbers = profile?.favoriteNumbers ?? [];
  const avoidNumbers = profile?.avoidNumbers ?? [];
  const isFavorite = showPrefBadge && favoriteNumbers.includes(number);
  const isAvoid = showPrefBadge && avoidNumbers.includes(number);
  const baseClasses =
    "relative flex items-center justify-center text-white font-semibold rounded-full transition-transform";

  const legacySizeClasses = clsx(
    isNext
      ? "w-4 h-4 text-[11px] sm:w-6 sm:h-6 sm:text-sm"
      : "w-7 h-7 text-[11px] sm:w-9 sm:h-9 sm:text-sm",
  );

  const newSizeClasses = size
    ? clsx({
        "w-4 h-4 text-[10px] sm:w-5 sm:h-5 sm:text-[11px]": size === "xs",
        "w-5 h-5 text-xs sm:w-6 sm:h-6 sm:text-sm": size === "sm",
        "w-7 h-7 text-sm sm:w-9 sm:h-9": size === "md",
        "w-9 h-9 text-base sm:w-11 sm:h-11": size === "lg",
      })
    : "";

  const pulseSummary = pulse && !noBounce ? "animate-bounce" : "";
  const pulseClasses =
    (highlightMax || highlightMin) && !noBounce ? "animate-bounce" : "";

  const effectClasses = isSelected
    ? `scale-105${noBounce ? "" : " animate-bounce"} shadow-[0_0_10px_4px_rgba(255,255,0,0.7)]`
    : "scale-90";

  // ⭐ max/min 강조 테두리
  // const highlightClasses = clsx({
  //   "ring-4 ring-red-500": highlightMax,
  //   "ring-4 ring-blue-500": highlightMin,
  // });
  // const highlightClasses = clsx({
  //   "shadow-xl shadow-red-500": highlightMax,
  //   "shadow-xl shadow-blue-500": highlightMin,
  // });
  const highlightClasses = clsx({
    // 최대 빈도 → 밝은 황금빛 glow
    "shadow-[0_0_0_3px_rgba(255,0,0,0.1),0_0_12px_6px_rgba(255,0,0,1)]":
      highlightMax,

    // 최소 빈도 → 밝은 하늘색 glow
    "shadow-[0_0_0_3px_rgba(0,0,255,0.1),0_0_12px_6px_rgba(0,0,255,1)]":
      highlightMin,
  });
  // const preferenceClasses = clsx({
  //   "ring-2 ring-rose-300": isFavorite,
  //   "ring-2 ring-blue-300": isAvoid,
  // });

  return (
    <div
      className={clsx(
        baseClasses,
        legacySizeClasses,
        newSizeClasses,
        effectClasses,
        pulseSummary,
        pulseClasses,
        highlightClasses,
        // preferenceClasses,
        getBallColor(number),
        className,
      )}
    >
      {number}
      {isFavorite && (
        <span className="absolute -top-2 -right-2 text-[15px]">⭐</span>
      )}
      {isAvoid && (
        <span className="absolute -top-2 -right-2 text-[15px]">🚫</span>
      )}
    </div>
  );
}
