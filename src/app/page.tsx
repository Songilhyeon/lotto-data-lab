import Hero from "./components/landing/Hero";
import ChartPreviewWrapper from "./components/landing/ChartPreviewWrapper";
import HowItWorks from "./components/landing/HowItWorks";
import HomeDashboardSummary from "./components/landing/HomeDashboardSummary";
import NextRoundPreviewWrapper from "./components/landing/NextRoundPreviewWrapper";

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

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* SEO용 H1 */}
      <h1 className="sr-only">
        로또 번호 분석과 통계, AI 분석, 1,2등 당첨 업체 정보를 제공하는 Lotto
        Data Lab
      </h1>

      {/* Hero: Client Component */}
      <Hero />

      {/* ⭐ 대시보드 요약 섹션 */}
      <HomeDashboardSummary />

      {/* 📊 과거 통계 미리보기 */}
      {/* <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid gap-8 md:grid-cols-2"> */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid gap-8 md:grid-cols-2 min-w-0">
        <ChartPreviewWrapper />

        {/* 🔮 다음 회차 분석 요약 */}
        <NextRoundPreviewWrapper />
      </section>

      {/* HowItWorks: Client Component */}
      <HowItWorks />
    </div>
  );
}
