"use client";

import React, { useState } from "react";
import { apiUrl, getLatestRound } from "@/app/utils/getUtils";
import {
  IfAiRecommendation,
  WeightConfig,
  AiPreset,
  AiPresets,
} from "@/app/types/api";
import { componentBodyDivStyle } from "@/app/utils/getDivStyle";
import ComponentHeader from "@/app/components/ComponentHeader";
import ClusterUnitSelector from "@/app/components/ai-recommend/ClusterUnitSelector";
import WeightSliderGroup from "@/app/components/ai-recommend/WeightSliderGroup";
import { LottoDraw } from "@/app/types/lottoNumbers";
import DraggableNextRound from "@/app/components/DraggableNextRound";
import LottoBall from "../LottoBall";
import ScoreBarList from "@/app/components/ai-recommend/ScoreBarList";

export default function AiAdvancedRecommend() {
  const latestRound = getLatestRound();

  const [selectedRound, setSelectedRound] = useState<number>(latestRound);
  const [preset, setPreset] = useState<AiPreset>(AiPresets[0]);
  const [clusterUnit, setClusterUnit] = useState<number>(7);
  const [result, setResult] = useState<IfAiRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [weights, setWeights] = useState<WeightConfig>({ ...preset.weight });
  const [nextRound, setNextRound] = useState<LottoDraw | null>(null);

  /* -----------------------------
   * Preset / Weight
   * ----------------------------- */
  const handlePresetChange = (presetName: string) => {
    const selectedPreset = AiPresets.find((p) => p.name === presetName);
    if (!selectedPreset) return;
    setPreset(selectedPreset);
    setWeights({ ...selectedPreset.weight });
  };

  const handleResetWeights = () => {
    setWeights({ ...preset.weight });
  };

  /* -----------------------------
   * Fetch
   * ----------------------------- */
  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/lotto/premium/recommend-advanced`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          round: selectedRound,
          presetName: preset.name,
          clusterUnit,
          seed: Date.now(),
          customWeights: weights,
        }),
      });

      const data: IfAiRecommendation = await res.json();
      setResult(data);
      setNextRound(data.nextRound || null);
    } catch (err) {
      console.error(err);
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
            hitNumberSet={hitNumberSet}
            bonusNumber={bonusNumber}
          />
        )}
      </div>
    );
  };

  /* -----------------------------
   * Render
   * ----------------------------- */
  return (
    <div className={`${componentBodyDivStyle()} from-pink-50 to-indigo-100`}>
      <ComponentHeader
        title="🤖 AI 기반 심층 점수 분석"
        content={`과거 당첨 흐름, 번호가 겹치는 정도, 번호 구간별 특징, 최근에 자주 나온 번호 등을 모두 활용하여 각 번호를 점수화 합니다.
회차를 선택하여 과거 회차에 어떤 번호가 당첨 되었는지 분석할 수 있습니다.`}
      />

      <h2 className="text-lg sm:text-xl font-bold mb-4">
        Preset & 가중치 설정
      </h2>

      {/* Preset */}
      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="font-semibold">Preset:</label>
          <select
            value={preset.name}
            onChange={(e) => handlePresetChange(e.target.value)}
            className="border px-2 py-1 rounded w-full sm:w-auto"
          >
            {AiPresets.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleResetWeights}
          className="bg-gray-300 text-gray-800 px-2 py-1 rounded text-sm hover:bg-gray-400 active:bg-gray-500 w-full sm:w-auto"
        >
          가중치 초기화
        </button>
      </div>

      <ClusterUnitSelector
        clusterUnit={clusterUnit}
        setClusterUnit={setClusterUnit}
      />

      <WeightSliderGroup weights={weights} setWeights={setWeights} />

      {/* 회차 선택 */}
      <div className="mb-4 flex items-center gap-2">
        <label className="font-medium text-gray-700">회차 선택:</label>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setSelectedRound((p) => Math.max(p - 1, 1))}
            disabled={selectedRound <= 1}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            -
          </button>

          <input
            type="number"
            min={1}
            max={latestRound}
            value={selectedRound}
            onChange={(e) => setSelectedRound(Number(e.target.value))}
            className="min-w-[4.5rem] px-2 py-1 text-center border rounded"
          />

          <button
            onClick={() =>
              setSelectedRound((p) => Math.min(p + 1, latestRound))
            }
            disabled={selectedRound >= latestRound}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
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

      {/* 실행 */}
      <button
        onClick={fetchAnalysis}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        점수 분석 실행
      </button>

      {nextRound && (
        <div className="min-w-0">
          <DraggableNextRound nextRound={nextRound} most={[]} least={[]} />
        </div>
      )}

      <div className="overflow-y-auto max-h-[80vh]">{renderResult()}</div>
    </div>
  );
}
