import { X } from "lucide-react";
import PickNumberGrid from "./PickNumberGrid";
import { usePickNumber, maxSelect } from "@/app/context/pickNumberContext";

export default function NumberPickerPanel() {
  const { picked, isOpen, toggleNumber, resetPicked, closePanel } =
    usePickNumber();

  if (!isOpen) return null;

  return (
    <>
      {/* 🔥 Overlay (외부 클릭 영역) */}
      <div className="fixed inset-0 z-40" onClick={closePanel} />

      {/* 패널 */}
      <div
        className="
          fixed bottom-24 right-6 z-50
          bg-white rounded-2xl shadow-xl p-4
          w-[320px]
          max-h-[70vh] overflow-y-auto
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold">
            내 번호 메모
            <span className="ml-2 text-xs text-gray-500">
              {picked.length}/{maxSelect}
            </span>
          </h3>

          <button
            onClick={closePanel}
            className="p-1 rounded hover:bg-gray-100"
          >
            <X size={16} />
          </button>
        </div>

        <PickNumberGrid
          selectedNumbers={picked}
          onToggle={toggleNumber}
          onReset={resetPicked}
          max={maxSelect}
        />
      </div>
    </>
  );
}
