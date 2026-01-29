"use client";

import { useEffect, useState } from "react";
import { Lock, X } from "lucide-react";
import useAuthGuard from "@/app/hooks/useAuthGuard";
import { apiUrl } from "@/app/utils/getUtils";
import { useProfile } from "@/app/context/profileContext";

export default function FloatingMemoButton() {
  const { isAuthed } = useAuthGuard();
  const { profile, refreshProfile } = useProfile();
  const [isOpen, setIsOpen] = useState(false);
  const [memo, setMemo] = useState("");
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthed) {
      if (typeof window !== "undefined") {
        setMemo(window.localStorage.getItem("lotto.quickMemo") ?? "");
      } else {
        setMemo("");
      }
      setSavedAt(null);
      return;
    }
    const localMemo =
      typeof window !== "undefined"
        ? (window.localStorage.getItem("lotto.quickMemo") ?? "")
        : "";
    const serverMemo = profile?.strategyMemo ?? "";

    if (!serverMemo && localMemo) {
      setMemo(localMemo);
      setSavedAt(null);
      return;
    }

    setMemo(serverMemo);
  }, [isAuthed, profile?.strategyMemo]);

  const closePanel = () => setIsOpen(false);
  const handleSave = async () => {
    if (!isAuthed) {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("lotto.quickMemo", memo);
      }
      setSavedAt(new Date().toLocaleTimeString("ko-KR", { hour12: false }));
      return;
    }
    if (saving) return;
    setSaving(true);
    try {
      const res = await fetch(`${apiUrl}/auth/profile`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ strategyMemo: memo }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "저장에 실패했습니다.");
      }
      setSavedAt(new Date().toLocaleTimeString("ko-KR", { hour12: false }));
      await refreshProfile();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isAuthed) {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("lotto.quickMemo");
      }
      setMemo("");
      setSavedAt(null);
      return;
    }
    if (saving) return;
    setSaving(true);
    try {
      const res = await fetch(`${apiUrl}/auth/profile`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ strategyMemo: "" }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "삭제에 실패했습니다.");
      }
      setMemo("");
      setSavedAt(null);
      await refreshProfile();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="
          fixed top-25 right-6 z-50
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
          {/* <div className="fixed inset-0 z-40" onClick={closePanel} /> */}

          <div
            className="
              fixed top-35 right-6 z-50
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
                  className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  disabled={saving}
                >
                  {saving ? "저장 중..." : "삭제"}
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="text-amber-600 hover:text-amber-700 disabled:opacity-50"
                  disabled={saving}
                >
                  {saving ? "저장 중..." : "저장"}
                </button>
              </div>
            </div>

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
      )}
    </>
  );
}
