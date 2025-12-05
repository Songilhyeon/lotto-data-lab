"use client";

import React, { useState, useRef, useMemo } from "react";
import { useAuth } from "@/app/context/authContext";
import { apiUrl, getLatestRound } from "@/app/utils/getUtils";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartTooltip,
  Cell,
} from "recharts";
import LottoBall from "@/app/components/LottoBall";

interface PremiumAnalysisData {
  round: number;
  perNumberNextFreq: Record<number, Record<number, number>>;
  kMatchNextFreq: Record<string, Record<number, number>>;
  pattern10NextFreq: { patternKey: string; freq: Record<number, number> };
  pattern7NextFreq: { patternKey: string; freq: Record<number, number> };
  recentFreq: Record<number, number>;
  generatedAt: string;
  nextRound?: {
    round: number;
    numbers: number[];
    bonus?: number;
  };
}

// ----------------- 차트 컴포넌트 최적화 -----------------
interface FreqChartProps {
  record?: Record<number, number>;
  title?: React.ReactNode;
  color?: string;
  height?: number;
}
// 1️⃣ 먼저 이름 있는 컴포넌트 정의
const FreqChartComponent = ({
  record,
  title,
  color = "#3b82f6",
  height = 200,
}: FreqChartProps) => {
  const chartData = useMemo(() => {
    if (!record) return [];
    return Object.entries(record).map(([num, freq]) => ({
      number: Number(num),
      count: freq,
    }));
  }, [record]);

  if (!record) return null;

  const maxValue = Math.max(...chartData.map((d) => d.count));
  const minValue = Math.min(...chartData.map((d) => d.count)); // (원하면 사용)

  return (
    <div className="mb-4">
      <strong>{title}</strong>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={chartData}>
          <XAxis dataKey="number" />
          <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
          <RechartTooltip />

          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {chartData.map((d, index) => {
              // 강조 규칙
              const isMax = d.count === maxValue;
              const isMin = d.count === minValue; // (사용 선택)

              let barColor = color;

              if (isMax) barColor = "#ef4444"; // (최댓값 강조)
              if (isMin) barColor = "#facc15"; // (최솟값 강조) ← 선택

              return <Cell key={index} fill={barColor} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const FreqChart = React.memo(FreqChartComponent);

// ----------------- 메인 컴포넌트 -----------------
export default function PremiumAnalysis() {
  const latest = getLatestRound();
  const [round, setRound] = useState(latest);
  const [recentCount, setRecentCount] = useState(10);
  const [bonusIncluded, setBonusIncluded] = useState(false);
  const [result, setResult] = useState<PremiumAnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const prevParamsRef = useRef({
    round: -1,
    recentCount: -1,
    bonusIncluded: !bonusIncluded,
  });

  const fetchData = async () => {
    const prev = prevParamsRef.current;
    if (
      prev.round === round &&
      prev.recentCount === recentCount &&
      prev.bonusIncluded === bonusIncluded
    )
      return;

    if (!user || user.role !== "PREMIUM") {
      setError("프리미엄 사용자만 이용할 수 있습니다.");
      return;
    }

    if (round < 1000) {
      setError("회차는 최소 1000회 이상이어야 합니다.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${apiUrl}/lotto/premium/analysis?round=${round}&bonusIncluded=${bonusIncluded}&recent=${recentCount}`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const json = await res.json();

      if (json.ok) setResult(json.data);
      else setError("분석 데이터를 가져올 수 없습니다.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "알 수 없는 에러");
    } finally {
      setLoading(false);
      prevParamsRef.current = { round, bonusIncluded, recentCount };
    }
  };

  if (!user) return <div>로그인 후 이용 가능합니다.</div>;

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md max-w-3xl mx-auto space-y-4">
      <span className="text-sm text-yellow-600 font-bold block">
        프리미엄 분석
      </span>

      {/* ----------------- 컨트롤 바 ----------------- */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 justify-center w-full sm:w-auto">
        <div className="flex items-center gap-2">
          <label className="font-medium text-sm sm:text-base">회차 선택:</label>
          <input
            type="number"
            value={round}
            onChange={(e) => setRound(Number(e.target.value))}
            min={1000}
            max={latest}
            className="w-24 sm:w-28 text-center border-2 border-gray-300 rounded-xl px-3 py-2 text-sm sm:text-base font-bold shadow-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="text-gray-600 font-medium text-sm sm:text-base">
            회
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="checkbox"
            id="bonusIncluded"
            checked={bonusIncluded}
            onChange={(e) => setBonusIncluded(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="includeBonus" className="text-sm text-gray-700">
            보너스 번호 포함
          </label>
        </div>

        <div className="flex items-center gap-2">
          <label className="font-medium text-sm sm:text-base">
            이전 빈도 회차수
          </label>
          <input
            type="number"
            value={recentCount}
            onChange={(e) => setRecentCount(Number(e.target.value))}
            min={1}
            className="w-20 text-center border-2 border-gray-300 rounded-xl px-2 py-1 text-sm sm:text-base font-bold shadow-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={fetchData}
          className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-sm sm:text-base shadow-md bg-linear-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 hover:shadow-lg active:scale-95"
        >
          분석 실행
        </button>
      </div>

      {loading && <div>분석 중...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {/* ----------------- 분석 결과 ----------------- */}
      {result && (
        <div>
          <h2 className="text-xl font-semibold mb-2">회차 {round} 분석</h2>
          {result?.nextRound && (
            <div className="fixed top-35 left-1/2 transform -translate-x-1/2 bg-yellow-100 border border-yellow-400 rounded-xl px-4 py-2 shadow-md z-50 flex items-center gap-2">
              <span className="font-bold">
                다음 회차 {result.nextRound.round} 당첨번호:
              </span>
              <div className="flex flex-wrap gap-2 justify-center">
                {result.nextRound.numbers.map((num) => (
                  <LottoBall key={num} number={num} />
                ))}
              </div>

              {result.nextRound.bonus && (
                <>
                  {" "}
                  <span className="text-sm font-medium text-yellow-800">/</span>
                  <span className="bg-blue-500 text-white font-bold px-2 py-1 rounded-full">
                    {result.nextRound.bonus}
                  </span>
                </>
              )}
            </div>
          )}

          {/* 최근 빈도 차트 */}
          <FreqChart
            record={result.recentFreq}
            title={`이전 ${recentCount}회 빈도`}
            color="#10b981"
            height={250}
          />

          {/* perNumberNextFreq 차트 */}
          {Object.entries(result.perNumberNextFreq).map(([num, freq]) => (
            <FreqChart
              key={num}
              record={freq}
              title={
                <div className="flex flex-row items-center justify-start text-center">
                  <LottoBall number={Number(num)} /> 당첨 다음 회차 번호 빈도
                </div>
              }
              color="#3b82f6"
            />
          ))}

          {/* kMatchNextFreq */}
          {["1", "2", "3", "4+"].map((k) => (
            <FreqChart
              key={k}
              record={result.kMatchNextFreq[k]}
              title={`${k}개 일치 다음 회차 빈도`}
              color="#10b981"
            />
          ))}

          {/* 패턴 차트 */}
          <FreqChart
            record={result.pattern10NextFreq.freq}
            title={`10패턴 (${result.pattern10NextFreq.patternKey}) 다음 회차 빈도`}
            color="#3b82f6"
          />
          <FreqChart
            record={result.pattern7NextFreq.freq}
            title={`7패턴 (${result.pattern7NextFreq.patternKey}) 다음 회차 빈도`}
            color="#10b981"
          />
        </div>
      )}
    </div>
  );
}
