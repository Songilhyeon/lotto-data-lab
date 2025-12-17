"use client";

import { useAuth } from "@/app/context/authContext";

interface LockOverlayProps {
  height?: string | number; // Tailwind h-* 문자열 또는 px 숫자 가능
}

function LockOverlay({ height = "h-80" }: LockOverlayProps) {
  const { openLoginModal } = useAuth();

  // Tailwind 문자열(h-80 등)일 때
  const heightClass = typeof height === "string" ? height : undefined;

  // 숫자(px)일 때
  const heightStyle =
    typeof height === "number" ? { height: `${height}px` } : undefined;

  return (
    <div
      className={`
        pointer-events-none
        absolute inset-x-0 bottom-[-10]
        ${heightClass ?? ""}
        bg-gradient-to-r
        from-white
        via-white/60
        to-transparent
        backdrop-blur-[2px]
      `}
      style={heightStyle}
    >
      <div className="absolute inset-x-0 bottom-40 flex justify-center pointer-events-auto">
        <button
          onClick={openLoginModal}
          className="
            px-4 py-1.5
            bg-white/90
            rounded-full
            shadow-md
            text-base
            font-medium
            hover:bg-gray-100
            active:bg-gray-200
            transition
          "
        >
          🔒 로그인하고 전체 보기
        </button>
      </div>
    </div>
  );
}

export default LockOverlay;
