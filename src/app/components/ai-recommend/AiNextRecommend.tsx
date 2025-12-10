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

export default function AiNextRecommend() {
  const start = 1; // 전체 회차 분석 고정
  const end = getLatestRound();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IfAiNextFreqRecommendResult | null>(
    null
  );

  // clusterUnit 상태
  const [clusterUnit, setClusterUnit] = useState<number>(5);

  // weight 기본값 (숨김)
  const weights: WeightConfig = {
    hot: 1,
    cold: 1,
    streak: 1,
    pattern: 1,
    cluster: 1,
    random: 1,
    nextFreq: 1,
  };

  // API 요청
  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        clusterUnit: clusterUnit.toString(),
        start: start.toString(),
        end: end.toString(),
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
    } finally {
      setLoading(false);
    }
  };

  // 점수 막대 렌더링
  const renderFullScoreBars = (scores: NumberScoreDetail[]) => {
    if (!scores) return null;

    const sorted = [...scores].sort((a, b) => b.final - a.final);
    const maxScore = Math.max(...sorted.map((s) => s.final));

    return (
      <div className="mt-4 space-y-1">
        <h3 className="font-semibold text-sm text-gray-700">
          🎛 전체 번호 점수 분포 (점수 높은 순)
        </h3>

        {sorted.map((s) => {
          const width = (s.final / maxScore) * 100;
          return (
            <div key={s.num} className="flex items-center gap-2">
              <span className="w-6 text-sm font-bold">{s.num}</span>

              <div className="flex-1 bg-gray-200 h-4 rounded overflow-hidden">
                <div
                  className="bg-blue-500 h-4 rounded"
                  style={{ width: `${width}%` }}
                />
              </div>

              <span className="w-14 text-xs text-gray-600 text-right">
                {s.final.toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  // 결과 렌더링
  const renderResult = () => {
    if (loading) return <div>점수 분석 중...</div>;
    if (!result) return <div>분석 결과가 없습니다.</div>;

    return (
      <div className="mt-2 p-4 border rounded bg-green-50">
        {/* 점수 기반 상위 번호 */}
        <div className="flex gap-2 mb-2 flex-wrap">
          {result.combination.map((n) => (
            <span
              key={n}
              className="w-10 h-10 flex items-center justify-center bg-green-200 rounded-full font-bold"
            >
              {n}
            </span>
          ))}
        </div>

        {/* 전체 점수 그래프 */}
        {result.scores && renderFullScoreBars(result.scores)}
      </div>
    );
  };

  return (
    <div className={analysisDivStyle("green-50", "purple-100")}>
      {/* Header */}
      <ComponentHeader
        title="📊 다음 회차 기반 모델"
        content="최근 회차 번호와 과거 출현 패턴을 분석하여, 다음 회차에 나올 가능성이 높은 번호를 점수화합니다."
      />

      {/* clusterUnit 선택 */}
      <ClusterUnitSelector
        clusterUnit={clusterUnit}
        setClusterUnit={setClusterUnit}
      />

      <button
        onClick={fetchAnalysis}
        className="bg-green-500 text-white px-3 py-1 rounded mb-4 hover:bg-green-600 active:bg-green-700 transition-colors"
      >
        점수 분석 실행
      </button>

      <div className="overflow-y-auto max-h-[1200px]">{renderResult()}</div>
    </div>
  );
}
