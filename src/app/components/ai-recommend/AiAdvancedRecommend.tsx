"use client";

import React, { useState } from "react";
import { apiUrl, getLatestRound } from "@/app/utils/getUtils";
import {
  IfAiRecommendation,
  NumberScoreDetail,
  WeightConfig,
  AiPreset,
  AiPresets,
} from "@/app/types/api";
import { analysisDivStyle } from "@/app/utils/getDivStyle";
import ComponentHeader from "@/app/components/ComponentHeader";
import ClusterUnitSelector from "@/app/components/ai-recommend/ClusterUnitSelector";
import WeightSliderGroup from "@/app/components/ai-recommend/WeightSliderGroup";

export default function AiAdvancedRecommend() {
  const round = getLatestRound();

  const [preset, setPreset] = useState<AiPreset>(AiPresets[0]);
  const [clusterUnit, setClusterUnit] = useState<number>(5);
  const [result, setResult] = useState<IfAiRecommendation | null>(null);
  const [loading, setLoading] = useState(false);

  const [weights, setWeights] = useState<WeightConfig>({ ...preset.weight });

  const handlePresetChange = (presetName: string) => {
    const selectedPreset = AiPresets.find((p) => p.name === presetName);
    if (!selectedPreset) return;
    setPreset(selectedPreset);
    setWeights({ ...selectedPreset.weight });
  };

  const handleResetWeights = () => {
    setWeights({ ...preset.weight });
  };

  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/lotto/premium/recommend-advanced`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          round,
          presetName: preset.name,
          clusterUnit,
          seed: Date.now(),
          customWeights: weights,
        }),
      });
      const data: IfAiRecommendation = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
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
        <div className="flex flex-wrap gap-2 mb-4">
          {result.combination.map((n) => (
            <span
              key={n}
              className="w-10 h-10 flex items-center justify-center bg-yellow-200 rounded-full font-bold text-sm sm:text-base"
            >
              {n}
            </span>
          ))}
        </div>
        {result.scores && renderFullScoreBars(result.scores)}
      </div>
    );
  };

  return (
    <div className={analysisDivStyle("blue-50", "cyan-100")}>
      <ComponentHeader
        title="🤖 AI 기반 심층 점수 분석"
        content="과거 회차 패턴, k-match, 버킷 분석, 최근 회차 빈도를 종합하여 점수 기반 상위 번호 조합을 제공합니다."
      />

      <h2 className="text-lg sm:text-xl font-bold mb-4">
        Preset & Weight 설정
      </h2>

      {/* Preset 선택 */}
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

      {/* ClusterUnitSelector */}
      <ClusterUnitSelector
        clusterUnit={clusterUnit}
        setClusterUnit={setClusterUnit}
      />

      {/* WeightSliderGroup */}
      <WeightSliderGroup weights={weights} setWeights={setWeights} />

      {/* 분석 실행 버튼 */}
      <button
        onClick={fetchAnalysis}
        className="bg-green-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded mb-4 w-full sm:w-auto font-medium shadow-md hover:bg-green-600 active:bg-green-700 transition-colors"
      >
        점수 분석 실행
      </button>

      <div className="overflow-y-auto max-h-[80vh]">{renderResult()}</div>
    </div>
  );
}
