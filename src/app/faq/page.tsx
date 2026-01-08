import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | 로또 데이터랩",
  description:
    "로또 데이터랩 FAQ: 분석, AI 점수 분석, 조건 검색, 역대 기록, 판매점 정보 등 자주 묻는 질문을 정리했습니다.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "FAQ | 로또 데이터랩",
    description:
      "분석/AI 점수/조건 검색/역대 기록/판매점 정보 관련 자주 묻는 질문",
    url: "/faq",
    type: "website",
  },
};

const faqs = [
  {
    q: "이 서비스는 무엇을 해주는 곳인가요?",
    a: "로또 회차 데이터를 기반으로 패턴과 흐름(구간/빈도/조건/점수)을 분석해, 수동 번호 선택에 참고하실 수 있도록 돕습니다.",
  },
  {
    q: "‘분석’ 메뉴에서는 무엇을 보나요?",
    a: "회차별 당첨 번호의 구간 분포, 빈도, 패턴을 요약해 보여드립니다. 회차 흐름을 익히기에 적합합니다.",
  },
  {
    q: "‘AI 점수 분석’은 당첨 번호를 예측하나요?",
    a: "예측/보장 기능이 아니라, 통계 요소를 점수화하여 참고용으로 제공합니다. 점수가 높다고 당첨이 보장되지는 않습니다.",
  },
  {
    q: "‘조건 검색’은 어떻게 쓰는 게 좋나요?",
    a: "구간/홀짝/합계/포함·제외 번호 등 조건으로 회차를 필터링한 뒤, 해당 조건을 만족한 회차들의 ‘다음 회차 흐름’을 확인해 전략을 검증하실 수 있습니다. 조건은 1~2개부터 시작하시고 표본(결과 회차 수)이 충분한지 확인해 주세요.",
  },
  {
    q: "조건 검색 프리셋 추천이 있나요?",
    a: "구간 균형형(1~10/11~20/21~30 각 1~2개), 안정 조합형(홀짝 3:3 + 합계 100~160), 제외 전략형(최근 1~2회 연속 출현 번호 1~2개 제외)을 추천드립니다.",
  },
  {
    q: "‘역대 기록’은 개인 기록인가요?",
    a: "아닙니다. 로또 자체의 역대 기록(최고·최저 당첨금 등)을 의미합니다.",
  },
  {
    q: "‘1·2등 판매점’ 정보는 무엇을 기준으로 하나요?",
    a: "회차별 당첨 이력이 있는 판매점을 지역/등수 기준으로 확인하실 수 있습니다.",
  },
  {
    q: "당첨을 보장하나요?",
    a: "아닙니다. 본 서비스는 통계 기반 참고 자료를 제공하며, 당첨을 보장하지 않습니다.",
  },
];

export default function FaqPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-black text-gray-900">
        자주 묻는 질문 (FAQ)
      </h1>
      <p className="mt-2 text-sm text-gray-600">
        서비스 사용 중 궁금하신 내용을 빠르게 확인하실 수 있습니다.
      </p>

      <div className="mt-8 space-y-3">
        {faqs.map((item, idx) => (
          <details
            key={idx}
            className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <summary className="cursor-pointer list-none font-bold text-gray-900 flex items-center justify-between">
              <span>{item.q}</span>
              <span className="text-gray-400 group-open:rotate-180 transition">
                ▾
              </span>
            </summary>
            <p className="mt-3 text-sm text-gray-700 leading-relaxed">
              {item.a}
            </p>
          </details>
        ))}
      </div>

      <p className="mt-8 text-xs text-gray-500">
        ※ 본 서비스는 통계 기반 참고 자료이며, 당첨을 보장하지 않습니다.
      </p>
    </main>
  );
}
