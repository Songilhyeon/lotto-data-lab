"use client";

import { usePickNumber } from "@/app/context/pickNumberContext";
import NumberPickerPanel from "./NumberPickerPanel";

export default function FloatingPickButton() {
  const { isOpen, openPanel, closePanel } = usePickNumber();

  return (
    <>
      {/* 🔵 원형 버튼 */}
      <button
        onClick={isOpen ? closePanel : openPanel}
        className="
          fixed bottom-5 right-6 z-50
          w-10 h-10 rounded-full
          bg-indigo-600 text-white text-xl
          shadow-lg hover:scale-105 transition
        "
        title="내 번호 메모"
      >
        🎯
      </button>

      {/* 패널 */}
      {isOpen && <NumberPickerPanel />}
    </>
  );
}
