"use client";

import { useAuth } from "@/app/context/authContext";

function LockOverlay() {
  const { openLoginModal } = useAuth();

  return (
    <div
      className="
        pointer-events-none
        absolute inset-x-0 bottom-0
        h-60
        bg-gradient-to-t
        from-white
        via-white/70
        to-transparent
        backdrop-blur-[2px]
      "
    >
      <div className="absolute inset-x-0 bottom-4 flex justify-center pointer-events-auto">
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
