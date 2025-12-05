"use client";

import React, { useState, useRef } from "react";
import { useAuth } from "@/app/context/authContext";
import { apiUrl, getLatestRound } from "@/app/utils/getUtils";
import LottoBall from "@/app/components/LottoBall";
import DraggableNextRound from "@/app/components/analyze/DraggableNextRound";
import { FreqChart } from "@/app/components/analyze/FreqChartComponent";

/* -------------------------------
      Single-Open Accordion
--------------------------------*/
const Accordion = ({
  title,
  chartKey,
  openKey,
  setOpenKey,
  defaultOpen = false,
  children,
}: {
  title: React.ReactNode;
  chartKey: string;
  openKey: string | null;
  setOpenKey: (key: string | null) => void;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) => {
  const isOpen = openKey === chartKey;

  const handleToggle = () => {
    if (isOpen) setOpenKey(null);
    else setOpenKey(chartKey);
  };

  return (
    <div className="border border-gray-200 rounded-xl mb-3 overflow-hidden shadow-sm">
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 text-left"
      >
        <span className="font-semibold text-gray-800">{title}</span>
        <span className="text-lg">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && <div className="p-3 bg-white">{children}</div>}
    </div>
  );
};

/* -------------------------------
      메인 페이지
--------------------------------*/

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

export default function PremiumAnalysis() {
  const latest = getLatestRound();
  const [round, setRound] = useState(latest);
  const [recentCount, setRecentCount] = useState(10);
  const [bonusIncluded, setBonusIncluded] = useState(false);
  const [result, setResult] = useState<PremiumAnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // 🔥 현재 열린 아코디언 key (하나만 열림)
  const [openKey, setOpenKey] = useState<string | null>("recent");

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

      {/* --- 컨트롤 바 --- */}
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
          <label htmlFor="bonusIncluded" className="text-sm text-gray-700">
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

      {/* --- 분석 결과 출력 --- */}
      {result && (
        <div>
          <h2 className="text-xl font-semibold mb-2">회차 {round} 분석</h2>
          {result?.nextRound && (
            <DraggableNextRound nextRound={result.nextRound} />
          )}

          {/* 최근 빈도 (기본 오픈 key = "recent") */}
          <Accordion
            title={`최근 ${recentCount}회 번호 빈도`}
            chartKey="recent"
            openKey={openKey}
            setOpenKey={setOpenKey}
          >
            <FreqChart
              record={result.recentFreq}
              color="#10b981"
              height={260}
            />
          </Accordion>

          {/* perNumberNextFreq */}
          <Accordion
            title="번호별 다음 회차 패턴 (45개)"
            chartKey="perNumber"
            openKey={openKey}
            setOpenKey={setOpenKey}
          >
            {Object.entries(result.perNumberNextFreq).map(([num, freq]) => (
              <div key={num} className="mb-4">
                <FreqChart
                  record={freq}
                  title={
                    <div className="flex flex-row items-center gap-2">
                      <LottoBall number={Number(num)} />
                      <span>→ 다음 회차 번호 빈도</span>
                    </div>
                  }
                />
              </div>
            ))}
          </Accordion>

          {/* kMatchNextFreq */}
          <Accordion
            title="일치 개수별 다음 회차 패턴"
            chartKey="kmatch"
            openKey={openKey}
            setOpenKey={setOpenKey}
          >
            {["1", "2", "3", "4+"].map((k) => (
              <div key={k} className="mb-4">
                <FreqChart
                  record={result.kMatchNextFreq[k]}
                  title={`${k}개 일치 → 다음 회차 번호 빈도`}
                  color="#10b981"
                />
              </div>
            ))}
          </Accordion>

          {/* 패턴 */}
          <Accordion
            title="패턴별 다음 회차 패턴"
            chartKey="pattern"
            openKey={openKey}
            setOpenKey={setOpenKey}
          >
            <FreqChart
              record={result.pattern10NextFreq.freq}
              title={`10패턴 (${result.pattern10NextFreq.patternKey})`}
              color="#3b82f6"
            />
            <FreqChart
              record={result.pattern7NextFreq.freq}
              title={`7패턴 (${result.pattern7NextFreq.patternKey})`}
              color="#10b981"
            />
          </Accordion>
        </div>
      )}
    </div>
  );
}
