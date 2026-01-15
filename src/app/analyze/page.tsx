import { Suspense } from "react";
import AnalyzeClient from "./AnalyzeClient";
import ComponentHeader from "@/app/components/ComponentHeader";
import Link from "next/link";
import SeoJsonLd from "@/app/components/SeoJsonLd";
import CollapsibleDoc from "@/app/components/CollapsibleDoc";

export const metadata = {
  title: "로또 번호 분석 | 패턴·출현 빈도·AI 통계 분석",
  description:
    "역대 로또 번호 데이터를 기반으로 출현 빈도, 패턴, 구간 흐름을 분석합니다. AI 통계 분석으로 다음 회차 전략을 세워보세요.",
  keywords: [
    "로또 번호 분석",
    "로또 패턴 분석",
    "로또 출현 빈도",
    "로또 통계",
    "AI 로또 분석",
    "로또 번호 데이터",
  ],
  openGraph: {
    title: "로또 번호 분석 | 패턴·출현 빈도·AI 통계",
    description:
      "역대 로또 번호의 패턴과 출현 빈도를 데이터 기반으로 분석합니다. AI 통계로 흐름을 직관적으로 확인하세요.",
    url: "https://app.nexlab.ai.kr/analyze",
    siteName: "Lotto Data Lab",
    type: "website",
  },
  alternates: { canonical: "https://app.nexlab.ai.kr/analyze" },
};

export const dynamic = "force-dynamic";

const analyzeTabIds = [
  "oneRound",
  "multiRound",
  "basicSummary",
  "numberFrequency",
  "numberRange",
  "next",
  "numberLab",
  "intervalPattern",
  "roundDistPattern",
  "premiumAnalysis",
  "premiumNextFreq",
] as const;

type AnalyzeTabId = (typeof analyzeTabIds)[number];

const analyzeTabDocs: Record<
  AnalyzeTabId,
  {
    title: string;
    subtitle: string;
    summary: string;
    points: string[];
    tips?: string[];
  }
