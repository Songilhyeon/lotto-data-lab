export const dynamic = "force-dynamic";
import { Playfair_Display, Space_Grotesk } from "next/font/google";
import SeoJsonLd from "@/app/components/SeoJsonLd";
import CollapsibleDoc from "@/app/components/CollapsibleDoc";
import Link from "next/link";
import HomeSelectionSummaryCard from "@/app/components/landing/HomeSelectionSummaryCard";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-ldl-serif",
});

const space = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ldl-sans",
});

export const metadata = {
  title: "LDL: Lotto Data Lab | 데이터로 해석하는 로또",
  description:
    "LDL은 로또를 감각이 아니라 데이터와 구조로 이해하는 분석 플랫폼입니다. 패턴, 간격, AI 점수, 판매점 데이터를 통해 선택의 근거를 제공합니다.",
  keywords: [
    "로또 분석",
    "로또 데이터",
    "로또 패턴",
    "로또 간격 분석",
    "AI 로또 점수",
    "로또 번호 흐름",
    "로또 명당",
    "로또 기록",
  ],
  openGraph: {
    title: "LDL: Lotto Data Lab | 데이터로 해석하는 로또",
    description:
      "로또를 운이 아닌 데이터로 해석합니다. 패턴·간격·AI 점수·판매점 정보를 구조화해 선택의 근거를 제공합니다.",
    url: "https://app.nexlab.ai.kr",
    siteName: "Lotto Data Lab",
    type: "website",
  },
  alternates: { canonical: "https://app.nexlab.ai.kr/" },
};

