import ComponentHeader from "@/app/components/ComponentHeader";
import HistoryClient from "./HistoryClient";

export const metadata = {
  title: "로또 역대 기록 순위 | 당첨금·당첨자 수 TOP 분석",
  description:
    "역대 로또 회차 중 당첨금, 당첨자 수, 판매액 기준 최고 기록을 순위로 분석합니다. 데이터 기반으로 로또 역사적 기록을 한눈에 확인하세요.",
  keywords: [
    "로또 역대 기록",
    "로또 최고 당첨금",
    "로또 당첨자 수 순위",
    "로또 판매액 순위",
    "로또 통계",
    "로또 데이터 분석",
  ],
  openGraph: {
    title: "로또 역대 기록 순위 | 당첨금·당첨자 수 TOP 분석",
    description:
      "당첨금·당첨자 수·판매액 기준으로 분석한 로또 역대 최고 기록을 순위로 확인하세요.",
    url: "https://app.nexlab.ai.kr/history",
    siteName: "Lotto Data Lab",
    type: "website",
  },
};

export default function Page() {
  return (
    <div className="px-4 sm:px-6 pt-4 pb-10">
      {/* 🔑 SEO 핵심 H1 (스크린리더 노출) */}
      <ComponentHeader
        title="로또 역대 기록 순위 분석"
        content="당첨금·당첨자 수·판매액 기준으로 분석한 로또 역대 최고 기록을 확인할 수 있습니다."
        srOnly={true}
      />

      {/* 🔍 검색 엔진 문맥 보강 */}
      <p className="sr-only">
        이 페이지에서는 로또 역대 회차 데이터를 기반으로 당첨금, 당첨자 수,
        판매액 기준 최고 기록을 순위 형태로 분석합니다. 모든 정보는 공식 로또
        데이터를 기반으로 제공됩니다.
      </p>

      {/* Client Component */}
      <HistoryClient />
    </div>
  );
}
