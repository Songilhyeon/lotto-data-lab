"use client";

import { useState } from "react";
import { IfAiRecommendResult } from "@/app/types/api";
import { apiUrl, getLatestRound } from "@/app/utils/getUtils";
import { componentBodyDivStyle } from "@/app/utils/getDivStyle";
import ComponentHeader from "@/app/components/ComponentHeader";
import ClusterUnitSelector from "@/app/components/ai-recommend/ClusterUnitSelector";
import { LottoDraw } from "@/app/types/lottoNumbers";
import DraggableNextRound from "@/app/components/DraggableNextRound";
import LottoBall from "../LottoBall";
import ScoreBarList from "@/app/components/ai-recommend/ScoreBarList";
import useRequestDedup from "@/app/hooks/useRequestDedup";
import BacktestSummaryCard from "@/app/components/ai-recommend/BacktestSummaryCard";

type RecommendParams = {
  round: number;
  clusterUnit: number;
};

export default function AiRecommend() {
  const latestRound = getLatestRound();
  const [selectedRound, setSelectedRound] = useState<number>(latestRound);
  const [clusterUnit, setClusterUnit] = useState<number>(7);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IfAiRecommendResult | null>(null);
  const [nextRound, setNextRound] = useState<LottoDraw | null>(null);
  const [scoreMode, setScoreMode] = useState<"raw" | "normalized">(
    "normalized"
  );
  const [errorMsg, setErrorMsg] = useState<string>("");

  // ✅ 성공한 요청만 dedup 대상으로 삼고, 실패하면 재시도 가능
  const { begin, commit, rollback } = useRequestDedup<RecommendParams>();

  const fetchAnalysis = async (force = false) => {
    const params: RecommendParams = {
      round: selectedRound,
      clusterUnit,
    };

    const attempt = begin(params, force);
    if (!attempt.ok) return;

    setLoading(true);
    try {
      setErrorMsg("");

      const res = await fetch(
        `${apiUrl}/lotto/premium/recommend?round=${selectedRound}&clusterUnit=${clusterUnit}`,
        {
          // credentials: "include",
        }
      );

      if (!res.ok) {
        let msg = "요청에 실패했습니다.";
        try {
          const json = await res.json();
          msg = json?.message || json?.error || msg;
        } catch {}
        throw new Error(msg);
      }

      const json = await res.json();
      setResult(json.result);
      setNextRound(json.result?.nextRound ?? null);

      commit(attempt.key);
    } catch (err: unknown) {
      console.error(err);

      let msg = "요청 중 오류가 발생했습니다.";
      if (err instanceof Error) {
        msg = err.message;
      }

      setErrorMsg(msg);
      rollback(); // ✅ 실패면 재시도 가능
    } finally {
      setLoading(false);
    }
  };

  const hitNumberSet = nextRound ? new Set<number>(nextRound.numbers) : null;
  const bonusNumber = nextRound?.bonus;

  const renderResult = () => {
    if (loading) return <div>점수 분석 중...</div>;
    if (!result) return <div>분석 결과가 없습니다.</div>;

    return (
      <div className="mt-2 p-4">
        <h3 className="font-bold mb-2">분석 점수 TOP6 번호</h3>
        <div className="flex flex-wrap gap-2 mb-2">
          {result.recommended.map((n) => (
            <LottoBall key={n} number={n} size="lg" />
          ))}
        </div>

        {result.scores && (
          <ScoreBarList
            scores={result.scores}
            mode={scoreMode}
            hitNumberSet={hitNumberSet}
            bonusNumber={bonusNumber}
          />
        )}
      </div>
    );
  };

  return (
    <div className={`${componentBodyDivStyle()} from-pink-50 to-indigo-100`}>
      <ComponentHeader
        title="🧮 기본 모델"
        content={`과거 당첨 패턴, 번호 간 상관관계, 최근 출현 경향, 홀짝 균형, 번호 구간 분포 등 다차원 통계 분석 기반 AI 모델.
회차를 선택하여 과거 회차에 어떤 번호가 당첨 되었는지 분석할 수 있습니다.`}
      />

      <ClusterUnitSelector
        clusterUnit={clusterUnit}
        setClusterUnit={setClusterUnit}
      />

      {/* ✅ Backtest 요약을 상단에 배치 + clusterUnit 반영 */}
      <div className="mb-4">
        <BacktestSummaryCard
          modelKey="ai_basic"
          clusterUnit={clusterUnit}
          // 필요하면 span도 조절 가능 (서버 기본 300)
          // span={300}
        />
      </div>

      {/* 회차 선택 */}
      <div className="mb-4 flex items-center gap-2">
        <label className="font-medium text-gray-700">회차 선택:</label>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setSelectedRound((prev) => Math.max(prev - 1, 1))}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 active:bg-gray-400 transition disabled:opacity-40"
            disabled={selectedRound <= 1}
          >
            -
          </button>

          <input
            type="number"
            min={1}
            max={latestRound}
            value={selectedRound}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (!Number.isNaN(value)) setSelectedRound(value);
            }}
            onBlur={() => {
              setSelectedRound((prev) =>
                Math.min(Math.max(prev, 1), latestRound)
              );
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
            }}
            className="min-w-[4.5rem] px-2 py-1 text-center border rounded bg-white tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          <button
            onClick={() =>
              setSelectedRound((prev) => Math.min(prev + 1, latestRound))
            }
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 active:bg-gray-400 transition disabled:opacity-40"
            disabled={selectedRound >= latestRound}
          >
            +
          </button>
        </div>

        <span
          className="text-gray-500 cursor-pointer hover:underline"
          onClick={() => setSelectedRound(latestRound)}
        >
          최신 회차: {latestRound}
        </span>
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
        <div className="min-w-0">
          <DraggableNextRound nextRound={nextRound} most={[]} least={[]} />
        </div>
      )}

      <div className="overflow-visible">{renderResult()}</div>
    </div>
  );
}
