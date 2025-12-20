import Hero from "./components/landing/Hero";
import FeatureCards from "./components/landing/FeatureCards";
import ChartPreview from "./components/landing/ChartPreview";
import HowItWorks from "./components/landing/HowItWorks";

export const metadata = {
  title: "로또 번호 분석 · 통계 · AI 분석 서비스 | Lotto Data Lab",
  description:
    "로또 당첨 번호 통계, 패턴 분석, 1·2등 당첨 판매점 정보와 AI 기반 로또 번호 분석을 제공하는 데이터 분석 서비스입니다.",
  openGraph: {
    title: "로또 번호 분석 · 통계 · AI 분석 서비스 | Lotto Data Lab",
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

      {/* 주요 기능 & 미리보기 */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8 sm:mb-12">
          주요 기능 & 미리보기
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
          {/* FeatureCards & ChartPreview: Client Component */}
          <FeatureCards />
          <ChartPreview />
        </div>
      </section>

      {/* HowItWorks: Client Component */}
      <HowItWorks />
    </div>
  );
}
