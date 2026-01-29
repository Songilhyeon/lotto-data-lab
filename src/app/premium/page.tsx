"use client";

import { useState } from "react";
import { apiUrl } from "@/app/utils/getUtils";
import { isPremiumRole, useAuth } from "@/app/context/authContext";

export default function PremiumPage() {
  const { user, openLoginModal, refreshUser } = useAuth();
  const [trialLoading, setTrialLoading] = useState(false);

  const isPremiumActive =
    user?.role === "ADMIN"
      ? true
      : isPremiumRole(user?.role) &&
        user.subscriptionExpiresAt &&
        new Date(user.subscriptionExpiresAt) > new Date();
  const hasUsedTrial = user?.trialUsed;
  const trialEndsAt =
    hasUsedTrial && user?.subscriptionExpiresAt
      ? new Date(user.subscriptionExpiresAt)
      : null;
  const formattedTrialEndsAt = trialEndsAt
    ? new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(trialEndsAt)
    : null;

  const handleStartFreeTrial = async () => {
    if (!user) {
      openLoginModal();
      return;
    }

    setTrialLoading(true);
    try {
      const res = await fetch(`${apiUrl}/subscription/free`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok || data.success !== true) {
        alert(data.message || "무료 이용 시작에 실패했습니다.");
        return;
      }

      await refreshUser();
      alert("무료 1개월 사용이 시작되었습니다.");
    } catch (err) {
      console.error(err);
      alert("무료 이용 시작 중 오류가 발생했습니다.");
    } finally {
      setTrialLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white text-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-10 items-start">
          <div>
            <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-indigo-700">
              수동 분석을 위한 프리미엄
            </h2>
            <p className="mt-4 text-gray-700 text-lg">
              내 전략이 실제로 맞았는지 확인하는 <b>수동 분석 도구</b>입니다.
              조건을 만들고 다음회차 분포로 검증하세요.{" "}
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-900 ring-1 ring-amber-200">
                🎁 무료 1개월 이용 가능
              </span>
            </p>

            {/* 구독 버튼 */}
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={handleStartFreeTrial}
                disabled={trialLoading || !!isPremiumActive || !!hasUsedTrial}
                className="inline-flex items-center gap-3 px-7 py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 shadow-[0_12px_30px_-16px_rgba(245,158,11,0.9)] ring-2 ring-amber-200 hover:from-amber-500 hover:via-orange-500 hover:to-amber-600 hover:shadow-[0_16px_36px_-16px_rgba(245,158,11,1)] active:scale-[0.98] transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPremiumActive
                  ? "프리미엄 이용 중"
                  : hasUsedTrial
                    ? "무료 이용 완료"
                    : "1개월 무료 이용 시작"}
              </button>
              {!isPremiumActive && !hasUsedTrial && (
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                  결제 없이 1개월 무료 이용이 시작됩니다
                </div>
              )}
              {formattedTrialEndsAt && (
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-900 ring-1 ring-amber-200">
                  ⏳ 무료 이용 종료일: {formattedTrialEndsAt}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mt-10 space-y-6">
          {/* 특징 리스트 */}
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: "조건 기반 분석",
                desc: "구간/홀짝/합/포함·제외 조건을 조합하고 매칭 회차 + 다음회차 분포를 확인합니다.",
              },
              {
                title: "통합 분석",
                desc: "기준 회차를 중심으로 빈도/패턴/일치 기반 다음회차 흐름을 한 화면에 요약합니다.",
              },
              {
                title: "출현 간격 분석",
                desc: "번호 간격 패턴을 구간으로 요약하고 다음회차 후보 흐름을 점수로 확인합니다.",
              },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="shrink-0 mt-1 bg-indigo-100 rounded-full p-2">
                  <svg
                    className="w-5 h-5 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4"
                    />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2 font-semibold text-gray-900">
                    <span>{item.title}</span>
                    <span className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      프리미엄 전용
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">{item.desc}</div>
                </div>
              </li>
            ))}
          </ul>

          <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm p-5">
            <div className="font-semibold text-gray-900 mb-3">
              무료 vs 프리미엄 간단 비교
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-gray-200 p-4">
                <div className="text-gray-700 font-semibold">무료</div>
                <ul className="mt-2 text-gray-600 space-y-1">
                  <li>기본 패턴 탐색과 회차 비교</li>
                  <li>번호 실험실로 후보 검증</li>
                  <li>AI 점수 4종 참고용 제공</li>
                </ul>
              </div>
              <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
                <div className="text-indigo-700 font-semibold">프리미엄</div>
                <ul className="mt-2 text-indigo-700/90 space-y-1">
                  <li>조건 기반 분석으로 정밀 필터링</li>
                  <li>출현 간격 패턴으로 근거 강화</li>
                  <li>통합 분석으로 한 화면 요약</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <div className="font-semibold text-gray-900 mb-3">
              직접 패턴을 찾는 사람을 위한 프리미엄
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="rounded-xl border border-gray-200 p-4">
                <div className="text-xs text-gray-500">분석 깊이</div>
                <div className="mt-1 text-gray-900 font-semibold">
                  구간·간격·조건을 묶어 패턴을 좁혀갑니다
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  여러 기준을 동시에 비교
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 p-4">
                <div className="text-xs text-gray-500">탐색 방식</div>
                <div className="mt-1 text-gray-900 font-semibold">
                  조건을 만들고 매칭 회차를 즉시 확인
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  내 가설을 근거로 검증
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 p-4">
                <div className="text-xs text-gray-500">의사결정</div>
                <div className="mt-1 text-gray-900 font-semibold">
                  다음회차 분포로 판단을 보조
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  패턴의 유효성을 빠르게 체크
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