> = {
  oneRound: {
    title: "/analyze · 회차 정보 가이드",
    subtitle: "단일 회차의 패턴/구간/연속 요약 보기",
    summary:
      "특정 회차의 당첨 번호가 어떤 성격인지 빠르게 요약해서 기록하는 탭입니다.",
    points: [
      "구간 분포(1~10/11~20/…/41~45) 균형 여부",
      "홀짝 구성과 합계 범위",
      "연속 번호/연속쌍 발생 여부",
      "회차 요약 문장으로 빠르게 기록하기",
    ],
    tips: ["지난 회차 특징을 메모해두면 다음 회차와 비교가 쉬워집니다."],
  },
  multiRound: {
    title: "/analyze · 기간별 정보 가이드",
    subtitle: "여러 회차를 묶어 흐름을 확인",
    summary:
      "최근 N회 같은 기간 단위로 흐름을 살펴보며 구간/홀짝/합계/용지패턴 편향을 체크합니다.",
    points: [
      "특정 기간 동안의 구간 분포 변화",
      "홀짝/합계 편향이 지속되는지 확인",
      "기간별 용지 패턴 추세를 기준으로 회차 요약 보완",
    ],
    tips: ["기간을 바꿔보며 극단값이 반복되는지 체크해 보세요."],
  },
  basicSummary: {
    title: "/analyze · 기본 분석 가이드",
    subtitle: "회차의 기본 스냅샷을 빠르게 확인",
    summary:
      "가장 자주 보는 기본 지표들을 한 눈에 모아, 회차 성격을 빠르게 파악합니다.",
    points: [
      "특정 기간 동안의 구간/홀짝/합계/연속 기본 요약",
      "특정 기간의 성격을 한 문장으로 정리",
      "다음 회차 전략을 위한 체크리스트",
    ],
  },
  numberFrequency: {
    title: "/analyze · 번호별 빈도 가이드",
    subtitle: "최근 N회에서 자주/드물게 나온 번호",
    summary:
      "최근 회차 범위 내에서 번호별 출현 빈도를 확인해 흐름을 파악합니다.",
    points: [
      "상위 빈도 번호와 저빈도 번호 분리",
      "기간을 바꿔가며 빈도 변화 확인",
      "후보군 구성 시 참고용 지표",
    ],
  },
  numberRange: {
    title: "/analyze · 번호 구간 가이드",
    subtitle: "번호대별 쏠림과 균형 확인",
    summary:
      "선택한 기준 회차와 구간 패턴이 같은 지난 회차를 찾아 다음 회차의 번호 빈도를 확인합니다.",
    points: [
      "저/중/고 구간 쏠림 여부",
      "구간별 빈도 밸런스",
      "구간별 패턴의 같은 지난 회차의 정보확인",
    ],
  },
  next: {
    title: "/analyze · 일치 개수 가이드",
    subtitle: "과거 회차와의 일치 패턴 분석",
    summary: "선택한 기준 회차와의 일치 개수를 비교해 패턴 반복을 탐색합니다.",
    points: [
      "기준 회차와 일치 패턴이 같은 회차수 확인",
      "일치 패턴 회차의 당첨 번호 확인",
      "일치 패턴의 다음 회차 번호 빈도",
    ],
  },
  numberLab: {
    title: "/analyze · 번호 실험실 가이드",
    subtitle: "가설을 세우고 패턴을 실험",
    summary:
      "번호 조합 가설을 만들어 다양한 번호를 조합하여 결과를 실험하는 탭입니다.",
    points: [
      "구간/홀짝/합계 조건을 가정해 보기",
      "조건 조합의 현실성 체크",
      "후보군 조합의 위험/편향 확인",
      "조합 번호의 과거 당첨 여부 확인",
    ],
    tips: ["실험 결과는 기록해두면 장기 추세 비교에 유용합니다."],
  },
  premiumAnalysis: {
    title: "/analyze · 통합 분석 가이드",
    subtitle: "패턴/빈도/간격을 한 번에 정리",
    summary:
      "여러 지표를 합쳐 회차를 통합적으로 요약하는 프리미엄 분석 탭입니다.",
    points: [
      "기준회차로 부터 최근 N회의 번호 빈도",
      "기준 회차의 각각의 당첨 번호 다음에 등장한 번호 빈도",
      "일치개수/구간패턴이 같은 회차의 다음 회차 번호 빈도",
    ],
  },
  intervalPattern: {
    title: "/analyze · 출현 간격 가이드",
    subtitle: "번호가 얼마나 자주, 어떤 간격으로 나오는지 확인",
    summary:
      "번호의 출현 간격을 정리해 전체 흐름을 쉽게 파악하는 요약 탭입니다.",
    points: [
      "구간(예: 1~7, 8~14) 단위로 흐름 요약",
      "다음 회차에 자주 나온 번호를 점수로 정리",
      "번호별 최근 간격 패턴을 표로 확인",
    ],
    tips: [
      "Interval 분포 요약 그래프는 구간별 흐름, 다음 회차 번호 분포 그래프는 ‘비슷한 간격 패턴 다음 회차에 자주 나온 번호’ 점수입니다.",
    ],
  },
  roundDistPattern: {
    title: "/analyze · 번호 간격 가이드",
    subtitle: "당첨 번호 간 간격/거리 분석",
    summary: "한 회차 안에서 번호 간 간격이 어떤 패턴을 보이는지 살펴봅니다.",
    points: [
      "번호 간격(차이값) 분포 확인",
      "연속/큰 간격 조합의 비율",
      "간격 패턴을 이용한 조합 다양화",
    ],
  },
  premiumNextFreq: {
    title: "/analyze · 조건 기반 분석 가이드",
    subtitle: "조건을 지정해 후보군을 만드는 흐름",
    summary: "조건을 직접 설정해 후보군을 구성하고, 패턴 적합도를 확인합니다.",
    points: [
      "구간/홀짝/합계 조건 조합",
      "빈도/간격 조건을 함께 반영",
      "조건별 후보군 비교와 기록",
    ],
  },
};

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string }>;
}) {
  const resolvedParams = searchParams ? await searchParams : undefined;
  const tabParam = resolvedParams?.tab;
  const activeTab = analyzeTabIds.includes(tabParam as AnalyzeTabId)
    ? (tabParam as AnalyzeTabId)
    : "oneRound";
  const doc = analyzeTabDocs[activeTab];
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://app.nexlab.ai.kr/analyze#webpage",
        url: "https://app.nexlab.ai.kr/analyze",
        name: "회차별 당첨 번호 분석 | Nexlab",
        inLanguage: "ko-KR",
        description:
          "특정 회차 당첨 번호를 구간/패턴/빈도 관점에서 요약해 기록하는 분석 페이지.",
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
            name: "분석",
            item: "https://app.nexlab.ai.kr/analyze",
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "이 페이지는 어떤 목적이에요?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "예측보다는 ‘그 회차가 데이터로 보면 어떤 상태였는지’를 기록/정리하는 목적입니다.",
            },
          },
          {
            "@type": "Question",
            name: "초보가 가장 먼저 볼 지표는 뭐예요?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "구간 분포(1~10 등), 홀짝 구성, 연속 번호 여부 3가지만 봐도 회차 성격이 빠르게 잡힙니다.",
            },
          },
          {
            "@type": "Question",
            name: "AI 점수 분석과 무엇이 달라요?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "/analyze는 ‘회차 요약’, /ai-recommend는 ‘번호를 점수로 정렬’에 가깝습니다.",
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="px-4 sm:px-6 pt-4 pb-10">
      <ComponentHeader
        title="로또 번호 분석 & 패턴 통계"
        content="역대 로또 번호 데이터를 기반으로 출현 빈도, 패턴 흐름, AI 통계 분석을 제공합니다."
        srOnly={true}
      />

      <p className="sr-only">
        본 페이지에서는 로또 번호의 출현 빈도, 회차별 패턴, 번호 간 간격, 통계적
        흐름을 AI 기반으로 분석하여 다음 회차 전략 수립에 도움을 줍니다.
      </p>

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

      <CollapsibleDoc
        title={doc.title}
        subtitle={doc.subtitle}
        defaultOpen={false}
        variant="analyze"
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

        <div className="grid gap-2 md:grid-cols-2">
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
