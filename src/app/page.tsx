import Hero from "./components/landing/Hero";
import FeatureCards from "./components/landing/FeatureCards";
import ChartPreview from "./components/landing/ChartPreview";
import HowItWorks from "./components/landing/HowItWorks";

export const metadata = {
  title: "로또 데이터 분석 서비스 — 홈",
  description:
    "Lotto Data Lab: 데이터 기반 로또 분석 플랫폼. 번호 등장 통계, 패턴 분석, AI 점수 분석을 한 곳에서 확인하세요.",
  openGraph: {
    title: "로또 데이터 분석 서비스 — 홈",
    description:
      "Lotto Data Lab: 데이터 기반 로또 분석 플랫폼. 번호 등장 통계, 패턴 분석, AI 점수 분석을 한 곳에서 확인하세요.",
    url: "https://app.nexlab.ai.kr",
    siteName: "Lotto Data Lab",
    type: "website",
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
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
