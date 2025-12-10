"use client";

import { useState } from "react";
import { IfAiRecommendResult } from "@/app/types/api";
import { apiUrl, getLatestRound } from "@/app/utils/getUtils";
import { analysisDivStyle } from "@/app/utils/getDivStyle";
import ComponentHeader from "@/app/components/ComponentHeader";
import ClusterUnitSelector from "@/app/components/ai-recommend/ClusterUnitSelector";

export interface NumberScoreDetail {
  num: number;
  final: number;
}

export default function AiRecommend() {
  const currentRound = getLatestRound();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IfAiRecommendResult | null>(null);
  const [clusterUnit, setClusterUnit] = useState<number>(5); // clusterUnit 상태

  // clusterUnit을 인자로 받아 API에 전달
  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${apiUrl}/lotto/premium/recommend?round=${currentRound}&clusterUnit=${clusterUnit}`
      );
      const json = await res.json();
      setResult(json.result);
    } finally {
      setLoading(false);
    }
  };

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

  const renderResult = () => {
    if (loading) return <div>점수 분석 중...</div>;
    if (!result) return <div>분석 결과가 없습니다.</div>;

    return (
      <div className="mt-2 p-4 border rounded bg-yellow-50">
        {/* 점수 기반 상위 번호 */}
        <div className="flex gap-2 mb-2">
          {result.recommended.map((n) => (
            <span key={n} className="px-2 py-1 bg-yellow-200 rounded font-bold">
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
    <div className={analysisDivStyle("indigo-50", "purple-100")}>
      {/* Header */}
      <ComponentHeader
        title="🛡️ 기본 모델"
        content="과거 회차 데이터를 기반으로, 자주 나온 번호, 번호 조합 패턴, 그룹화 경향, 최근 추세까지 종합하여 각 번호의 점수를 계산합니다."
      />

      {/* clusterUnit 선택 */}
      {/* clusterUnit 선택 */}
      <ClusterUnitSelector
        clusterUnit={clusterUnit}
        setClusterUnit={setClusterUnit}
      />

      <button
        onClick={fetchAnalysis}
        className="bg-green-500 text-white px-3 py-1 rounded mb-4"
      >
        점수 분석 실행
      </button>

      <div className="overflow-y-auto max-h-[1200px]">{renderResult()}</div>
    </div>
  );
}
