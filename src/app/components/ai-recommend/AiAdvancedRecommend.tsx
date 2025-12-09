// components/AiRecommendationPanel.tsx
"use client";

import React, { useState } from "react";
import { apiUrl, getLatestRound } from "@/app/utils/getUtils";
import { IfAiRecommendation } from "@/app/types/api"; // types 정의
import { analysisDivStyle } from "@/app/utils/getDivStyle";
import ComponentHeader from "@/app/components/analyze/ComponentHeader";

export interface NumberScoreDetail {
  num: number;
  final: number;
}

const PRESETS = ["안정형", "고위험형", "패턴형"] as const;

export default function AiAdvancedRecommend() {
  const round = getLatestRound();
  const [preset, setPreset] = useState<(typeof PRESETS)[number]>("안정형");
  const [seed, setSeed] = useState<number>(Date.now());
  const [result, setResult] = useState<IfAiRecommendation | null>(null);
  const [loading, setLoading] = useState(false);

  // slider 기반 가중치 예시 (총 3개만)
  const [hotWeight, setHotWeight] = useState<number>(1);
  const [coldWeight, setColdWeight] = useState<number>(1);
  const [patternWeight, setPatternWeight] = useState<number>(1);

  const fetchRecommendation = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/lotto/premium/recommend-advanced`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          round,
          presetName: preset,
          clusterUnit: 5,
          seed,
          customWeights: {
            hot: hotWeight,
            cold: coldWeight,
            pattern: patternWeight,
          },
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

  return (
    <div className={analysisDivStyle("blue-50", "cyan-100")}>
      {/* Header */}
      <ComponentHeader
        title="🤖 AI 정밀 추천 번호"
        content="과거 회차 패턴, k-match, 버킷 분석, 최근 회차 빈도를 종합하여 가장 가능성이 높은 번호를 추천합니다."
      />
      <h2 className="text-xl font-bold mb-4">AI 추천 번호 (회차 {round})</h2>

      <div className="mb-4">
        <label className="mr-2 font-semibold">Preset:</label>
        <select
          value={preset}
          onChange={(e) =>
            setPreset(e.target.value as (typeof PRESETS)[number])
          }
          className="border px-2 py-1 rounded"
        >
          {PRESETS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <button
          onClick={() => setSeed(Date.now())}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          🔄 랜덤 시드 갱신
        </button>
      </div>

      {/* Slider 기반 가중치 */}
      <div className="mb-4">
        <div className="mb-2">
          <label>Hot Weight: {hotWeight}</label>
          <input
            type="range"
            min={0}
            max={5}
            step={0.1}
            value={hotWeight}
            onChange={(e) => setHotWeight(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="mb-2">
          <label>Cold Weight: {coldWeight}</label>
          <input
            type="range"
            min={0}
            max={5}
            step={0.1}
            value={coldWeight}
            onChange={(e) => setColdWeight(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="mb-2">
          <label>Pattern Weight: {patternWeight}</label>
          <input
            type="range"
            min={0}
            max={5}
            step={0.1}
            value={patternWeight}
            onChange={(e) => setPatternWeight(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <button
        onClick={fetchRecommendation}
        className="bg-green-500 text-white px-3 py-1 rounded mb-4"
      >
        추천 번호 생성
      </button>

      {loading && <p>추천 번호 생성 중...</p>}

      {result && (
        <div>
          <h3 className="font-semibold mb-2">추천 조합:</h3>
          <div className="flex gap-2 mb-4">
            {result.combination.map((n) => (
              <span
                key={n}
                className="w-10 h-10 flex items-center justify-center bg-yellow-200 rounded-full font-bold"
              >
                {n}
              </span>
            ))}
          </div>

          <h3 className="font-semibold mb-2">전체 점수:</h3>
          <div className="grid grid-cols-5 gap-2">
            {result.scores.map((s) => (
              <div key={s.num} className="text-center border p-1 rounded">
                <div className="font-bold">{s.num}</div>
                <div className="text-xs">{s.final.toFixed(1)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
