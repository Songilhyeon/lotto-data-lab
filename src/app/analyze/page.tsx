import { Suspense } from "react";
import AnalyzeClient from "./AnalyzeClient";
import ComponentHeader from "@/app/components/ComponentHeader";

export const metadata = {
  title: "로또 번호 분석 & 패턴 통계",
  description:
    "역대 로또 번호의 흐름, 패턴, 추세 분석을 제공하는 페이지입니다. 번호 출현 빈도, 변동 패턴을 직관적으로 확인하세요.",
  openGraph: {
    title: "로또 번호 분석 & 패턴 통계",
    description:
      "역대 로또 번호의 흐름, 패턴, 추세 분석을 제공하는 페이지입니다. 번호 출현 빈도, 변동 패턴을 직관적으로 확인하세요.",
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
        content="역대 로또 번호의 흐름, 패턴, 추세 분석을 직관적으로 확인할 수 있습니다."
        srOnly={true}
      />

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
