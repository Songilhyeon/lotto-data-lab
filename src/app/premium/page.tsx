"use client";

import { useState, useEffect } from "react";
import { apiUrl, getLatestRound } from "@/app/utils/getUtils";

export default function PremiumPage() {
  const currentRound = getLatestRound();
  const [trendText, setTrendText] = useState<string>(
    "AI 분석 데이터를 불러오는 중..."
  );
  const [loading, setLoading] = useState(true);

  const handleSubscribe = (plan: "monthly" | "annual") => {
    alert(`구독 플랜 선택: ${plan}`);
  };

  useEffect(() => {
    const fetchAIData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${apiUrl}/lotto/premium/recommend?round=${currentRound}`
        );
        const data = await res.json();
        const recommended = data.result?.recommended ?? [];
        if (recommended.length === 0) {
          setTrendText("이번 회차 데이터 분석 중...");
        } else {
          const oddCount = recommended.filter(
            (n: number) => n % 2 === 1
          ).length;
          const lastDigitCount = recommended.filter(
            (n: number) => n % 10 >= 5
          ).length;
          const oddRatio = oddCount / recommended.length;
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

  return (
    <div className="min-h-screen bg-linear-to-b from-indigo-50 to-white text-gray-900">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-indigo-700">
              로또 AI 프리미엄 분석
            </h2>
            <p className="mt-4 text-gray-700 text-lg">
              과거 데이터와 번호 연관성을 기반으로 AI가 추세를 분석해
              추천합니다.
            </p>

            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  title: "AI 추천 번호",
                  desc: "과거 데이터를 기반으로 가장 가능성 높은 번호를 추천합니다.",
                },
                {
                  title: "다음 회차 기반 추천",
                  desc: "이전 회차 → 다음 회차 연관성을 분석해 번호 간 관계까지 고려한 추천.",
                },
                {
                  title: "패턴 점수 안내",
                  desc: "번호별 출현 가능성을 점수 형태로 안내하여, 선택 참고 가능.",
                },
                {
                  title: "고급 데이터 분석",
                  desc: "홀짝 균형, 끝수 분포 등 번호 패턴을 직관적으로 확인 가능.",
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

            <div className="mt-10 flex gap-3">
              <button
                onClick={() => handleSubscribe("monthly")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 font-semibold"
              >
                월간 구독하기
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
              <div className="mt-4 p-4 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-100 shadow-sm text-sm">
                AI 분석 기반 추천과 패턴 점수를 참고하여, 번호 선택 전략을
                직관적으로 확인할 수 있습니다.
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
