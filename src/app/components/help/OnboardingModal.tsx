"use client";

import { useEffect, useMemo, useState } from "react";

type Step = { title: string; desc: string };

export default function OnboardingModal({
  storageKey = "nexlab_onboarding_v1",
}: {
  storageKey?: string;
}) {
  const steps: Step[] = useMemo(
    () => [
      {
        title: "분석",
        desc: "회차 패턴(구간/홀짝/합계/연속)을 빠르게 확인해 주세요.",
      },
      {
        title: "AI 점수 분석",
        desc: "점수 상위 번호 흐름을 참고해 후보를 좁혀보세요.",
      },
      {
        title: "조건 검색(고급)",
        desc: "전략이 있다면 조건으로 걸러 “다음 회차 흐름”을 검증해보세요.",
      },
      {
        title: "내 번호 메모(🎯)",
        desc: "후보 번호를 저장해두면 비교가 훨씬 편합니다.",
      },
    ],
    []
  );

  // ✅ 첫 렌더(서버/클라 공통)는 항상 렌더 안 함
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    setMounted(true);

    // ✅ 마운트 이후에만 localStorage 접근 → hydration mismatch 방지
    try {
      const seen = window.localStorage.getItem(storageKey);
      if (!seen) {
        // 다음 프레임에 열어서 렌더 타이밍도 더 안정적으로
        requestAnimationFrame(() => setOpen(true));
      }
    } catch {}
  }, [storageKey]);

  // ESC 닫기
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeForever();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const closeForever = () => {
    setOpen(false);
    try {
      window.localStorage.setItem(storageKey, "1");
    } catch {}
  };

  const next = () => {
    if (idx >= steps.length - 1) closeForever();
    else setIdx((v) => v + 1);
  };

  const prev = () => setIdx((v) => Math.max(0, v - 1));

  // ✅ 마운트 전엔 아무것도 렌더하지 않음(서버/클라 동일)
  if (!mounted) return null;
  if (!open) return null;

  const step = steps[idx];

  return (
    <div className="fixed inset-0 z-[9999]">
      <div className="absolute inset-0 bg-black/50" onClick={closeForever} />

      <div className="absolute left-1/2 top-1/2 w-[420px] max-w-[calc(100vw-40px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <div className="font-black text-gray-900">처음 오신 분께</div>
          <button
            onClick={closeForever}
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            닫기
          </button>
        </div>

        <div className="px-5 py-5 space-y-3">
          <div className="text-xs text-gray-500">
            {idx + 1} / {steps.length}
          </div>

          <div className="text-lg font-black text-gray-900">{step.title}</div>
          <div className="text-sm text-gray-700 leading-relaxed">
            {step.desc}
          </div>

          <div className="rounded-xl bg-gray-50 border border-gray-200 p-3 text-xs text-gray-600">
            ※ 통계 기반 참고 자료이며, 당첨을 보장하지 않습니다.
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={prev}
              disabled={idx === 0}
              className="text-sm text-gray-500 disabled:opacity-40 hover:text-gray-900"
            >
              이전
            </button>

            <div className="flex gap-2">
              <button
                onClick={closeForever}
                className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
              >
                다시 보지 않기
              </button>
              <button
                onClick={next}
                className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm hover:opacity-95"
              >
                {idx === steps.length - 1 ? "시작하기" : "다음"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
