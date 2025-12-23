"use client";

import { AiScoreBase } from "@/app/types/api";

interface Props {
  score: AiScoreBase;
}

function value(v?: number, digits = 2) {
  return typeof v === "number" ? v.toFixed(digits) : "-";
}

export default function AiScoreExplainCard({ score }: Props) {
  return (
    <div className="mt-4 p-4 rounded-xl bg-white shadow border">
      <h4 className="font-bold mb-3 text-gray-800">
        🔍 번호 {score.num} 점수 분석
      </h4>

      <ul className="text-sm space-y-1.5 text-gray-700">
        {score.hot !== undefined && (
          <li>🔥 출현 빈도 점수: {value(score.hot)}</li>
        )}

        {score.cold !== undefined && (
          <li>❄️ 비출현(콜드) 점수: {value(score.cold)}</li>
        )}

        {(score.streakRun !== undefined || score.streak !== undefined) && (
          <li>📈 연속 출현 지표: {value(score.streakRun ?? score.streak)}</li>
        )}

        {(score.patternScore !== undefined || score.pattern !== undefined) && (
          <li>🧩 패턴 점수: {value(score.patternScore ?? score.pattern)}</li>
        )}

        {(score.density !== undefined || score.cluster !== undefined) && (
          <li>🧱 구간/밀집도 점수: {value(score.density ?? score.cluster)}</li>
        )}

        {score.decayScore !== undefined && (
          <li>⏳ 최근 회차 가중치: {value(score.decayScore)}</li>
        )}

        {score.nextFreq !== undefined && (
          <li>➡️ 다음 회차 연관성: {value(score.nextFreq)}</li>
        )}

        {score.noise !== undefined && (
          <li>🎲 랜덤 요소 영향: {value(score.noise)}</li>
        )}
      </ul>

      <div className="mt-3 pt-2 border-t text-xs text-gray-500 space-y-1">
        <p>
          • 내부 계산 점수: <b>{value(score.finalRaw)}</b>
        </p>
        <p>
          • 비교용 점수 (0~100): <b>{value(score.final)}</b>
        </p>
        <p className="mt-1">
          * 본 점수는 과거 데이터 기반 분석 결과이며, 당첨을 보장하지 않습니다.
        </p>
      </div>
    </div>
  );
}
