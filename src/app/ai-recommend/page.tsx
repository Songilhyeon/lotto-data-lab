import AiRecommendClient from "./AiRecommendClient";
import ComponentHeader from "@/app/components/ComponentHeader";

export const metadata = {
  title: "AI 기반 로또 번호 점수 분석",
  description:
    "AI가 데이터 기반으로 계산한 로또 번호 점수를 확인하세요. 패턴/빈도/클러스터 분석 등이 반영된 AI 추천 번호를 제공합니다.",
  openGraph: {
    title: "AI 기반 로또 번호 점수 분석",
    description:
      "AI가 데이터 기반으로 계산한 로또 번호 점수를 확인하세요. 패턴/빈도/클러스터 분석 등이 반영된 AI 추천 번호를 제공합니다.",
    url: "https://app.nexlab.ai.kr/ai-recommend",
    siteName: "Lotto Data Lab",
    type: "website",
  },
};

export default function Page() {
  return (
    <div className="px-4 sm:px-6 pt-4 pb-10">
      <ComponentHeader
        title="AI 기반 로또 번호 점수 분석"
        content="데이터 기반으로 계산된 AI 추천 번호와 패턴/빈도/클러스터 분석을 한눈에 확인하세요."
      />

      <AiRecommendClient />
    </div>
  );
}
