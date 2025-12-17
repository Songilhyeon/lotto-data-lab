"use client";

import { useAuth } from "@/app/context/authContext";

function LockOverlay() {
  const { openLoginModal } = useAuth();

  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      {/* 🔒 완전 가림 영역 (하단) */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-white" />

      {/* 🌫 그라데이션 영역 */}
      {/* <div
        className="
          absolute inset-0
          bg-gradient-to-r
          from-white/99
          via-white/90
          to-transparent
        "
      /> */}
      {/* 🌫 블러 오버레이 */}
      <div
        className="
    absolute inset-0
    bg-white/40
    backdrop-blur-sm
  "
      />

      {/* 🔘 로그인 버튼 */}
      <div className="absolute inset-x-0 bottom-0 flex justify-center pointer-events-auto">
        <button
          onClick={openLoginModal}
          className="
            px-4 py-2
            bg-white
            rounded-full
            shadow-lg
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
