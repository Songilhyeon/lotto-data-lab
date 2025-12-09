"use client";

import { useState } from "react";
import { IfAiRecommendResult } from "@/app/types/api";
import { apiUrl, getLatestRound } from "@/app/utils/getUtils";
import { analysisDivStyle } from "@/app/utils/getDivStyle";
import ComponentHeader from "@/app/components/analyze/ComponentHeader";

export interface NumberScoreDetail {
  num: number;
  final: number;
}

export default function AiRecommend() {
  const currentRound = getLatestRound();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IfAiRecommendResult | null>(null);

  // clusterUnit을 인자로 받아 API에 전달
  const fetchAiRecommend = async (clusterUnit: number = 5) => {
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

    // 🔥 점수 내림차순 정렬
    const sorted = [...scores].sort((a, b) => b.final - a.final);

    const maxScore = Math.max(...sorted.map((s) => s.final));

    return (
      <div className="mt-4 space-y-1">
        <h3 className="font-semibold text-sm text-gray-700">
          🎛 전체 번호 점수 분포 (점수 높은 순 정렬)
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
    if (loading) return <div>추천 번호를 불러오는 중...</div>;
    if (!result) return <div>추천 번호가 없습니다.</div>;

    return (
      <div className="mt-2 p-4 border rounded bg-yellow-50">
        {/* 추천 번호 */}
        <div className="flex gap-2 mb-2">
          {result.recommended.map((n) => (
            <span key={n} className="px-2 py-1 bg-yellow-200 rounded font-bold">
              {n}
            </span>
          ))}
        </div>

        {/* 전체 점수 그래프 */}
        {result.scores && renderFullScoreBars(result.scores)}

        <div className="text-xs text-gray-500 mt-2">
          생성 시간: {result.generatedAt}
        </div>
      </div>
    );
  };

  return (
    <div className={analysisDivStyle("indigo-50", "purple-100")}>
      {/* Header */}
      <ComponentHeader
        title="🛡️ 안전 AI 추천 번호"
        content="데이터가 불완전해도 안전하게 분석하며, 패턴 혼합과 클러스터 강화, k-match 및 최근 빈도까지 반영한 AI 점수 기반 추천 번호입니다."
      />

      <button onClick={() => fetchAiRecommend()}>추천 번호 받기</button>
      <div className="overflow-y-auto max-h-[500px]">{renderResult()}</div>
    </div>
  );
}
