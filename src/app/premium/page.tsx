"use client";

import { useState, useEffect, useRef } from "react";
import { apiUrl, getLatestRound } from "@/app/utils/getUtils";
import { useAuth } from "@/app/context/authContext";

interface TossPaymentsWindow extends Window {
  TossPayments?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    requestPayment: (method: string, options: any) => void;
  };
}

let lastPremiumFetchAt = 0;
let lastPremiumFetchKey = "";

export default function PremiumPage() {
  const { user, openLoginModal, refreshUser } = useAuth();
  const currentRound = getLatestRound();

  const [trendText, setTrendText] = useState<string>(
    "AI 분석 데이터를 불러오는 중..."
  );
  const [loading, setLoading] = useState(true);
  const [recommended, setRecommended] = useState<number[]>([]);
  const [trialLoading, setTrialLoading] = useState(false);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // AI 분석 점수 데이터 fetch
  useEffect(() => {
    let cancelled = false;

    const fetchAIData = async (attempt: number) => {
      const now = Date.now();
      const requestKey = String(currentRound);
      if (
        lastPremiumFetchKey === requestKey &&
        now - lastPremiumFetchAt < 2000
      ) {
        const waitMs = 2000 - (now - lastPremiumFetchAt);
        setTrendText("잠시 후 다시 시도합니다.");
        setLoading(true);
        if (retryTimerRef.current) {
          clearTimeout(retryTimerRef.current);
          retryTimerRef.current = null;
        }
        retryTimerRef.current = setTimeout(() => {
          if (!cancelled) fetchAIData(attempt);
        }, waitMs);
        return;
      }
      lastPremiumFetchKey = requestKey;
      lastPremiumFetchAt = now;

      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }

      setLoading(true);
      setTrendText("AI 분석 데이터를 불러오는 중...");
      setRecommended([]); // ✅ 이전값 제거

      try {
        const res = await fetch(
          `${apiUrl}/lotto/premium/recommend?round=${currentRound}&ts=${Date.now()}`,
          { cache: "no-store" }
        );
        const data = await res.json();

        if (data.ok === false) {
          if (
            attempt < 1 &&
            typeof data.message === "string" &&
            data.message.includes("요청이 너무 빠릅니다")
          ) {
            setTrendText(`${data.message} (잠시 후 자동 재시도)`);
            setRecommended([]); // ✅ 모순 방지
            setLoading(false);
            retryTimerRef.current = setTimeout(() => {
              if (!cancelled) fetchAIData(attempt + 1);
            }, 2200);
            return;
          }

          setTrendText(data.message);
          setRecommended([]); // ✅ 모순 방지
          return;
        }

        const nums = data.result?.recommended ?? [];
        setRecommended(nums);

        if (nums.length === 0) {
          setTrendText("이번 회차 데이터 분석 중...");
        } else {
          const oddCount = nums.filter((n: number) => n % 2 === 1).length;
          const lastDigitCount = nums.filter((n: number) => n % 10 >= 5).length;
          const oddRatio = oddCount / nums.length;
          const patternSimilarity = Math.round(
            (1 - Math.abs(0.5 - oddRatio)) * 100
          );

          setTrendText(
            `홀수 ${oddCount}개, 끝수 5~9: ${lastDigitCount}개, 패턴 유사도 약 ${patternSimilarity}%`
          );
        }
      } catch (err) {
        console.error(err);
        setTrendText("AI 분석 데이터를 불러오는 데 실패했습니다.");
        setRecommended([]); // ✅ 실패 시도 모순 방지
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAIData(0);

    return () => {
      cancelled = true;
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
    };
  }, [currentRound]);

  // 로그인 체크
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-700 text-lg">
          로그인이 필요합니다.{" "}
          <button
            className="text-indigo-600 font-semibold"
            onClick={openLoginModal}
          >
            로그인하기
          </button>
        </p>
      </div>
    );
  }

  // Toss 결제
  const handleSubscribe = async (plan: "monthly" | "annual") => {
    try {
      const res = await fetch("/api/toss/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();

      if (!data.success) {
        alert("결제 세션 생성 실패");
        return;
      }

      const tossWindow = window as TossPaymentsWindow;
      tossWindow.TossPayments?.requestPayment("카드", {
        amount: data.amount,
        orderId: data.orderId,
        orderName: data.orderName,
        customerName: user.name,
        successUrl: `${window.location.origin}/premium/success`,
        failUrl: `${window.location.origin}/premium/fail`,
      });
    } catch (err) {
      console.error(err);
      alert("결제 중 오류가 발생했습니다.");
    }
  };

  const isPremiumActive =
    user?.role === "PREMIUM" &&
    user.subscriptionExpiresAt &&
    new Date(user.subscriptionExpiresAt) > new Date();
  const hasUsedTrial = user?.trialUsed;

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
        alert(data.message || "무료 체험 시작에 실패했습니다.");
        return;
      }

      await refreshUser();
      alert("무료 1개월 이용이 시작되었습니다.");
    } catch (err) {
      console.error(err);
      alert("무료 체험 시작 중 오류가 발생했습니다.");
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
              프리미엄 안내
            </h2>
            <p className="mt-4 text-gray-700 text-lg">
              프리미엄 전용 분석 탭과 심층 점수 모델로 전략을 더 정밀하게
              다듬어보세요. 월 3,900원으로 더 깊은 분석을 사용할 수 있습니다.
            </p>

            {/* 구독 버튼 */}
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => handleSubscribe("monthly")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg font-semibold hover:from-indigo-700 hover:to-purple-700"
              >
                월 3,900원으로 시작
              </button>
              <button
                onClick={handleStartFreeTrial}
                disabled={trialLoading || !!isPremiumActive || !!hasUsedTrial}
                className="inline-flex items-center gap-2 px-6 py-3 border border-indigo-200 text-indigo-700 rounded-xl font-semibold hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPremiumActive
                  ? "프리미엄 이용 중"
                  : hasUsedTrial
                  ? "무료 체험 사용 완료"
                  : "무료 1개월 체험"}
              </button>
            </div>
          </div>

          {/* Trend Box */}
          <div className="order-first lg:order-last">
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-indigo-50">
              <div className="text-sm font-bold text-gray-700">
                이번 주 핵심 분석 포인트
              </div>
              <div className="mt-2 text-xs text-gray-600">
                {loading ? "분석 중..." : trendText}
              </div>
              {!loading && recommended.length > 0 && (
                <div className="mt-4 p-4 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-100 shadow-sm text-sm">
                  <strong>분석 점수 TOP6 번호:</strong> {recommended.join(", ")}
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
                title: "출현 간격 분석",
                desc: "번호 출현 간격 분포를 확인하고 구간별 패턴을 비교합니다.",
              },
              {
                title: "번호 간격 분석",
                desc: "회차별 간격 패턴 유사도를 바탕으로 다음 회차 흐름을 봅니다.",
              },
              {
                title: "통합 분석",
                desc: "빈도, 패턴, 흐름을 묶어 요약하고 다음 회차 인사이트를 제공합니다.",
              },
              {
                title: "조건 기반 분석",
                desc: "구간, 합, 홀짝 등 조건을 조합해 다음 회차 빈도를 확인합니다.",
              },
              {
                title: "심층 점수 모델",
                desc: "7가지 피처 가중치를 조절해 고급 점수 모델을 직접 튜닝합니다.",
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
                  <li>기본 분석 탭 이용</li>
                  <li>기본/다음 회차/전략 모델</li>
                </ul>
              </div>
              <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
                <div className="text-indigo-700 font-semibold">프리미엄</div>
                <ul className="mt-2 text-indigo-700/90 space-y-1">
                  <li>출현 간격·번호 간격·통합 분석</li>
                  <li>조건 기반 분석 + 심층 점수 모델</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-gray-900">상세 플랜 비교</div>
              <div className="text-xs text-gray-500">VAT 포함</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="rounded-xl border border-gray-200 p-4">
                <div className="text-gray-700 font-semibold">무료</div>
                <div className="mt-1 text-xs text-gray-500">0원</div>
                <ul className="mt-3 text-gray-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>기본 분석 탭</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>기본/다음 회차/전략 모델</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400">✕</span>
                    <span>프리미엄 분석 탭</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400">✕</span>
                    <span>심층 점수 모델</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
                <div className="text-indigo-700 font-semibold">
                  프리미엄 월간
                </div>
                <div className="mt-1 text-sm font-semibold text-indigo-700">
                  월 3,900원
                </div>
                <ul className="mt-3 text-indigo-700/90 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600">✓</span>
                    <span>출현 간격·번호 간격·통합 분석</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600">✓</span>
                    <span>조건 기반 분석 + 심층 점수 모델</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600">✓</span>
                    <span>프리미엄 전용 요약/인사이트</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <div className="text-amber-700 font-semibold">
                  프리미엄 연간
                </div>
                <div className="mt-1 text-sm font-semibold text-amber-700">
                  연간 할인
                </div>
                <ul className="mt-3 text-amber-700/90 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">✓</span>
                    <span>월간 포함 모든 기능</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">✓</span>
                    <span>연간 요금제 할인 적용</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">✓</span>
                    <span>장기 구독자 전용 혜택</span>
                  </li>
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
                  직접 조합하고 확인하는 수동 분석 흐름
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  원하는 기준으로 조건 구성
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 p-4">
                <div className="text-xs text-gray-500">의사결정</div>
                <div className="mt-1 text-gray-900 font-semibold">
                  점수·빈도·패턴을 한 화면에서 비교
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  나만의 패턴을 빠르게 검증
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