export default function LandingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://app.nexlab.ai.kr/#website",
        url: "https://app.nexlab.ai.kr/",
        name: "Nexlab 로또 데이터 분석",
        inLanguage: "ko-KR",
        potentialAction: [
          {
            "@type": "ViewAction",
            name: "회차 분석 보기",
            target: "https://app.nexlab.ai.kr/analyze",
          },
          {
            "@type": "ViewAction",
            name: "AI 점수 분석 보기",
            target: "https://app.nexlab.ai.kr/ai-recommend",
          },
          {
            "@type": "ViewAction",
            name: "당첨 판매점 보기",
            target: "https://app.nexlab.ai.kr/winner-stores",
          },
          {
            "@type": "ViewAction",
            name: "역대 기록 보기",
            target: "https://app.nexlab.ai.kr/lotto-history",
          },
        ],
      },
      {
        "@type": "WebPage",
        "@id": "https://app.nexlab.ai.kr/#webpage",
        url: "https://app.nexlab.ai.kr/",
        name: "로또 데이터 분석 | Nexlab",
        isPartOf: { "@id": "https://app.nexlab.ai.kr/#website" },
        inLanguage: "ko-KR",
        description:
          "회차별 당첨 번호를 구간/패턴/빈도 관점으로 정리하고 AI 점수 분석으로 번호 흐름을 기록하는 서비스.",
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
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "LDL은 번호를 예측해 주나요?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "예측보다 설명과 기록에 초점을 둡니다. 과거 회차를 데이터로 정리해 흐름을 이해하도록 돕습니다.",
            },
          },
          {
            "@type": "Question",
            name: "처음 사용자는 어디부터 보면 좋나요?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "/analyze에서 회차 패턴을 확인하고 /ai-recommend에서 점수 흐름을 비교하는 순서가 가장 간단합니다.",
            },
          },
          {
            "@type": "Question",
            name: "LDL에서 주로 보는 지표는 무엇인가요?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "구간 분포, 홀짝/합/연속 패턴, 간격, 다음 회차 연관 빈도 같은 통계를 중심으로 봅니다.",
            },
          },
        ],
      },
      {
        "@type": "HowTo",
        name: "LDL로 로또 흐름을 확인하는 방법",
        description:
          "LDL은 번호를 추천하기보다 근거를 설명합니다. 아래 순서로 흐름을 확인해 보세요.",
        step: [
          {
            "@type": "HowToStep",
            name: "회차 패턴 확인",
            text: "/analyze에서 구간/홀짝/간격 패턴을 먼저 확인합니다.",
          },
          {
            "@type": "HowToStep",
            name: "AI 점수 비교",
            text: "/ai-recommend에서 점수 흐름을 비교하고 후보군을 정리합니다.",
          },
          {
            "@type": "HowToStep",
            name: "기록과 비교",
            text: "메모 기능으로 선택 이유를 기록해 다음 회차에 비교합니다.",
          },
        ],
      },
    ],
  };

  return (
    <div
      className={`${space.variable} ${playfair.variable} ${space.className} min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-emerald-50 text-slate-900`}
    >
      {/* SEO용 H1 */}
      <h1 className="sr-only">
        로또 번호 분석과 통계, AI 분석, 1,2등 당첨 업체 정보를 제공하는 Lotto
        Data Lab
      </h1>

      <p className="sr-only">
        LDL은 로또를 감각이 아니라 데이터와 구조로 해석하는 분석 플랫폼입니다.
      </p>

      <main className="relative overflow-hidden">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-emerald-200/40 blur-3xl" />

        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-12">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-600">
                LDL : Lotto Data Lab
              </span>
              <h2
                className={`${playfair.className} text-4xl sm:text-5xl leading-tight text-slate-900`}
              >
                추천이 아니라, 선택을 돕습니다
              </h2>
              <p className="text-lg text-slate-700">
                LDL은 번호를 대신 고르지 않습니다. 수동으로 고르는 사람을 위해
                <b> 근거를 정리</b>하고 <b>귀찮은 과정</b>을 줄여줍니다.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/analyze"
                  className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-slate-800"
                >
                  분석 시작하기
                </Link>
                <Link
                  href="/ai-recommend"
                  className="rounded-xl border border-slate-300 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-white"
                >
                  AI 점수 분석 보기
                </Link>
                <Link
                  href="/winner-stores"
                  className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800 hover:bg-emerald-100"
                >
                  명당 데이터 보기
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-xl">
              <div className="mt-3 space-y-4">
                <div>
                  <div className="text-sm font-bold text-slate-900" id="brand">
                    수동 선택을 위한 분석 도구
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    번호를 추천하지 않고, 선택의 이유를 설명합니다.
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-900 p-4 text-white">
                  <div className="text-xs uppercase tracking-widest text-slate-300">
                    Tagline
                  </div>
                  <div
                    className={`${playfair.className} mt-2 text-2xl leading-snug`}
                  >
                    고르는 사람을 위한 데이터 실험실.
                  </div>
                </div>
                <div className="grid gap-2 text-sm text-slate-600">
                  <p>• 패턴/간격/연속성 기반 선택 근거 정리</p>
                  <p>• AI 점수로 후보군을 비교</p>
                  <p>• 당첨 판매점 기록 정리</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <HomeSelectionSummaryCard />

        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12" id="core">
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                title: "선택 근거 정리",
                desc: "구간 분포, 패턴, 간격, 연속성을 파악하여 정리합니다.",
                accent: "from-amber-100 to-white",
              },
              {
                title: "후보군 비교",
                desc: "AI 점수로 후보 번호를 비교하고 우선순위를 잡습니다.",
                accent: "from-emerald-100 to-white",
              },
              {
                title: "참고 데이터",
                desc: "당첨 판매점 기록을 지역/검색 기준으로 빠르게 확인합니다.",
                accent: "from-slate-100 to-white",
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`rounded-2xl border border-slate-200 bg-gradient-to-br ${item.accent} p-5 shadow-sm`}
              >
                <div className="text-lg font-bold text-slate-900">
                  {item.title}
                </div>
                <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
              <div className="text-sm font-semibold text-slate-500">
                Quick Snapshot
              </div>
              <h3
                className={`${playfair.className} mt-2 text-2xl text-slate-900`}
              >
                브랜드는 깊게, 사용은 가볍게
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li>
                  • 분석 <span className="text-gray-400">·</span>{" "}
                  <span className="text-xs text-gray-400">/analyze</span>에서
                  이번 회차 패턴을 한눈에 확인
                </li>
                <li>
                  • AI 점수 분석 <span className="text-gray-400">·</span>{" "}
                  <span className="text-xs text-gray-400">/ai-recommend</span>
                  에서 점수 상위 후보만 체크
                </li>
                <li>• 메모와 내 번호 저장 기능으로 선택 이유를 기록</li>
              </ul>
              <div className="mt-5 flex flex-wrap gap-2 text-xs">
                <Link
                  href="/analyze"
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700 hover:bg-slate-50"
                >
                  분석 바로가기
                </Link>
                <Link
                  href="/ai-recommend"
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700 hover:bg-slate-50"
                >
                  점수 바로가기
                </Link>
                <Link
                  href="/winner-stores"
                  className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-800 hover:bg-emerald-100"
                >
                  명당 데이터
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-sm">
              <div className="text-xs uppercase tracking-widest text-slate-300">
                Practical Value
              </div>
              <div className={`${playfair.className} mt-2 text-2xl`}>
                “왜 이 번호인가”를 기록하세요
              </div>
              <p className="mt-3 text-sm text-slate-200">
                기록은 다음 회차의 기준이 됩니다. 선택의 이유를 남기고 비교하면
                수동 선택이 더 단단해집니다.
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12" id="value">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
              <div className="text-sm font-semibold text-slate-500">
                Customer Value
              </div>
              <h3
                className={`${playfair.className} mt-2 text-3xl text-slate-900`}
              >
                왜 이 번호인가를 이해하는 선택
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li>• 감이 아니라 근거로 고르는 경험</li>
                <li>• 반복 구매의 피로를 데이터로 정리</li>
                <li>• 분석 흐름을 기록하고 비교하는 구조</li>
                <li>• 수동 선택을 더 합리적으로 만드는 방법</li>
              </ul>
              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                <Link
                  href="/analyze"
                  className="group inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  회차별 분석
                  <span className="text-white/70 transition group-hover:text-blue">
                    →
                  </span>
                </Link>
                <Link
                  href="/ai-recommend"
                  className="group inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-white"
                >
                  점수 흐름 보기
                  <span className="text-slate-400 transition group-hover:text-slate-700">
                    →
                  </span>
                </Link>
                <Link
                  href="/lotto-history"
                  className="group inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-amber-900 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-100"
                >
                  역대 기록
                  <span className="text-amber-500 transition group-hover:text-amber-800">
                    →
                  </span>
                </Link>
              </div>
            </div>

            <div className="space-y-4" id="difference">
              <div className="rounded-2xl border border-slate-200 bg-slate-900 px-5 py-4 text-white">
                <div className="text-xs uppercase tracking-widest text-slate-400">
                  Slogan
                </div>
                <div className={`${playfair.className} mt-2 text-2xl`}>
                  선택은 근거를 가진 사람의 것
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-5">
                <div className="font-bold text-slate-900">LDL의 차별점</div>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  <li>• 추천이 아니라 선택을 돕습니다.</li>
                  <li>• 단기 예측보다 흐름을 봅니다.</li>
                  <li>• 스스로 판단할 수 있게 구조를 제공합니다.</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900">
                번호 선택이 막막할 때, LDL은 기준을 제공합니다. 운 대신 데이터
                흐름으로 결정하세요.
              </div>
            </div>
          </div>
        </section>

        <section
          className="max-w-6xl mx-auto px-4 sm:px-6 pb-12"
          id="use-cases"
        >
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  title: "막막한 번호 선택",
                  desc: "기준 회차 패턴과 점수를 확인해 후보군을 좁힙니다.",
                },
                {
                  title: "반복 구매의 피로감",
                  desc: "선택 이유를 기록하고 다음 회차와 비교합니다.",
                },
                {
                  title: "운에 흔들릴 때",
                  desc: "객관적 지표로 흐름을 다시 확인합니다.",
                },
              ].map((item) => (
                <div key={item.title}>
                  <div className="text-base font-semibold text-slate-900">
                    {item.title}
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12" id="start">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                href: "/analyze",
                title: "회차별 분석",
                desc: "구간/홀짝/합/연속 패턴을 한 번에 요약",
              },
              {
                href: "/ai-recommend",
                title: "AI 점수 분석",
                desc: "다음 회차 연관성과 클러스터 흐름 점수화",
              },
              {
                href: "/winner-stores",
                title: "1·2등 판매점",
                desc: "실제 당첨 이력 기반 판매점 탐색",
              },
              {
                href: "/lotto-history",
                title: "역대 기록",
                desc: "최고 기록과 특이 회차 보기",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="font-semibold text-slate-900">
                    {item.title}
                  </div>
                  <span className="text-slate-400 transition group-hover:text-slate-700">
                    →
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-600">{item.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
          <CollapsibleDoc
            title="홈 가이드 · LDL을 가장 편하게 쓰는 방법"
            subtitle="필요하면 펼쳐서 확인하세요"
            defaultOpen={false}
            variant="home"
          >
            <div className="rounded-xl border border-gray-200 bg-white/70 p-3">
              <div className="font-black text-gray-900">LDL이 제공하는 것</div>
              <p className="mt-2 text-sm">
                번호를 추천하기보다, 번호를 해석하는 근거를 제공합니다. 패턴과
                간격, AI 점수, 판매점 이력까지 연결해 구조를 이해하게 합니다.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white/70 p-3">
              <div className="font-black text-gray-900">추천 사용 흐름</div>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
                <li>
                  분석 <span className="text-gray-400">·</span>{" "}
                  <span className="text-xs text-gray-400">/analyze</span>에서
                  지난 회차 패턴을 먼저 확인
                </li>
                <li>
                  AI 점수 분석 <span className="text-gray-400">·</span>{" "}
                  <span className="text-xs text-gray-400">/ai-recommend</span>
                  에서 후보 번호를 점수로 정리
                </li>
                <li>구간/홀짝/연속 균형을 맞춰 조합 정리</li>
                <li>메모 기능으로 이유를 기록하고 다음 회차에 비교</li>
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
            </div>
          </CollapsibleDoc>
        </section>
      </main>

      {/* ✅ 화면 영향 없는 SEO(JSON-LD) */}
      <SeoJsonLd json={jsonLd} />
    </div>
  );
}
