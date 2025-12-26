"use client";

import { useState } from "react";
import { apiUrl, getLatestRound } from "@/app/utils/getUtils";
import { componentBodyDivStyle } from "@/app/utils/getDivStyle";
import ComponentHeader from "@/app/components/ComponentHeader";
import LottoBall from "@/app/components/LottoBall";
import DraggableNextRound from "@/app/components/DraggableNextRound";
import ScoreBarList from "@/app/components/ai-recommend/ScoreBarList";
import { AiScoreBase } from "@/app/types/api";

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
  {
    key: "decay",
    label: "⏳ 최근형",
    desc: "최근 회차 가중 (항상 동일 결과)",
  },
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

  const isChaos = variant === "chaos";

  const fetchAnalysis = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${apiUrl}/lotto/premium/recommend-variant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          round,
          variant,
          seed: isChaos ? Date.now() : undefined,
        }),
      });

      const data: AiVariantResult = await res.json();
      setResult(data);
      setNextRound(data.nextRound ?? null);
    } catch (err) {
      console.error(err);
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
        {/* 추천 조합 */}
        <h3 className="font-bold mb-2">추천 조합</h3>
        <div className="flex gap-2 flex-wrap mb-4">
          {result.combination.map((n) => (
            <LottoBall key={n} number={n} size="lg" />
          ))}
        </div>

        {/* 점수 분포 (정규화 기준) */}
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
        title="🧠 전략형 모델"
        content={`같은 통계 데이터를 극단적으로 다른 관점에서 해석하여, 각 전략의 특징을 명확히 구분하는 실험형 AI 모델. 
                  회차를 선택하여 과거 회차에 어떤 번호가 당첨 되었는지 분석할 수 있습니다.`}
      />

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

      {/* 실행 */}
      <div className="flex gap-2 mb-2">
        <button
          onClick={fetchAnalysis}
          className="bg-green-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded mb-4 w-full sm:w-auto font-medium shadow-md hover:bg-green-600"
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
      <div className="overflow-y-auto max-h-[80vh]">{renderResult()}</div>
    </div>
  );
}
