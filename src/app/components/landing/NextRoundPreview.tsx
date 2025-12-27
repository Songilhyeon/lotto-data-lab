import Link from "next/link";
import clsx from "clsx";

interface Props {
  data: {
    basis?: {
      start: number;
      end: number;
      minMatch: number;
      totalMatchedRounds: number;
    };
    headline?: string;
    signals: {
      id: string;
      label: string;
      desc: string;
      strength?: "weak" | "normal" | "strong";
    }[];
    highlight: {
      hot: number[];
      watch: number[];
    };
  };
}

export default function NextRoundPreview({ data }: Props) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl border p-6 sm:p-8">
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
        다음 회차 번호 분석 요약
      </h3>

      {/* 🧠 핵심 판단 headline */}
      {data.headline && (
        <p className="text-sm sm:text-base font-semibold text-blue-900 mb-3">
          {data.headline}
        </p>
      )}

      {/* 🔍 분석 기준 설명 */}
      {data.basis && (
        <p className="text-xs sm:text-sm text-gray-600 mb-4">
          기준 회차까지의 데이터 중, 번호가{" "}
          <span className="font-medium">{data.basis.minMatch}개 이상</span>{" "}
          일치한{" "}
          <span className="font-medium">{data.basis.totalMatchedRounds}개</span>{" "}
          유사 회차의 다음 결과를 분석했습니다.
        </p>
      )}

      {/* 📌 관찰 시그널 */}
      <ul className="space-y-2 mb-4">
        {data.signals.map((s) => (
          <li
            key={s.id}
            className={clsx(
              "text-sm",
              s.strength === "strong" && "text-red-700 font-medium",
              s.strength === "normal" && "text-gray-800",
              s.strength === "weak" && "text-gray-600"
            )}
          >
            • <span className="font-medium">{s.label}</span> — {s.desc}
          </li>
        ))}
      </ul>

      {/* 🔢 다음 회차 관찰 번호 */}
      <div className="text-sm text-gray-700 mb-5">
        <div>
          <span className="font-semibold">빈도 상위 번호</span>:{" "}
          {data.highlight.hot.length > 0 ? data.highlight.hot.join(", ") : "—"}
        </div>
        <div className="mt-1">
          <span className="font-semibold">추가 관찰 번호</span>:{" "}
          {data.highlight.watch.length > 0
            ? data.highlight.watch.join(", ")
            : "—"}
        </div>
      </div>

      {/* 👉 Analyze 연결 */}
      <Link
        href="/analyze?tab=next"
        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
      >
        다음 회차 분석 자세히 보기 →
      </Link>
    </div>
  );
}
