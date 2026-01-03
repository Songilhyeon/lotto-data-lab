import Hero from "./components/landing/Hero";
import HomeDashboardSummary from "./components/landing/HomeDashboardSummary";
import NextRoundPreviewWrapper from "./components/landing/NextRoundPreviewWrapper";
import { getTodayInsight } from "@/app/lib/getTodayInsight";
import { getTodayInsightContext } from "@/app/lib/getTodayInsightContext";
import TodayInsightBanner from "@/app/components/landing/TodayInsightBanner";

export const metadata = {
  title: "로또 번호 분석·통계 | AI Lotto Data Lab",
  description:
    "로또 당첨 번호 통계, 패턴 분석, 1·2등 당첨 판매점 정보와 AI 기반 로또 번호 분석을 제공하는 데이터 분석 서비스입니다.",
  openGraph: {
    title: "로또 번호 분석·통계 | AI Lotto Data Lab",
    description:
      "로또 당첨 번호 통계, 패턴 분석, 1·2등 당첨 판매점 정보와 AI 기반 로또 번호 분석을 제공하는 데이터 분석 서비스입니다.",
    url: "https://app.nexlab.ai.kr",
    siteName: "Lotto Data Lab",
    type: "website",
  },
};

// ✅ async Server Component
export default async function LandingPage() {
  // ✅ 반드시 await
  const analysisContext = await getTodayInsightContext();
  const insight = getTodayInsight(analysisContext);

  return (
    <div className="min-h-screen flex flex-col">
      {/* SEO용 H1 */}
      <h1 className="sr-only">
        로또 번호 분석과 통계, AI 분석, 1,2등 당첨 업체 정보를 제공하는 Lotto
        Data Lab
      </h1>

      <p className="sr-only">
        Lotto Data Lab은 로또 당첨 번호 통계, 패턴 분석, AI 기반 번호 점수
        계산과 1·2등 당첨 판매점 데이터를 제공하는 데이터 분석 서비스입니다.
      </p>

      <Hero />

      {/* 👉 나중에 연결 */}
      <TodayInsightBanner insight={insight} />

      <HomeDashboardSummary />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid gap-8 md:grid-cols-2 min-w-0">
        <NextRoundPreviewWrapper />
      </section>
    </div>
  );
}
