import { useState } from "react";
import {
  NumberScoreDetail,
  IfAiNextFreqRecommendResult,
} from "@/app/types/api";
import { apiUrl, getLatestRound } from "@/app/utils/getUtils";
import { analysisDivStyle } from "@/app/utils/getDivStyle";
import ComponentHeader from "@/app/components/analyze/ComponentHeader";

export default function AiNextRecommend() {
  const start = 1;
  const end = getLatestRound();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IfAiNextFreqRecommendResult | null>(
    null
  );

  // clusterUnit을 인자로 받아 API에 전달
  const fetchAiNextFreq = async (clusterUnit: number = 5) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        clusterUnit: clusterUnit.toString(),
      });
      query.append("start", start.toString());
      query.append("end", end.toString());

      const res = await fetch(
        `${apiUrl}/lotto/premium/recommend-next?${query.toString()}`
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
      <div className="mt-2 p-4 border rounded bg-green-50">
        {/* 추천 번호 */}
        <div className="flex gap-2 mb-2">
          {result.combination.map((n) => (
            <span key={n} className="px-2 py-1 bg-green-200 rounded font-bold">
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
    <div className={analysisDivStyle("green-50", "purple-100")}>
      {/* Header */}
      <ComponentHeader
        title="📊 AI 간단 추천 번호"
        content="최근 회차 데이터와 간단한 패턴, 이전 번호와 다음 번호 연관성을 기반으로 추천 번호를 제공합니다."
      />

      <button onClick={() => fetchAiNextFreq()}>다음 회차 추천 받기</button>
      <div className="overflow-y-auto max-h-[500px]">{renderResult()}</div>
    </div>
  );
}
