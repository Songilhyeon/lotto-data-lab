"use client";

import { useState, useEffect } from "react";
import { apiUrl, getLatestRound } from "@/app/utils/getUtils";
import { useAuth } from "@/app/context/authContext";

interface TossPaymentsWindow extends Window {
  TossPayments?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    requestPayment: (method: string, options: any) => void;
  };
}

export default function PremiumPage() {
  const { user, openLoginModal } = useAuth();
  const currentRound = getLatestRound();

  const [trendText, setTrendText] = useState<string>(
    "AI 분석 데이터를 불러오는 중..."
  );
  const [loading, setLoading] = useState(true);
  const [recommended, setRecommended] = useState<number[]>([]);

  // AI 추천 데이터 fetch
  useEffect(() => {
    const fetchAIData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${apiUrl}/lotto/premium/recommend?round=${currentRound}`
        );
        const data = await res.json();
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
      } finally {
        setLoading(false);
      }
    };

    fetchAIData();
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

  return (
    <div className="min-h-screen bg-linear-to-b from-indigo-50 to-white text-gray-900">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-indigo-700">
              당신만의 전략, AI가 완성합니다
            </h2>
            <p className="mt-4 text-gray-700 text-lg">
              과거 회차 데이터를 AI가 분석하여 번호 추천과 패턴 점수를
              제공합니다. 더 이상 랜덤 선택은 그만, 데이터 기반 선택으로 전략을
              완성하세요.
            </p>

            {/* 특징 리스트 */}
            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  title: "AI 번호 점수",
                  desc: "과거 데이터를 기반으로 각 번호별 출현 가능성을 점수로 제공합니다.",
                },
                {
                  title: "다음 회차 분석 점수",
                  desc: "이전 회차 → 다음 회차 연관성을 분석해 번호 간 관계 점수를 확인할 수 있습니다.",
                },
                {
                  title: "패턴 점수 안내",
                  desc: "번호별 출현 가능성을 점수 형태로 안내하여, 선택 참고용 데이터를 제공합니다.",
                },
                {
                  title: "고급 데이터 분석",
                  desc: "홀짝 균형, 끝수 분포 등 번호 패턴을 직관적인 점수로 확인 가능합니다.",
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
                    <div className="font-semibold text-gray-900">
                      {item.title}
                    </div>
                    <div className="text-sm text-gray-500">{item.desc}</div>
                  </div>
                </li>
              ))}
            </ul>

            {/* 구독 버튼 */}
            <div className="mt-10 flex gap-3">
              <button
                onClick={() => handleSubscribe("monthly")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg font-semibold hover:from-indigo-700 hover:to-purple-700"
              >
                월간 프리미엄 시작
              </button>
              <button
                onClick={() => handleSubscribe("annual")}
                className="inline-flex items-center gap-2 px-6 py-3 border rounded-xl hover:bg-gray-100 font-semibold"
              >
                연간 할인 보기
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
                  <strong>추천 번호:</strong> {recommended.join(", ")}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
