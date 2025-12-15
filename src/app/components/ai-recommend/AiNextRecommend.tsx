"use client";

import { useState } from "react";
import {
  NumberScoreDetail,
  IfAiNextFreqRecommendResult,
  WeightConfig,
} from "@/app/types/api";
import { apiUrl, getLatestRound } from "@/app/utils/getUtils";
import { analysisDivStyle } from "@/app/utils/getDivStyle";
import ComponentHeader from "@/app/components/ComponentHeader";
import ClusterUnitSelector from "@/app/components/ai-recommend/ClusterUnitSelector";
import { LottoDraw } from "@/app/types/lottoNumbers";
import DraggableNextRound from "@/app/components/DraggableNextRound";
import LottoBall from "../LottoBall";

export default function AiNextRecommend() {
  const latestRound = getLatestRound(); // 최신 회차
  const [selectedRound, setSelectedRound] = useState<number>(latestRound); // 분석 회차
  const [clusterUnit, setClusterUnit] = useState<number>(5);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IfAiNextFreqRecommendResult | null>(
    null
  );
  const [nextRound, setNextRound] = useState<LottoDraw | null>(null);

  // weight 기본값
  const weights: WeightConfig = {
    hot: 1,
    cold: 1,
    streak: 1,
    pattern: 1,
    cluster: 1,
    random: 1,
    nextFreq: 1,
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

  const renderFullScoreBars = (scores: NumberScoreDetail[]) => {
    if (!scores) return null;

    const sorted = [...scores].sort((a, b) => b.final - a.final);
    const maxScore = Math.max(...sorted.map((s) => s.final));

    return (
      <div className="mt-4 space-y-2">
        <h3 className="font-semibold text-sm sm:text-base text-gray-700">
          🎛 전체 번호 점수 분포 (점수 높은 순)
        </h3>

        {sorted.map((s) => {
          const width = (s.final / maxScore) * 100;
          return (
            <div key={s.num} className="flex items-center gap-2 sm:gap-3">
              <span className="w-6 text-sm sm:text-base font-bold">
                {s.num}
              </span>
              <div className="flex-1 bg-gray-200 h-4 rounded overflow-hidden">
                <div
                  className="bg-blue-500 h-4 rounded"
                  style={{ width: `${width}%` }}
                />
              </div>
              <span className="w-14 text-xs sm:text-sm text-gray-600 text-right">
                {s.final.toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderResult = () => {
    if (loading) return <div>점수 분석 중...</div>;
    if (!result) return <div>분석 결과가 없습니다.</div>;

    return (
      <div className="mt-2 p-4 border rounded bg-green-50">
        {/* 점수 기반 상위 번호 */}
        <div className="flex flex-wrap gap-2 mb-2">
          {result.combination.map((n) => (
            <LottoBall key={n} number={n} size="lg" />
          ))}
        </div>

        {/* 전체 점수 그래프 */}
        {result.scores && renderFullScoreBars(result.scores)}
      </div>
    );
  };

  return (
    <div className={`${analysisDivStyle()} from-green-50 to-purple-100`}>
      {/* Header */}
      <ComponentHeader
        title="📊 다음 회차 기반 모델"
        content={`이전 회차 번호가 다음 회차에 어떤 번호로 이어졌는지 분석하여 각 번호를 점수화하는 모델입니다. 
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
          {/* 이전 회차 버튼 */}
          <button
            onClick={() => setSelectedRound((prev) => Math.max(prev - 1, 1))}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
            disabled={selectedRound <= 1}
          >
            -
          </button>

          {/* 현재 선택 회차 */}
          <span className="w-16 text-center border px-2 py-1 rounded bg-white">
            {selectedRound}
          </span>

          {/* 다음 회차 버튼 */}
          <button
            onClick={() =>
              setSelectedRound((prev) => Math.min(prev + 1, latestRound))
            }
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
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

      {/* 분석 실행 버튼 */}
      <button
        onClick={fetchAnalysis}
        className="bg-green-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded mb-4 w-full sm:w-auto text-sm sm:text-base font-medium shadow-md hover:bg-green-600 active:bg-green-700 transition-colors"
      >
        점수 분석 실행
      </button>

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
