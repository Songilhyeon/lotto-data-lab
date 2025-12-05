// // // components/LottoBall.tsx
// // "use client";

// // import { getBallColor } from "../utils/getBallColor";
// // import clsx from "clsx";

// // type LottoBallProps = {
// //   number: number;
// //   className?: string; // ← 추가됨 (부모 커스터마이징 가능)
// //   isSelected?: boolean;
// //   isNext?: boolean;
// // };

// // export default function LottoBall({
// //   number,
// //   className,
// //   isSelected = false,
// //   isNext = false,
// // }: LottoBallProps) {
// //   return (
// //     <>
// //       {isNext === true ? (
// //         <div
// //           className={clsx(
// //             "flex items-center justify-center text-white font-semibold text-[11px] sm:text-sm rounded-full w-4 h-4 sm:w-6 sm:h-6",
// //             getBallColor(number),
// //             isSelected
// //               ? "scale-120 animate-bounce shadow-[0_0_10px_4px_rgba(255,255,0,0.7)]"
// //               : "scale-90",
// //             className
// //           )}
// //         >
// //           {number}
// //         </div>
// //       ) : (
// //         <div
// //           className={clsx(
// //             "flex items-center justify-center text-white font-semibold text-[11px] sm:text-sm rounded-full w-7 h-7 sm:w-9 sm:h-9",
// //             getBallColor(number),
// //             isSelected
// //               ? "scale-120 animate-bounce shadow-[0_0_10px_4px_rgba(255,255,0,0.7)]"
// //               : "scale-90",
// //             className
// //           )}
// //         >
// //           {number}
// //         </div>
// //       )}
// //     </>
// //   );
// // }
// "use client";

// import { getBallColor } from "../utils/getBallColor";
// import clsx from "clsx";

// type LottoBallProps = {
//   number: number;
//   className?: string;
//   isSelected?: boolean;
//   isNext?: boolean;
//   size?: "sm" | "md" | "lg"; // ← 새로 추가된 옵션
//   pulse?: boolean; // ← 새 옵션
// };

// export default function LottoBall({
//   number,
//   className,
//   isSelected = false,
//   isNext = false,
//   size,
//   pulse = false,
// }: LottoBallProps) {
//   const baseClasses =
//     "flex items-center justify-center text-white font-semibold rounded-full transition-transform";

//   /**
//    * 기존 디자인: size 값이 없으면 원래 크기 그대로 유지
//    */
//   const legacySizeClasses = clsx(
//     isNext
//       ? "w-4 h-4 text-[11px] sm:w-6 sm:h-6 sm:text-sm"
//       : "w-7 h-7 text-[11px] sm:w-9 sm:h-9 sm:text-sm"
//   );

//   /**
//    * 새 디자인: size 옵션이 있을 때만 적용됨
//    * 기존 코드 절대 덮어쓰지 않음!
//    */
//   const newSizeClasses = size
//     ? clsx({
//         "w-5 h-5 text-xs sm:w-6 sm:h-6 sm:text-sm": size === "sm",
//         "w-7 h-7 text-sm sm:w-9 sm:h-9": size === "md",
//         "w-9 h-9 text-base sm:w-11 sm:h-11": size === "lg",
//       })
//     : "";

//   /**
//    * pulse 옵션이 있을 때만 적용
//    */
//   const pulseClasses = pulse ? "animate-pulse" : "";

//   /**
//    * 선택 효과 (기존 유지)
//    */
//   const effectClasses = isSelected
//     ? "scale-120 animate-bounce shadow-[0_0_10px_4px_rgba(255,255,0,0.7)]"
//     : "scale-90";

//   return (
//     <div
//       className={clsx(
//         baseClasses,
//         legacySizeClasses,
//         newSizeClasses, // ← size 있을 때만 override
//         effectClasses,
//         pulseClasses,
//         getBallColor(number),
//         className
//       )}
//     >
//       {number}
//     </div>
//   );
// }

"use client";

import { getBallColor } from "../utils/getBallColor";
import clsx from "clsx";

type LottoBallProps = {
  number: number;
  className?: string;
  isSelected?: boolean;
  isNext?: boolean;
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
  highlightMax?: boolean; // 최대 빈도 테두리
  highlightMin?: boolean; // 최소 빈도 테두리
};

export default function LottoBall({
  number,
  className,
  isSelected = false,
  isNext = false,
  size,
  pulse = false,
  highlightMax = false,
  highlightMin = false,
}: LottoBallProps) {
  const baseClasses =
    "flex items-center justify-center text-white font-semibold rounded-full transition-transform";

  const legacySizeClasses = clsx(
    isNext
      ? "w-4 h-4 text-[11px] sm:w-6 sm:h-6 sm:text-sm"
      : "w-7 h-7 text-[11px] sm:w-9 sm:h-9 sm:text-sm"
  );

  const newSizeClasses = size
    ? clsx({
        "w-5 h-5 text-xs sm:w-6 sm:h-6 sm:text-sm": size === "sm",
        "w-7 h-7 text-sm sm:w-9 sm:h-9": size === "md",
        "w-9 h-9 text-base sm:w-11 sm:h-11": size === "lg",
      })
    : "";

  const pulseClasses = pulse ? "animate-pulse" : "";

  const effectClasses = isSelected
    ? "scale-120 animate-bounce shadow-[0_0_10px_4px_rgba(255,255,0,0.7)]"
    : "scale-90";

  // ⭐ max/min 강조 테두리
  const highlightClasses = clsx({
    "ring-4 ring-red-500": highlightMax,
    "ring-4 ring-blue-500": highlightMin,
  });

  return (
    <div
      className={clsx(
        baseClasses,
        legacySizeClasses,
        newSizeClasses,
        effectClasses,
        pulseClasses,
        highlightClasses,
        getBallColor(number),
        className
      )}
    >
      {number}
    </div>
  );
}
