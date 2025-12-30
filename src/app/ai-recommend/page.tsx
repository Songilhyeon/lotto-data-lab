import AiRecommendClient from "./AiRecommendClient";
import ComponentHeader from "@/app/components/ComponentHeader";
// import RequireAuth from "@/app/components/RequireAuth";

export const metadata = {
  title: "AI 로또 번호 분석 | 점수 계산·패턴·빈도 기반 분석",
  description:
    "AI가 과거 로또 데이터를 기반으로 번호별 점수를 계산합니다. 패턴, 출현 빈도, 클러스터 분석이 반영된 데이터 기반 AI 로또 분석을 확인하세요.",
  keywords: [
    "AI 로또 번호 분석",
    "로또 번호 점수",
    "AI 로또 점수 분석",
    "로또 패턴 분석",
    "로또 출현 빈도",
    "로또 데이터 분석",
  ],
  openGraph: {
    title: "AI 로또 번호 분석 | 데이터 기반 점수 계산",
    description:
      "과거 로또 데이터를 학습한 AI가 번호별 점수를 계산합니다. 패턴·빈도·클러스터 분석이 반영된 AI 로또 분석 서비스.",
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
        content="AI가 과거 로또 데이터를 학습하여 번호별 점수를 계산하고, 패턴·빈도·클러스터 분석 결과를 제공합니다."
        srOnly={true}
      />

      <p className="sr-only">
        이 페이지에서는 AI 알고리즘이 과거 로또 회차 데이터를 기반으로 번호별
        점수를 계산하며, 출현 빈도, 패턴 흐름, 클러스터 특성을 종합적으로
        분석합니다.
      </p>

      {/* <RequireAuth> */}
      <AiRecommendClient />
      {/* </RequireAuth> */}
    </div>
  );
}
