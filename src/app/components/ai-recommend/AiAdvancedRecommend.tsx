"use client";

import React, { useState } from "react";
import { apiUrl, getLatestRound } from "@/app/utils/getUtils";
import {
  IfAiRecommendation,
  WeightConfig,
  AiPreset,
  AiPresets,
  AiScoreBase,
} from "@/app/types/api";
import { componentBodyDivStyle } from "@/app/utils/getDivStyle";
import ComponentHeader from "@/app/components/ComponentHeader";
import ClusterUnitSelector from "@/app/components/ai-recommend/ClusterUnitSelector";
import WeightSliderGroup from "@/app/components/ai-recommend/WeightSliderGroup";
import { LottoDraw } from "@/app/types/lottoNumbers";
import DraggableNextRound from "@/app/components/DraggableNextRound";
import LottoBall from "../LottoBall";
import ScoreBarList from "@/app/components/ai-recommend/ScoreBarList";
import AiScoreExplainCard from "@/app/components/ai-recommend/AiScoreExplainCard";
import useRequestDedup from "@/app/hooks/useRequestDedup";

type AdvancedDedupParams = {
  round: number;
  presetName: string;
  clusterUnit: number;
  customWeights: {
    hot: number;
    cold: number;
    streak: number;
    pattern: number;
    cluster: number;
    random: number;
    nextFreq: number;
  };
};

export default function AiAdvancedRecommend() {
  const latestRound = getLatestRound();

  const [selectedRound, setSelectedRound] = useState<number>(latestRound);
  const [preset, setPreset] = useState<AiPreset>(AiPresets[0]);
  const [clusterUnit, setClusterUnit] = useState<number>(7);
  const [result, setResult] = useState<IfAiRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [weights, setWeights] = useState<WeightConfig>({ ...preset.weight });
  const [nextRound, setNextRound] = useState<LottoDraw | null>(null);
  const [scoreMode, setScoreMode] = useState<"raw" | "normalized">(
    "normalized"
  );
  const [selectedScore, setSelectedScore] = useState<AiScoreBase | null>(null);

  const { begin, commit, rollback } = useRequestDedup<AdvancedDedupParams>();

  const handlePresetChange = (presetName: string) => {
    const selectedPreset = AiPresets.find((p) => p.name === presetName);
    if (!selectedPreset) return;
    setPreset(selectedPreset);
    setWeights({ ...selectedPreset.weight });
  };

  const handleResetWeights = () => {
    setWeights({ ...preset.weight });
  };

  const fetchAnalysis = async (force = false) => {
    const dedupParams: AdvancedDedupParams = {
      round: selectedRound,
      presetName: preset.name,
      clusterUnit,
      customWeights: {
        hot: weights.hot,
        cold: weights.cold,
        streak: weights.streak,
        pattern: weights.pattern,
        cluster: weights.cluster,
        random: weights.random,
        nextFreq: weights.nextFreq,
      },
    };

    const attempt = begin(dedupParams, force);
    if (!attempt.ok) return;

    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/lotto/premium/recommend-advanced`, {
        method: "POST",
        credentials: "include", // ✅ auth 걸어둔 상태면 필수
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          round: selectedRound,
          presetName: preset.name,
          clusterUnit,
          seed: Date.now(), // ✅ 서버용 seed (dedup 비교엔 미포함)
          customWeights: weights,
        }),
      });

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      const data: IfAiRecommendation = await res.json();
      setResult(data);
      setNextRound(data.nextRound || null);

      commit(attempt.key); // ✅ 성공 확정
    } catch (err) {
      console.error(err);
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
      <div className="mt-2 p-4 border rounded bg-green-50">
        <h3 className="font-bold mb-2">분석 점수 TOP6 번호</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {result.combination.map((n) => (
            <LottoBall key={n} number={n} size="lg" />
          ))}
        </div>

        {result.scores && (
          <ScoreBarList
            scores={result.scores}
            mode={scoreMode}
            hitNumberSet={hitNumberSet}
            bonusNumber={bonusNumber}
            onSelect={setSelectedScore}
          />
        )}
      </div>
    );
  };

  return (
    <div className={`${componentBodyDivStyle()} from-pink-50 to-indigo-100`}>
      <ComponentHeader
        title="🤖 심층 모델"
        content={`7가지 분석 가중치를 직접 조절하는 맞춤형 AI 모델.
회차를 선택하여 과거 회차에 어떤 번호가 당첨 되었는지 분석할 수 있습니다.`}
      />

      <h2 className="text-lg sm:text-xl font-bold mb-4">
        Preset & 가중치 설정
      </h2>

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

      <div className="flex gap-2 mb-2">
        <button
          onClick={() => fetchAnalysis(false)}
          className="bg-green-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded mb-4 w-full sm:w-auto font-medium shadow-md hover:bg-green-600 active:scale-95"
        >
          점수 분석 실행
        </button>

        {/* ✅ 같은 params라도 “강제 재실행” */}
        {/* <button
          onClick={() => fetchAnalysis(true)}
          className="bg-gray-200 px-4 py-2 sm:px-6 sm:py-3 rounded mb-4 w-full sm:w-auto font-medium shadow-md hover:bg-gray-300"
        >
          강제 새로고침
        </button> */}

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

      {selectedScore && <AiScoreExplainCard score={selectedScore} />}
      <div className="overflow-y-auto max-h-[80vh]">{renderResult()}</div>
    </div>
  );
}
