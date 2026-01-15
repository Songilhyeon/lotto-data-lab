"use client";

import { useRef, useState } from "react";
import { apiUrl, getLatestRound } from "@/app/utils/getUtils";
import { componentBodyDivStyle } from "@/app/utils/getDivStyle";
import ComponentHeader from "@/app/components/ComponentHeader";
import LottoBall from "@/app/components/LottoBall";
import DraggableNextRound from "@/app/components/DraggableNextRound";
import ScoreBarList from "@/app/components/ai-recommend/ScoreBarList";
import { AiScoreBase } from "@/app/types/api";
import useRequestDedup from "@/app/hooks/useRequestDedup";
import BacktestSummaryCard from "@/app/components/ai-recommend/BacktestSummaryCard";

const AI_VARIANTS = [
  {
    key: "strict",
    label: "📏 안정형",
    desc: "빈도와 흐름을 중시 (항상 동일 결과)",
  },
  {
    key: "pattern",
    label: "🧩 패턴형",
    desc: "숫자 패턴 위주 (항상 동일 결과)",
  },
  {
    key: "cluster",
    label: "🧱 군집형",
    desc: "구간 밀집도 중심 (거의 동일 결과)",
  },
  { key: "decay", label: "⏳ 최근형", desc: "최근 회차 가중 (항상 동일 결과)" },
  {
    key: "chaos",
    label: "🎲 혼합형",
    desc: "랜덤성 강화 (실행마다 결과 변경)",
  },
] as const;

type VariantKey = (typeof AI_VARIANTS)[number]["key"];

interface NextRoundInfo {
  round: number;
  numbers: number[];
  bonus: number;
}

interface AiVariantResult {
  combination: number[];
  details: AiScoreBase[];
  scores: AiScoreBase[];
  seed: number;
  nextRound?: NextRoundInfo | null;
}

type VariantDedupParams = {
  round: number;
  variant: VariantKey;
};

