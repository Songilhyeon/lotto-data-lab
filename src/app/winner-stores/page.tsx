import WinnerStoresClient from "./WinnerStoresClient";
import ComponentHeader from "@/app/components/ComponentHeader";
import SeoJsonLd from "@/app/components/SeoJsonLd";
import CollapsibleDoc from "@/app/components/CollapsibleDoc";
import Link from "next/link";

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
  alternates: { canonical: "https://app.nexlab.ai.kr/winner-stores" },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://app.nexlab.ai.kr/winner-stores#webpage",
        url: "https://app.nexlab.ai.kr/winner-stores",
        name: "로또 1·2등 당첨 판매점 | Nexlab",
        inLanguage: "ko-KR",
        description:
          "전국 로또 1등·2등 당첨 판매점을 지역/검색/누적 기준으로 확인하는 페이지.",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "홈",
            item: "https://app.nexlab.ai.kr/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "1·2등 판매점",
            item: "https://app.nexlab.ai.kr/winner-stores",
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "이 페이지에서는 무엇을 볼 수 있나요?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "로또 1·2등 당첨 판매점을 지역/검색/누적 기준으로 확인하고, 회차별 당첨 이력을 탐색할 수 있습니다.",
            },
          },
          {
            "@type": "Question",
            name: "‘명당’은 어떻게 판단하나요?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "단순한 단정이 아니라, 누적 당첨 횟수와 지역 분포 같은 데이터를 기준으로 참고할 수 있게 제공합니다.",
            },
          },
        ],
      },
    ],
  };

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

      {/* ✅ 접힘 문서 + 내부링크 허브 */}
      <CollapsibleDoc
        title="/winner-stores 가이드 · 당첨 판매점 데이터 보기"
        subtitle="지역/검색/누적 기준으로 탐색하는 방법"
        defaultOpen={false}
        variant="winner"
      >
        <div className="rounded-xl border border-gray-200 bg-white/70 p-3">
          <div className="font-black text-gray-900">어떻게 보면 좋아?</div>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>
              회차별 당첨 판매점 메뉴에서 회차를 선택해 각 회차의 당첨 판매점
              정보를 확인 한다.
            </li>
            <li>
              판매점 누적 통계 메뉴에서 지역을 선택해 해당 지역의 판매점 통계를
              확인 한다.
            </li>
            <li>
              전체 판매점 메뉴에서 상호 또는 지역명을 검색해서 특정 판매점을
              찾는다
            </li>
            <li>
              각 판매점 카드안에 있는 타임라인 아이콘을 클릭하여 전체 당첨
              이력을 확인한다
            </li>
          </ol>
        </div>

        <div className="grid gap-2 md:grid-cols-2">
          <Link
            href="/analyze"
            className="rounded-xl border border-gray-200 bg-white/70 p-3 hover:bg-white"
          >
            <div className="font-black text-gray-900">
              회차별 분석 <span className="text-gray-400">·</span>{" "}
              <span className="text-xs text-gray-400">/analyze</span>
            </div>
            <div className="mt-1 text-sm text-gray-700">
              구간/홀짝/합/연속/일치/출현 패턴 분석
            </div>
          </Link>

          <Link
            href="/ai-recommend"
            className="rounded-xl border border-gray-200 bg-white/70 p-3 hover:bg-white"
          >
            <div className="font-black text-gray-900">
              AI 점수 분석 <span className="text-gray-400">·</span>{" "}
              <span className="text-xs text-gray-400">/ai-recommend</span>
            </div>
            <div className="mt-1 text-sm text-gray-700">
              빈도/패턴/다음회차 통계를 점수로 정렬
            </div>
          </Link>

          <Link
            href="/lotto-history"
            className="rounded-xl border border-gray-200 bg-white/70 p-3 hover:bg-white"
          >
            <div className="font-black text-gray-900">
              역대 기록 <span className="text-gray-400">·</span>{" "}
              <span className="text-xs text-gray-400">/lotto-history</span>
            </div>
            <div className="mt-1 text-sm text-gray-700">
              당첨금/당첨자/판매액 기준으로 기록 검색
            </div>
          </Link>

          <Link
            href="/"
            className="rounded-xl border border-gray-200 bg-white/70 p-3 hover:bg-white"
          >
            <div className="font-black text-gray-900">홈으로</div>
            <div className="mt-1 text-sm text-gray-700">
              전체 기능 안내/바로가기
            </div>
          </Link>
        </div>
      </CollapsibleDoc>

      <SeoJsonLd json={jsonLd} />
    </div>
  );
}
