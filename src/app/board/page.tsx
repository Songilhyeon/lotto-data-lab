import Link from "next/link";
import BoardClient from "./BoardClient";
import ComponentHeader from "@/app/components/ComponentHeader";
import CollapsibleDoc from "@/app/components/CollapsibleDoc";
import SeoJsonLd from "@/app/components/SeoJsonLd";

export const metadata = {
  title: "커뮤니티 & 게시판 | Lotto Data Lab",
  description:
    "로또 관련 커뮤니티 게시판입니다. 질문, 후기, 번호 공유 등 사용자 참여형 게시물을 확인하고 의견을 남겨보세요.",
  alternates: { canonical: "https://app.nexlab.ai.kr/board" },
  openGraph: {
    title: "커뮤니티 & 게시판 | Lotto Data Lab",
    description:
      "로또 관련 커뮤니티 게시판입니다. 질문, 후기, 번호 공유 등 사용자 참여형 게시물을 확인하고 의견을 남겨보세요.",
    url: "https://app.nexlab.ai.kr/board",
    siteName: "Lotto Data Lab",
    type: "website",
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://app.nexlab.ai.kr/board#webpage",
        url: "https://app.nexlab.ai.kr/board",
        name: "커뮤니티 & 게시판 | Lotto Data Lab",
        inLanguage: "ko-KR",
        description:
          "로또 관련 커뮤니티 게시판. 질문/후기/번호 공유 등 사용자 참여 글을 확인하는 페이지.",
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
            name: "게시판",
            item: "https://app.nexlab.ai.kr/board",
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "게시판에서는 어떤 글을 올릴 수 있나요?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "로또 관련 질문, 후기, 번호 공유, 개선 요청 등 자유롭게 글을 올릴 수 있습니다.",
            },
          },
          {
            "@type": "Question",
            name: "분석 결과를 공유하려면 어디를 참고하면 좋나요?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "/analyze(회차 요약) 또는 /ai-recommend(AI 점수 분석) 결과를 같이 적으면 맥락이 더 잘 전달됩니다.",
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="p-4">
      <ComponentHeader
        title="📋 피드백 게시판"
        content="문제점, 개선사항, 궁금한 점 등을 자유롭게 남겨보세요."
        srOnly={true}
      />

      <BoardClient />

      {/* ✅ 접힘 문서 + 내부링크 허브(크롤링 강화) */}
      <CollapsibleDoc
        title="/board 가이드 · 커뮤니티 글 잘 쓰는 방법"
        subtitle="기본은 접힘(검색/크롤링에는 도움, 화면은 깔끔)"
        defaultOpen={false}
        variant="board"
      >
        <div className="rounded-xl border border-gray-200 bg-white/70 p-3">
          <div className="font-black text-gray-900">
            글을 쓸 때 이 3가지만 넣어줘
          </div>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>어떤 회차/어떤 번호 조합인지</li>
            <li>분석에서 어떤 패턴이었는지(구간/홀짝/합/연속)</li>
            <li>내가 궁금한 포인트(질문/피드백/개선 요청)</li>
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

      <SeoJsonLd json={jsonLd} />
    </div>
  );
}