export default function AiVariantRecommend() {
  const latestRound = getLatestRound();

  const [round, setRound] = useState(latestRound);
  const [variant, setVariant] = useState<VariantKey>("strict");
  const [result, setResult] = useState<AiVariantResult | null>(null);
  const [nextRound, setNextRound] = useState<NextRoundInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [scoreMode, setScoreMode] = useState<"raw" | "normalized">(
    "normalized"
  );
  const [errorMsg, setErrorMsg] = useState<string>("");

  const selectedVariant = AI_VARIANTS.find((v) => v.key === variant);
  const backtestTitle = selectedVariant
    ? `전략형 모델 · ${selectedVariant.label} · 과거 흐름 점검`
    : "전략형 모델 · 과거 흐름 점검";

  // ✅ dedup 제외 대상: chaos, cluster
  const isChaosLike = variant === "chaos" || variant === "cluster";

  const { begin, commit, rollback } = useRequestDedup<VariantDedupParams>();

  // ✅ "직전 실행이 chaos/cluster였음" 플래그
  // - chaos/cluster 실행하면 true로 올림
  // - 다음에 dedup 대상(strict/pattern/decay) 요청을 시작할 때 1회 force로 뚫고 false로 내림
  const chaosTouchedRef = useRef(false);

  const fetchAnalysis = async (force = false) => {
    let attemptKey: string | null = null;

    // ✅ dedup 대상(strict/pattern/decay)일 때만 dedup 적용
    if (!isChaosLike) {
      const params: VariantDedupParams = { round, variant };

      // ✅ chaos/cluster를 한번이라도 실행한 직후,
      //    다음 dedup 대상 요청은 1회 강제 실행 허용
      const effectiveForce = force || chaosTouchedRef.current;

      const attempt = begin(params, effectiveForce);
      if (!attempt.ok) return;

      attemptKey = attempt.key;

      // ✅ 이번에 dedup 요청을 "실제로" 시작했으니 플래그 해제
      chaosTouchedRef.current = false;
    } else {
      // ✅ chaos/cluster를 실행했음을 표시
      chaosTouchedRef.current = true;
    }

    setLoading(true);

    try {
      setErrorMsg("");
      const res = await fetch(`${apiUrl}/lotto/premium/recommend-variant`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          round,
          variant,
          ...(isChaosLike ? { seed: Date.now() } : {}),
        }),
      });

      if (!res.ok) {
        let msg = "요청에 실패했습니다.";
        try {
          const json = await res.json();
          msg = json?.message || json?.error || msg;
        } catch {}
        throw new Error(msg);
      }

      const data: AiVariantResult = await res.json();
      setResult(data);
      setNextRound(data.nextRound ?? null);

      // ✅ dedup 대상일 때만 commit
      if (!isChaosLike && attemptKey) commit(attemptKey);
    } catch (err: unknown) {
      console.error(err);
      let msg = "요청 중 오류가 발생했습니다.";
      if (err instanceof Error) {
        msg = err.message;
      }
      setErrorMsg(msg);
      // ✅ dedup 대상일 때만 rollback
      if (!isChaosLike) rollback();
    } finally {
      setLoading(false);
    }
  };

  const renderResult = () => {
    if (loading) {
      return (
        <div className="text-center py-6 text-gray-500">AI 점수 계산 중...</div>
      );
    }

    if (!result) {
      return (
        <div className="text-center py-6 text-gray-400">
          분석 결과가 없습니다.
        </div>
      );
    }

    const hitNumberSet = nextRound ? new Set<number>(nextRound.numbers) : null;

    return (
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="font-bold mb-2">분석 점수 TOP6 번호</h3>
        <div className="flex gap-2 flex-wrap mb-4">
          {result.combination.map((n) => (
            <LottoBall key={n} number={n} size="lg" />
          ))}
        </div>

        <ScoreBarList
          scores={result.scores}
          mode={scoreMode}
          hitNumberSet={hitNumberSet}
          bonusNumber={nextRound?.bonus}
        />
      </div>
    );
  };

  return (
    <div className={`${componentBodyDivStyle()} from-indigo-50 to-purple-100`}>
      <ComponentHeader
        title="🎯 전략형 모델"
        content={`동일한 통계 피처를 사용하여, 전략별 가중치 조합을 다르게해 결과를 비교하는 실험형 AI 모델.
                  회차를 선택하여 과거 회차에 어떤 번호가 당첨 되었는지 분석할 수 있습니다.`}
      />

      <div className="mb-4">
        <BacktestSummaryCard
          modelKey="ai_variant"
          variantKey={variant}
          title={backtestTitle}
        />
      </div>

      {/* 회차 선택 */}
      <div className="mb-4 flex items-center gap-2">
        <label className="font-medium text-gray-700">회차 선택:</label>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setRound((p) => Math.max(p - 1, 1))}
            disabled={round <= 1}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            -
          </button>

          <input
            type="number"
            min={1}
            max={latestRound}
            value={round}
            onChange={(e) => setRound(Number(e.target.value))}
            className="min-w-[4.5rem] px-2 py-1 text-center border rounded"
          />

          <button
            onClick={() => setRound((p) => Math.min(p + 1, latestRound))}
            disabled={round >= latestRound}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            +
          </button>
        </div>

        <span
          className="text-gray-500 cursor-pointer hover:underline"
          onClick={() => setRound(latestRound)}
        >
          최신 회차: {latestRound}
        </span>
      </div>

      {/* Variant 선택 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        {AI_VARIANTS.map((v) => (
          <button
            key={v.key}
            onClick={() => setVariant(v.key)}
            className={`p-3 rounded-xl border text-left transition ${
              variant === v.key
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            <div className="font-semibold">{v.label}</div>
            <div className="text-xs opacity-80">{v.desc}</div>
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-2">
        {errorMsg && (
          <div className="mb-3 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            {errorMsg}
          </div>
        )}
      </div>

      {/* 실행 */}
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => fetchAnalysis(false)}
          className="bg-green-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded mb-4 w-full sm:w-auto font-medium shadow-md hover:bg-green-600 active:scale-95"
        >
          점수 분석 실행
        </button>

        <button
          onClick={() => setScoreMode("normalized")}
          className={`px-4 py-2 sm:px-6 sm:py-3 rounded mb-4 w-full sm:w-auto font-medium shadow-md ${
            scoreMode === "normalized"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          정규화 점수
        </button>

        <button
          onClick={() => setScoreMode("raw")}
          className={`px-4 py-2 sm:px-6 sm:py-3 rounded mb-4 w-full sm:w-auto font-medium shadow-md ${
            scoreMode === "raw" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          원본 점수
        </button>
      </div>

      {nextRound && (
        <div className="min-w-0 mb-4">
          <DraggableNextRound nextRound={nextRound} most={[]} least={[]} />
        </div>
      )}

      <div className="overflow-visible">{renderResult()}</div>
    </div>
  );
}
