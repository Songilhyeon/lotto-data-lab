import { Suspense } from "react";
import AnalyzeClient from "./AnalyzeClient";
import ComponentHeader from "@/app/components/ComponentHeader";

export const metadata = {
  title: "로또 번호 분석 | 패턴·출현 빈도·AI 통계 분석",
  description:
    "역대 로또 번호 데이터를 기반으로 출현 빈도, 패턴, 구간 흐름을 분석합니다. AI 통계 분석으로 다음 회차 전략을 세워보세요.",
  keywords: [
    "로또 번호 분석",
    "로또 패턴 분석",
    "로또 출현 빈도",
    "로또 통계",
    "AI 로또 분석",
    "로또 번호 데이터",
  ],
  openGraph: {
    title: "로또 번호 분석 | 패턴·출현 빈도·AI 통계",
    description:
      "역대 로또 번호의 패턴과 출현 빈도를 데이터 기반으로 분석합니다. AI 통계로 흐름을 직관적으로 확인하세요.",
    url: "https://app.nexlab.ai.kr/analyze",
    siteName: "Lotto Data Lab",
    type: "website",
  },
};

export default function Page() {
  return (
    <div className="px-4 sm:px-6 pt-4 pb-10">
      <ComponentHeader
        title="로또 번호 분석 & 패턴 통계"
        content="역대 로또 번호 데이터를 기반으로 출현 빈도, 패턴 흐름, AI 통계 분석을 제공합니다."
        srOnly={true}
      />

      <p className="sr-only">
        본 페이지에서는 로또 번호의 출현 빈도, 회차별 패턴, 번호 간 간격, 통계적
        흐름을 AI 기반으로 분석하여 다음 회차 전략 수립에 도움을 줍니다.
      </p>

      {/* 🔑 핵심 수정 포인트 */}
      <Suspense
        fallback={
          <div className="py-6 text-sm text-gray-500">
            분석 데이터 로딩 중...
          </div>
        }
      >
        <AnalyzeClient />
      </Suspense>
    </div>
  );
}
