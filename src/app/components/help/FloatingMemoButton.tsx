"use client";

import { useState } from "react";
import { X } from "lucide-react";

const storageKey = "lotto.quickMemo";

export default function FloatingMemoButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [memo, setMemo] = useState(() => {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem(storageKey) ?? "";
  });
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const closePanel = () => setIsOpen(false);
  const handleSave = () => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(storageKey, memo);
    setSavedAt(new Date().toLocaleTimeString("ko-KR", { hour12: false }));
  };

  const handleDelete = () => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(storageKey);
    setMemo("");
    setSavedAt(null);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="
          fixed top-35 right-6 z-50
          w-10 h-10 rounded-full
          bg-amber-500 text-white text-lg
          shadow-lg hover:scale-105 transition
        "
        title="내 전략 메모"
      >
        📝
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={closePanel} />

          <div
            className="
              fixed top-24 right-6 z-50
              bg-white rounded-2xl shadow-xl p-4
              w-[320px]
              max-h-[70vh] overflow-y-auto
            "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold">내 전략 메모</h3>
              <button
                onClick={closePanel}
                className="p-1 rounded hover:bg-gray-100"
                aria-label="닫기"
              >
                <X size={16} />
              </button>
            </div>

            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="w-full min-h-[180px] rounded-lg border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="나의 전략을 간략히 기록해 놓으세요"
            />

            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
              <span>
                {savedAt ? `마지막 저장 ${savedAt}` : "저장 전입니다."}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="text-gray-500 hover:text-gray-700"
                >
                  삭제
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="text-amber-600 hover:text-amber-700"
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
