import ComponentHeader from "@/app/components/ComponentHeader";
import HistoryClient from "./HistoryClient";
import SeoJsonLd from "@/app/components/SeoJsonLd";
import CollapsibleDoc from "@/app/components/CollapsibleDoc";
import Link from "next/link";

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
    url: "https://app.nexlab.ai.kr/lotto-history",
    siteName: "Lotto Data Lab",
    type: "website",
  },
  alternates: { canonical: "https://app.nexlab.ai.kr/lotto-history" },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://app.nexlab.ai.kr/lotto-history#webpage",
        url: "https://app.nexlab.ai.kr/lotto-history",
        name: "로또 역대 기록 순위 | Nexlab",
        inLanguage: "ko-KR",
        description:
          "당첨금/당첨자 수/판매액 기준으로 로또 역대 기록을 순위로 정리하는 페이지.",
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
            name: "역대 기록",
            item: "https://app.nexlab.ai.kr/lotto-history",
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "어떤 기준으로 순위를 보여주나요?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "당첨금, 당첨자 수, 판매액 같은 대표 지표를 기준으로 역대 기록을 정리합니다.",
            },
          },
          {
            "@type": "Question",
            name: "이 페이지는 예측과 관련 있나요?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "예측보다는 기록과 비교에 초점이 있습니다. 과거 최고/특이 기록을 빠르게 확인하는 용도입니다.",
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="px-4 sm:px-6 pt-4 pb-10">
      <ComponentHeader
        title="로또 역대 기록 순위 분석"
        content="당첨금·당첨자 수·판매액 기준으로 분석한 로또 역대 최고 기록을 확인할 수 있습니다."
        srOnly={true}
      />

      <p className="sr-only">
        이 페이지에서는 로또 역대 회차 데이터를 기반으로 당첨금, 당첨자 수,
        판매액 기준 최고 기록을 순위 형태로 분석합니다.
      </p>

      <HistoryClient />

      <CollapsibleDoc
        title="/lotto-history 가이드 · 역대 기록으로 흐름 비교"
        subtitle="당첨금/당첨자/판매액 같은 ‘기록’ 관점에서 보는 방법"
        defaultOpen={false}
        variant="history"
      >
        <div className="rounded-xl border border-gray-200 bg-white/70 p-3">
          <div className="font-black text-gray-900">이 페이지를 보는 이유</div>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>역대 최고 당첨금/당첨자 수 회차를 빠르게 확인</li>
            <li>특이 회차가 어떤 맥락에서 나왔는지 기록으로 참고</li>
            <li>분석/AI 점수 페이지에서 만든 메모를 과거 기록과 비교</li>
          </ul>
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
            href="/winner-stores"
            className="rounded-xl border border-gray-200 bg-white/70 p-3 hover:bg-white"
          >
            <div className="font-black text-gray-900">
              1·2등 판매점 <span className="text-gray-400">·</span>{" "}
              <span className="text-xs text-gray-400">/winner-stores</span>
            </div>
            <div className="mt-1 text-sm text-gray-700">
              지역/검색/누적 기준으로 당첨 판매점 탐색
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
