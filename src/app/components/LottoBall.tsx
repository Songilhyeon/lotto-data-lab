// // components/LottoBall.tsx
// "use client";

// import { getBallColor } from "../utils/getBallColor";
// import clsx from "clsx";

// type LottoBallProps = {
//   number: number;
//   className?: string; // ← 추가됨 (부모 커스터마이징 가능)
//   isSelected?: boolean;
//   isNext?: boolean;
// };

// export default function LottoBall({
//   number,
//   className,
//   isSelected = false,
//   isNext = false,
// }: LottoBallProps) {
//   return (
//     <>
//       {isNext === true ? (
//         <div
//           className={clsx(
//             "flex items-center justify-center text-white font-semibold text-[11px] sm:text-sm rounded-full w-4 h-4 sm:w-6 sm:h-6",
//             getBallColor(number),
//             isSelected
//               ? "scale-120 animate-bounce shadow-[0_0_10px_4px_rgba(255,255,0,0.7)]"
//               : "scale-90",
//             className
//           )}
//         >
//           {number}
//         </div>
//       ) : (
//         <div
//           className={clsx(
//             "flex items-center justify-center text-white font-semibold text-[11px] sm:text-sm rounded-full w-7 h-7 sm:w-9 sm:h-9",
//             getBallColor(number),
//             isSelected
//               ? "scale-120 animate-bounce shadow-[0_0_10px_4px_rgba(255,255,0,0.7)]"
//               : "scale-90",
//             className
//           )}
//         >
//           {number}
//         </div>
//       )}
//     </>
//   );
// }
"use client";

import { getBallColor } from "../utils/getBallColor";
import clsx from "clsx";

type LottoBallProps = {
  number: number;
  className?: string; // 부모 커스터마이징 가능
  isSelected?: boolean;
  isNext?: boolean;
  size?: "small" | "medium" | "large" | "responsive"; // 새로운 prop
};

export default function LottoBall({
  number,
  className,
  isSelected = false,
  isNext = false,
  size = "medium",
}: LottoBallProps) {
  const baseClasses =
    "flex items-center justify-center text-white font-semibold rounded-full transition-transform";

  // 크기별 Tailwind 클래스
  const sizeClasses = clsx({
    // 고정 크기 옵션
    "w-5 h-5 text-xs sm:w-6 sm:h-6 sm:text-sm": size === "small",
    "w-7 h-7 text-[11px] sm:w-9 sm:h-9 sm:text-sm": size === "medium",
    "w-9 h-9 text-sm sm:w-11 sm:h-11 sm:text-base": size === "large",
    // 반응형 자동 크기
    "w-6 h-6 text-xs sm:w-7 sm:h-7 sm:text-sm md:w-8 md:h-8 md:text-base lg:w-9 lg:h-9 lg:text-base":
      size === "responsive",
  });

  // 선택 여부 & 다음 회차 강조
  const effectClasses = clsx({
    "scale-120 animate-bounce shadow-[0_0_10px_4px_rgba(255,255,0,0.7)]":
      isSelected,
    "scale-90": !isSelected && !isNext,
    "text-[11px] sm:text-sm scale-80": isNext,
  });

  return (
    <div
      className={clsx(
        baseClasses,
        sizeClasses,
        effectClasses,
        getBallColor(number),
        className
      )}
    >
      {number}
    </div>
  );
}
