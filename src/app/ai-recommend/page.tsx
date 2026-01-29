import AiRecommendClient from "./AiRecommendClient";
import ComponentHeader from "@/app/components/ComponentHeader";
import SeoJsonLd from "@/app/components/SeoJsonLd";
import CollapsibleDoc from "@/app/components/CollapsibleDoc";
import Link from "next/link";
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
  alternates: { canonical: "https://app.nexlab.ai.kr/ai-recommend" },
};
const aiRecommendTabIds = [
  "AiRecommend",
  "AiNextRecommend",
  "AiVariantRecommend",
  "AiAdvancedRecommend",
] as const;

type AiRecommendTabId = (typeof aiRecommendTabIds)[number];

const aiRecommendTabDocs: Record<
  AiRecommendTabId,
  {
    title: string;
    subtitle: string;
    summary: string;
    points: string[];
    tips?: string[];
  }
> = {
  AiRecommend: {
    title: "/ai-recommend · 기본 점수 분석 가이드",
    subtitle: "회차별 패턴·구간 신호를 점수로 정렬",
    summary:
      "선택 회차의 패턴 분석 결과를 바탕으로 번호별 점수를 계산하고, 상위 후보를 빠르게 정리합니다.",
    points: [
      "클러스터 단위 설정에 따라 점수 분포가 달라짐",
      "원본 점수/정규화 점수로 비교 가능",
      "상위 6개 번호 + 전체 1~45 점수 목록 제공",
      "다음 회차가 이미 존재하면 결과 비교가 가능",
    ],
    tips: ["상위 10~15개를 후보로 두고 최종 6개는 패턴 균형으로 조정하세요."],
  },
  AiNextRecommend: {
    title: "/ai-recommend · 다음 회차 분석 가이드",
    subtitle: "nextFreq 기반 다음 회차 연관 점수",
    summary:
      "이전 회차 번호와 다음 회차 출현의 연관 빈도(nextFreq)를 중심으로 점수를 구성합니다.",
    points: [
      "hot/cold/연속/패턴/클러스터/랜덤/nextFreq 가중치 합산",
      "선택한 구간(start~end) 기반 분석",
      "클러스터 단위에 따라 밀집 신호가 달라짐",
    ],
    tips: ["기본 점수 탭과 비교해 nextFreq 영향이 큰 번호를 따로 기록하세요."],
  },
  AiVariantRecommend: {
    title: "/ai-recommend · 전략 시뮬레이션 가이드",
    subtitle: "전략 프리셋(안정/패턴/군집/최근/혼합) 비교",
    summary:
      "전략별 가중치 프리셋으로 점수 분포를 비교하며 조합 성격을 실험합니다.",
    points: [
      "안정형/패턴형/군집형/최근형/혼합형 프리셋 제공",
      "프리셋에 따라 hot/cold/패턴/밀집/최근성/랜덤이 달라짐",
      "혼합형은 실행마다 결과가 달라짐(랜덤성 강화)",
    ],
    tips: ["같은 회차에서 프리셋만 바꿔 점수 분산을 비교해 보세요."],
  },
  AiAdvancedRecommend: {
    title: "/ai-recommend · 심층 점수 모델 가이드",
    subtitle: "가중치 직접 조절형 심층 모델",
    summary:
      "7개 피처 가중치를 직접 조절해 맞춤 점수 모델을 만드는 고급 탭입니다.",
    points: [
      "hot/cold/연속/패턴/클러스터/랜덤/nextFreq 가중치 조절",
      "Preset으로 시작해 필요한 항목만 미세 조정",
      "점수 리스트에서 번호별 기여도를 비교 가능",
    ],
    tips: ["가중치를 바꿀 때는 1~2개 항목만 조절해 효과를 분리해 보세요."],
  },
};

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string }>;
}) {
  const resolvedParams = searchParams ? await searchParams : undefined;
  const tabParam = resolvedParams?.tab;

  const activeTab = aiRecommendTabIds.includes(tabParam as AiRecommendTabId)
    ? (tabParam as AiRecommendTabId)
    : "AiRecommend";
  const doc = aiRecommendTabDocs[activeTab];
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://app.nexlab.ai.kr/ai-recommend#webpage",
        url: "https://app.nexlab.ai.kr/ai-recommend",
        name: "AI 점수 분석 | Nexlab",
        inLanguage: "ko-KR",
        description:
          "빈도/패턴/다음회차 연관 통계를 점수로 합쳐 1~45 번호를 정렬하는 분석 페이지.",
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
            name: "AI 점수 분석",
            item: "https://app.nexlab.ai.kr/ai-recommend",
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "AI 점수는 100% 정답인가요?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "정답이 아니라 ‘정렬 기준’입니다. 여러 지표를 한 번에 비교하기 쉽게 만든 점수입니다.",
            },
          },
          {
            "@type": "Question",
            name: "점수 상위 6개를 그대로 쓰면 되나요?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "가능하지만 보통은 상위 후보군(예: 10~15개)을 만든 뒤 구간/홀짝/연속 패턴을 조정해 최종 6개를 구성하는 편이 좋습니다.",
            },
          },
          {
            "@type": "Question",
            name: "회차 분석과 같이 쓰는 게 좋나요?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "네. /analyze에서 지난 회차 패턴을 확인하고, /ai-recommend에서 후보 번호를 점수로 정리하면 흐름 이해가 쉬워집니다.",
            },
          },
        ],
      },
    ],
  };

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

      <CollapsibleDoc
        title={doc.title}
        subtitle={doc.subtitle}
        defaultOpen={false}
        variant="ai"
      >
        <div className="rounded-xl border border-gray-200 bg-white/70 p-3">
          <div className="font-black text-gray-900">
            이 탭은 무엇을 보여줘요?
          </div>
          <p className="mt-2 text-sm">{doc.summary}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white/70 p-3">
          <div className="font-black text-gray-900">핵심 체크포인트</div>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {doc.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>

        {doc.tips && (
          <div className="rounded-xl border border-gray-200 bg-white/70 p-3">
            <div className="font-black text-gray-900">활용 팁</div>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {doc.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        {/* ✅ 내부 링크 허브 (크롤링 강화) */}
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
