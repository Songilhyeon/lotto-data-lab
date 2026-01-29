import { Lock, X } from "lucide-react";
import PickNumberGrid from "./PickNumberGrid";
import { usePickNumber, maxSelect } from "@/app/context/pickNumberContext";
import { RotateCcw, Save } from "lucide-react";
import useAuthGuard from "@/app/hooks/useAuthGuard";

export default function NumberPickerPanel() {
  const {
    picked,
    isOpen,
    toggleNumber,
    resetPicked,
    savePicked,
    hasUnsavedChanges,
    closePanel,
  } = usePickNumber();
  usePickNumber();
  const { isAuthed } = useAuthGuard();

  if (!isOpen) return null;

  return (
    <>
      {/* 🔥 Overlay (외부 클릭 영역) */}
      {/* <div className="fixed inset-0 z-40" onClick={closePanel} /> */}

      {/* 패널 */}
      <div
        className="
          fixed bottom-15 right-6 z-50
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

          {/* 🔝 리셋 헤더 (있을 때만 렌더) */}
          <div className="flex items-center justify-end gap-2 px-1">
            {resetPicked && picked.length > 0 && (
              <button
                onClick={resetPicked}
                className="
              flex items-center gap-1
              text-xs text-gray-400 hover:text-red-500
              transition
            "
                title="초기화"
              >
                리셋
                <RotateCcw size={10} />
              </button>
            )}
            <button
              onClick={savePicked}
              disabled={!hasUnsavedChanges}
              className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700 disabled:opacity-40"
              title="저장"
            >
              저장
              <Save size={10} />
            </button>
          </div>

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
          // onReset={resetPicked}
          max={maxSelect}
        />

        {isAuthed && hasUnsavedChanges && (
          <div className="mt-2 text-xs text-indigo-500">
            변경사항이 있어요. 저장을 눌러 반영하세요.
          </div>
        )}

        {!isAuthed && (
          <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            <div className="flex items-center gap-2 font-semibold">
              <Lock size={14} />
              로그인하지 않으면 현재 기기에만 저장됩니다.
            </div>
          </div>
        )}
      </div>
    </>
  );
}
