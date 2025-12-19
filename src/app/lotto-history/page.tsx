import ComponentHeader from "@/app/components/ComponentHeader";
import HistoryClient from "./HistoryClient";

export const metadata = {
  title: "로또 역대 기록 순위 분석",
  description:
    "당첨자 수·당첨금·판매액 기준으로 로또 역대 기록을 순위 형태로 분석한 페이지입니다.",
};

export default function Page() {
  return (
    <div className="p-4">
      {/* SEO에 최적화된 H1 + 설명 */}
      <ComponentHeader
        title="로또 역대 기록 순위 분석"
        content="당첨자 수·당첨금·판매액 기준 TOP 기록을 확인하세요."
      />
      {/* Client Component */}
      <HistoryClient />
    </div>
  );
}
