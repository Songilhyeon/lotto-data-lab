"use client";

import { useEffect, useState } from "react";

export default function FloatingHelpButton() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      {/* 도움말 버튼 */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="
          fixed bottom-6 left-6 z-[9999]
          w-10 h-10 rounded-full
          bg-gray-900 text-white text-xl
          shadow-lg hover:scale-105 active:scale-95 transition
          flex items-center justify-center
        "
        title="사용법 보기"
        aria-label="사용법 보기"
      >
        ❔
      </button>

      {open && (
        <div className="fixed inset-0 z-[9998]">
          {/* 배경 */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          {/* 카드 */}
          <div
            className="
              absolute bottom-24 left-6
              w-[360px] max-w-[calc(100vw-48px)]
              rounded-2xl bg-white shadow-2xl border border-gray-200
              overflow-hidden
              max-h-[70vh]
              flex flex-col
            "
            role="dialog"
            aria-modal="true"
          >
            {/* 헤더 고정 */}
            <div className="shrink-0 bg-white border-b">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="font-black text-gray-900">서비스 사용 안내</div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  닫기
                </button>
              </div>
            </div>

            {/* ✅ 내용 스크롤 (핵심: flex-1 + min-h-0) */}
            <div className="flex-1 min-h-0 px-4 py-4 text-sm text-gray-700 space-y-4 overflow-y-auto">
              <p className="text-gray-700">
                로또 회차 데이터를 기반으로 <b>패턴과 흐름</b>을 분석해, 수동
                번호 선택에 참고하시도록 돕는 서비스입니다.
              </p>
              <div className="rounded-xl border border-gray-200 p-3 space-y-2">
                <div className="font-black text-gray-900">
                  🧷 화면 고정 기능
                </div>
                <p>
                  <b>🎯 번호 메모</b> : 우측 하단 버튼 → 번호 선택/해제 → 필요
                  시 초기화
                </p>
                <p>
                  <b>📝 빠른 메모</b> : 우측 상단 버튼 → 메모 작성 → 저장/삭제
                  선택
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 border border-gray-200 p-3">
                <div className="font-black text-gray-900">🎯 수동 초보자</div>
                <p className="mt-2">
                  <b>분석</b>의 기본 분석에서 회차 패턴 요약을 확인하신 뒤,
                  <b> AI 점수 분석</b>으로 점수 상위 흐름을 가볍게 참고해보세요.
                  각 메뉴 하단의 가이드를 열어 요약 정보를 확인해 보세요.
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 p-3">
                <div className="font-black text-gray-900">🧠 수동 고급자</div>
                <p className="mt-2">
                  <b>조건 기반 검색</b>으로 전략을 검증하실 수 있습니다. 조건을
                  만족한 회차들의 <b>“다음 회차 흐름”</b>까지 함께 확인해보세요.
                </p>
                <p className="mt-2 text-xs text-gray-600">
                  ※ 조건은 1~2개부터 시작하시고, 결과 회차 수(표본)가 충분한지
                  확인해 주세요.
                </p>
              </div>

              <div className="rounded-xl bg-indigo-50 border border-indigo-200 p-3 space-y-2">
                <div className="font-black text-indigo-900">
                  📌 조건 검색 프리셋
                </div>

                <div>
                  <b>1) 구간 균형형</b>
                  <p className="text-gray-700">
                    1~10 / 11~20 / 21~30 구간에서 각 1~2개
                  </p>
                </div>

                <div>
                  <b>2) 안정 조합형</b>
                  <p className="text-gray-700">홀짝 3:3 + 합계 100~160</p>
                </div>

                <div>
                  <b>3) 제외 전략형</b>
                  <p className="text-gray-700">
                    최근 1~2회 연속 출현 번호 1~2개 제외
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 p-3 space-y-2">
                <div className="font-black text-gray-900">
                  📂 메인 메뉴 안내
                </div>
                <p>
                  <b>분석</b> : 회차 패턴/흐름 요약
                </p>
                <p>
                  <b>AI 점수 분석</b> : 번호별 점수 흐름 참고
                </p>
                <p>
                  <b>1·2등 판매점</b> : 당첨 판매점 정보
                </p>
                <p>
                  <b>역대 기록</b> : 최고·최저 당첨금 등 기록
                </p>
                <p>
                  <b>게시판</b> : 의견 공유/전략 토론
                </p>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed">
                ※ 통계 기반 참고 자료이며, 당첨을 보장하지 않습니다.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
