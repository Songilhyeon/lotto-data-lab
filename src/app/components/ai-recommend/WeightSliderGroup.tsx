// components/WeightSliderGroup.tsx
"use client";

import React from "react";
import { WeightConfig } from "@/app/types/api";

interface WeightSliderGroupProps {
  weights: WeightConfig;
  setWeights: (newWeights: WeightConfig) => void;
  labels?: Partial<Record<keyof WeightConfig, string>>;
}

const defaultLabels: Record<keyof WeightConfig, string> = {
  hot: "최근 자주 나온 번호 영향",
  cold: "오랫동안 안 나온 번호 영향",
  streak: "연속 번호 패턴 영향",
  pattern: "패턴 조합 영향",
  cluster: "번호 그룹/클러스터 영향",
  random: "무작위 요소 영향",
  nextFreq: "이전 → 다음 번호 연관성 영향",
};

const WeightSliderGroup: React.FC<WeightSliderGroupProps> = ({
  weights,
  setWeights,
  labels = {},
}) => {
  const weightLabels = { ...defaultLabels, ...labels };

  const handleWeightChange = (key: keyof WeightConfig, value: number) => {
    setWeights({ ...weights, [key]: value });
  };

  // const handleReset = () => {
  //   const resetWeights: WeightConfig = Object.keys(weights).reduce(
  //     (acc, key) => ({ ...acc, [key]: 1 }),
  //     {} as WeightConfig
  //   );
  //   setWeights(resetWeights);
  // };

  return (
    <div className="mb-4 space-y-2">
      {/* <div className="flex justify-end mb-2">
        <button
          onClick={handleReset}
          className="
    bg-gray-300 text-gray-800 px-2 py-1 rounded text-sm
    hover:bg-gray-400 hover:text-white
    active:bg-gray-500 active:text-white
    transition-colors duration-150
  "
        >
          가중치 초기화
        </button>
      </div> */}
      {(Object.keys(weights) as (keyof WeightConfig)[]).map((key) => (
        <div key={key} className="flex items-center gap-2">
          <label className="w-52 font-semibold">
            {weightLabels[key]}: {weights[key].toFixed(1)}
          </label>
          <input
            type="range"
            min={0}
            max={5}
            step={0.1}
            value={weights[key]}
            onChange={(e) => handleWeightChange(key, Number(e.target.value))}
            className="flex-1"
          />
        </div>
      ))}
    </div>
  );
};

export default WeightSliderGroup;
