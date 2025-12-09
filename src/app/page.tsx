"use client";

import { useEffect } from "react";
import Hero from "./components/landing/Hero";
import FeatureCards from "./components/landing/FeatureCards";
import ChartPreview from "./components/landing/ChartPreview";
import HowItWorks from "./components/landing/HowItWorks";
import { apiUrl } from "./utils/getUtils";

export default function LandingPage() {
  useEffect(() => {
    // 페이지 방문 시 한 번만 호출
    fetch(`${apiUrl}/visit`)
      .then((res) => res.json())
      .then((data) => console.log("->", data.totalVisits))
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Hero />
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          주요 기능 & 미리보기
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <FeatureCards />
          <ChartPreview />
        </div>
      </section>
      <HowItWorks />
    </div>
  );
}
