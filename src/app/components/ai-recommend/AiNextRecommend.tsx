"use client";

import { useState } from "react";
import { IfAiNextFreqRecommendResult, WeightConfig } from "@/app/types/api";
import { apiUrl, getLatestRound } from "@/app/utils/getUtils";
import { componentBodyDivStyle } from "@/app/utils/getDivStyle";
import ComponentHeader from "@/app/components/ComponentHeader";
import ClusterUnitSelector from "@/app/components/ai-recommend/ClusterUnitSelector";
import { LottoDraw } from "@/app/types/lottoNumbers";
import DraggableNextRound from "@/app/components/DraggableNextRound";
import LottoBall from "../LottoBall";
import ScoreBarList from "@/app/components/ai-recommend/ScoreBarList";

export default function AiNextRecommend() {
  const latestRound = getLatestRound(); // 최신 회차
  const [selectedRound, setSelectedRound] = useState<number>(latestRound); // 분석 회차
  const [clusterUnit, setClusterUnit] = useState<number>(7);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IfAiNextFreqRecommendResult | null>(
    null
  );
  const [nextRound, setNextRound] = useState<LottoDraw | null>(null);
  const [scoreMode, setScoreMode] = useState<"raw" | "normalized">(
    "normalized"
  );

  // weight 기본값
  const weights: WeightConfig = {
    hot: 1,
    cold: 0.5,
    streak: 1,
    pattern: 1,
    cluster: 0.5,
    random: 1,
    nextFreq: 5, // 🎯 50% 비중! (다른 모든 것의 합보다 큼)
  };

  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        clusterUnit: clusterUnit.toString(),
        start: selectedRound.toString(),
        end: selectedRound.toString(),
        hot: weights.hot.toString(),
        cold: weights.cold.toString(),
        streak: weights.streak.toString(),
        pattern: weights.pattern.toString(),
        cluster: weights.cluster.toString(),
        random: weights.random.toString(),
        nextFreq: weights.nextFreq.toString(),
      });

      const res = await fetch(
        `${apiUrl}/lotto/premium/recommend-next?${query.toString()}`
      );
      const json = await res.json();
      setResult(json.result);
      setNextRound(json.result?.nextRound);
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------
   * nextRound 강조 정보
   * ----------------------------- */
  const hitNumberSet = nextRound ? new Set<number>(nextRound.numbers) : null;

  const bonusNumber = nextRound?.bonus;

  /* -----------------------------
   * 결과 렌더링
   * ----------------------------- */
  const renderResult = () => {
    if (loading) return <div>점수 분석 중...</div>;
    if (!result) return <div>분석 결과가 없습니다.</div>;

    return (
      <div className="mt-2 p-4 border rounded bg-green-50">
        {/* 추천 번호 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {result.combination.map((n) => (
            <LottoBall key={n} number={n} size="lg" />
          ))}
        </div>

        {/* 점수 바 */}
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
    <div className={`${componentBodyDivStyle()} from-green-50 to-purple-100`}>
      {/* Header */}
      <ComponentHeader
        title="📊 다음 회차 기반 모델"
        content={`번호 간 '이어짐 패턴'을 분석하여, 이전 회차에서 다음 회차로 이어질 가능성이 높은 번호를 점수화한 AI 모델. 
                  회차를 선택하여 과거 회차에 어떤 번호가 당첨 되었는지 분석할 수 있습니다.`}
      />

      {/* clusterUnit 선택 */}
      <ClusterUnitSelector
        clusterUnit={clusterUnit}
        setClusterUnit={setClusterUnit}
      />

      {/* 회차 선택 UI */}
      <div className="mb-4 flex items-center gap-2">
        <label className="font-medium text-gray-700">회차 선택:</label>

        <div className="flex items-center gap-1">
          {/* 이전 회차 */}
          <button
            onClick={() => setSelectedRound((prev) => Math.max(prev - 1, 1))}
            className="
              px-2 py-1 bg-gray-200 rounded
              hover:bg-gray-300 active:bg-gray-400
              transition disabled:opacity-40
            "
            disabled={selectedRound <= 1}
          >
            -
          </button>

          {/* 회차 직접 입력 */}
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
            className="
              min-w-[4.5rem]
              px-2 py-1
              text-center
              border rounded
              bg-white
              tabular-nums
              focus:outline-none focus:ring-2 focus:ring-blue-300
            "
          />

          {/* 다음 회차 */}
          <button
            onClick={() =>
              setSelectedRound((prev) => Math.min(prev + 1, latestRound))
            }
            className="
              px-2 py-1 bg-gray-200 rounded
              hover:bg-gray-300 active:bg-gray-400
              transition disabled:opacity-40
            "
            disabled={selectedRound >= latestRound}
          >
            +
          </button>
        </div>

        {/* 최신 회차 클릭하면 적용 */}
        <span
          className="text-gray-500 cursor-pointer hover:underline"
          onClick={() => setSelectedRound(latestRound)}
        >
          최신 회차: {latestRound}
        </span>
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
        <div className="min-w-0">
          {/* DraggableNextRound는 내부에서 고정 포지셔닝을 처리함 */}
          <DraggableNextRound nextRound={nextRound} most={[]} least={[]} />
        </div>
      )}

      {/* 결과 영역 */}
      <div className="overflow-y-auto max-h-[80vh]">{renderResult()}</div>
    </div>
  );
}
