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

export default function AiRecommend() {
  const latestRound = getLatestRound();
  const [selectedRound, setSelectedRound] = useState<number>(latestRound);
  const [clusterUnit, setClusterUnit] = useState<number>(7);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IfAiRecommendResult | null>(null);
  const [nextRound, setNextRound] = useState<LottoDraw | null>(null);

  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${apiUrl}/lotto/premium/recommend?round=${selectedRound}&clusterUnit=${clusterUnit}`
      );
      const json = await res.json();
      setResult(json.result);
      setNextRound(json.result.nextRound);
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
        {/* 점수 기반 상위 번호 */}
        <div className="flex flex-wrap gap-2 mb-2">
          {result.recommended.map((n) => (
            <LottoBall key={n} number={n} size="lg" />
          ))}
        </div>

        {/* 전체 점수 그래프 */}
        {result.scores && (
          <ScoreBarList
            scores={result.scores}
            hitNumberSet={hitNumberSet}
            bonusNumber={bonusNumber}
          />
        )}
      </div>
    );
  };

  return (
    <div className={`${componentBodyDivStyle()} from-pink-50 to-indigo-100`}>
      {/* Header */}
      <ComponentHeader
        title="🛡️ 기본 모델"
        content={`가장 많이 나온 번호, 자주 함께 등장한 조합, 번호 그룹 경향 등 기본적인 통계만으로 안정적으로 점수를 계산하는 모델입니다.
                  회차를 선택하여 과거 회차에 어떤 번호가 당첨 되었는지 분석할 수 있습니다.`}
      />

      {/* clusterUnit 선택 */}
      <ClusterUnitSelector
        clusterUnit={clusterUnit}
        setClusterUnit={setClusterUnit}
      />

      {/* 회차 선택 */}
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

      {/* 분석 실행 버튼 */}
      <button
        onClick={fetchAnalysis}
        className="bg-green-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded mb-4 w-full sm:w-auto text-sm sm:text-base font-medium shadow-md hover:bg-green-600"
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
