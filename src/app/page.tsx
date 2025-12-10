"use client";

import Hero from "./components/landing/Hero";
import FeatureCards from "./components/landing/FeatureCards";
import ChartPreview from "./components/landing/ChartPreview";
import HowItWorks from "./components/landing/HowItWorks";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Hero />

      {/* 주요 기능 섹션 */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8 sm:mb-12">
          주요 기능 & 미리보기
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
          <FeatureCards />
          <ChartPreview />
        </div>
      </section>

      <HowItWorks />
    </div>
  );
}
