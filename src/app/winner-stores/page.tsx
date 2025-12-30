import WinnerStoresClient from "./WinnerStoresClient";
import ComponentHeader from "@/app/components/ComponentHeader";

export const metadata = {
  title: "로또 1·2등 당첨 판매점 | 지역별·누적 횟수 한눈에",
  description:
    "전국 로또 1등·2등 당첨 판매점을 지역별로 확인하세요. 누적 당첨 횟수, 회차별 당첨 이력, 지역 분포 통계를 한눈에 제공합니다.",
  keywords: [
    "로또 당첨 판매점",
    "로또 1등 판매점",
    "로또 2등 판매점",
    "로또 명당",
    "지역별 로또 판매점",
    "로또 당첨 이력",
  ],
  openGraph: {
    title: "로또 1·2등 당첨 판매점 | 지역별·누적 횟수 한눈에",
    description:
      "전국 로또 1등·2등 당첨 판매점을 지역별로 확인하세요. 누적 당첨 횟수와 당첨 이력을 데이터 기반으로 제공합니다.",
    url: "https://app.nexlab.ai.kr/winner-stores",
    siteName: "Lotto Data Lab",
    type: "website",
  },
};

export default function Page() {
  return (
    <div className="px-4 sm:px-6 pt-4 pb-10">
      <ComponentHeader
        title="1·2등 로또 당첨 판매점 목록"
        content="전국 로또 1·2등 당첨 판매점을 지역별 통계와 누적 당첨 횟수 기준으로 확인할 수 있습니다."
        srOnly={true}
      />

      {/* 🔍 SEO용 문맥 보강 (스크린리더 전용) */}
      <p className="sr-only">
        이 페이지에서는 전국 로또 1등·2등 당첨 판매점의 누적 당첨 횟수, 지역별
        분포, 회차별 당첨 이력을 데이터 기반으로 제공합니다.
      </p>

      <WinnerStoresClient />
    </div>
  );
}
