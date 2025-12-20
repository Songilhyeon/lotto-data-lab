// app/winner-stores/page.tsx
import WinnerStoresClient from "./WinnerStoresClient";
import ComponentHeader from "@/app/components/ComponentHeader";

export const metadata = {
  title: "1·2등 로또 당첨 판매점 목록",
  description:
    "전국 1등·2등 로또 당첨 판매점 정보를 확인하세요. 누적 당첨 횟수, 지역별 분포, 당첨 이력 통계가 제공됩니다.",
  openGraph: {
    title: "1·2등 로또 당첨 판매점 목록",
    description:
      "전국 1등·2등 로또 당첨 판매점 정보를 확인하세요. 누적 당첨 횟수, 지역별 분포, 당첨 이력 통계가 제공됩니다.",
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
        content="전국 1·2등 로또 당첨 판매점 정보를 누적 횟수, 지역별 통계와 함께 확인할 수 있습니다."
        srOnly={true}
      />

      <WinnerStoresClient />
    </div>
  );
}
