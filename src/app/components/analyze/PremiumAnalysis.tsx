"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/app/context/authContext";
import { apiUrl, getLatestRound } from "@/app/utils/getUtils";
import LottoBall from "@/app/components/LottoBall";
import DraggableNextRound from "@/app/components/analyze/DraggableNextRound";
import { FreqChart } from "@/app/components/analyze/FreqChartComponent";
import PatternNextFreqSection from "@/app/components/analyze/PatternNextFreqSection";
import Accordion from "@/app/components/analyze/SingleOpenAccordion";
import { PremiumAnalysisData } from "@/app/types/lotto";

export default function PremiumAnalysis() {
  const latest = getLatestRound();
  const [round, setRound] = useState(latest);
  const [recentCount, setRecentCount] = useState(10);
  const [bonusIncluded, setBonusIncluded] = useState(false);
  const [result, setResult] = useState<PremiumAnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // 하나만 열리는 아코디언 key
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

  // ✅ 최대/최소 번호 수집 함수
  const getHighlightNumbers = (data: PremiumAnalysisData) => {
    const maxSet = new Set<number>();
    const minSet = new Set<number>();

    // 최근 빈도
    if (data.recentFreq && openKey === "recent") {
      const values = Object.values(data.recentFreq);
      const max = Math.max(...values);
      const min = Math.min(...values);

      if (max >= 1) {
        Object.entries(data.recentFreq)
          .filter(([_, v]) => v === max)
          .forEach(([n]) => maxSet.add(Number(n)));
      }
      if (min >= 0) {
        Object.entries(data.recentFreq)
          .filter(([_, v]) => v === min)
          .forEach(([n]) => minSet.add(Number(n)));
      }
    }

    // perNumberNextFreq
    if (openKey === "perNumber") {
      Object.values(data.perNumberNextFreq).forEach((freqObj) => {
        const freq = freqObj;
        const entries = Object.entries(freq);
        if (!entries.length) return;
        const values = entries.map(([, v]) => v);
        const maxValue = Math.max(...values);
        const minValue = Math.min(...values);

        entries
          .filter(([, v]) => v === maxValue)
          .forEach(([k]) => maxSet.add(Number(k)));
        entries
          .filter(([, v]) => v === minValue)
          .forEach(([k]) => minSet.add(Number(k)));
      });
    }

    // kMatchNextFreq
    if (openKey === "kmatch") {
      Object.values(data.kMatchNextFreq).forEach((record) => {
        const values = Object.values(record);
        const maxValue = Math.max(...values);
        const minValue = Math.min(...values);

        Object.entries(record)
          .filter(([_, v]) => v === maxValue)
          .forEach(([n]) => maxSet.add(Number(n)));
        Object.entries(record)
          .filter(([_, v]) => v === minValue)
          .forEach(([n]) => minSet.add(Number(n)));
      });
    }

    // pattern10NextFreq
    if (openKey === "pattern10") {
      const freq = data.pattern10NextFreq;
      const entries = Object.entries(freq);
      if (!entries.length) return;
      const values = entries.map(([, v]) => v);
      const maxValue = Math.max(...values);
      const minValue = Math.min(...values);

      entries
        .filter(([, v]) => v === maxValue)
        .forEach(([k]) => maxSet.add(Number(k)));
      entries
        .filter(([, v]) => v === minValue)
        .forEach(([k]) => minSet.add(Number(k)));
    }

    if (openKey === "pattern7") {
      const freq = data.pattern7NextFreq;
      const entries = Object.entries(freq);
      if (!entries.length) return;
      const values = entries.map(([, v]) => v);
      const maxValue = Math.max(...values);
      const minValue = Math.min(...values);

      entries
        .filter(([, v]) => v === maxValue)
        .forEach(([k]) => maxSet.add(Number(k)));
      entries
        .filter(([, v]) => v === minValue)
        .forEach(([k]) => minSet.add(Number(k)));
    }

    return {
      maxNumbers: Array.from(maxSet),
      minNumbers: Array.from(minSet),
    };
  };

  if (!user)
    return (
      <div className="w-full flex justify-center mt-10">
        <div className="border border-gray-200 bg-gray-50 rounded-xl px-6 py-6 text-center shadow-sm">
          <p className="text-xl font-semibold text-gray-800">
            로그인이 필요합니다
          </p>
          <p className="text-gray-500 text-sm mt-2">
            로그인 후 더 많은 기능을 이용해보세요.
          </p>
        </div>
      </div>
    );

  const highlights = result
    ? getHighlightNumbers(result)
    : { maxNumbers: [], minNumbers: [] };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md max-w-3xl mx-auto space-y-4">
      <span className="text-sm text-yellow-600 font-bold block">
        프리미엄 분석
      </span>

      {/* --- 컨트롤 바 --- */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 justify-center w-full sm:w-auto">
        {/* 회차 입력 */}
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

        {/* 보너스 포함 */}
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

        {/* 최근 N회 */}
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

      {/* --- 분석 결과 --- */}
      {result && (
        <div>
          <h2 className="text-xl font-semibold mb-2">회차 {round} 분석</h2>

          {/* 다음 회차 */}
          {result.nextRound && (
            <DraggableNextRound
              nextRound={result.nextRound}
              most={highlights?.maxNumbers}
              least={highlights?.minNumbers}
            />
          )}

          {/* 최근 빈도 */}
          <Accordion
            title={`최근 ${recentCount}회 번호 빈도`}
            chartKey="recent"
            openKey={openKey}
            setOpenKey={setOpenKey}
          >
            {/* 🔹 최다/최소 빈도 표시 */}
            {result.recentFreq &&
              Object.keys(result.recentFreq).length > 0 &&
              (() => {
                const values = Object.values(result.recentFreq);
                const max = Math.max(...values);
                const min = Math.min(...values);
                // 최대가 1, 최소가 0일 경우 표시하지 않음
                const showMax = max > 1;
                const showMin = min > 0;

                const maxNumbers = showMax
                  ? Object.entries(result.recentFreq)
                      .filter(([_, v]) => v === max)
                      .map(([n]) => n)
                  : [];
                const minNumbers = showMin
                  ? Object.entries(result.recentFreq)
                      .filter(([_, v]) => v === min)
                      .map(([n]) => n)
                  : [];

                return (
                  <div className="flex flex-wrap gap-4 mb-2 text-sm text-gray-700">
                    {showMax && (
                      <div className="flex items-center gap-1 flex-wrap">
                        <span>최다:</span>
                        {maxNumbers.map((n) => (
                          <LottoBall key={`max-${n}`} number={Number(n)} />
                        ))}
                      </div>
                    )}
                    {showMin && (
                      <div className="flex items-center gap-1 flex-wrap">
                        <span>최소:</span>
                        {minNumbers.map((n) => (
                          <LottoBall key={`min-${n}`} number={Number(n)} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

            <FreqChart
              record={result.recentFreq}
              color="#10b981"
              height={260}
            />
          </Accordion>

          {/* perNumberNextFreq */}
          <Accordion
            title="번호별 다음 회차 빈도"
            chartKey="perNumber"
            openKey={openKey}
            setOpenKey={setOpenKey}
          >
            {Object.entries(result.perNumberNextFreq).map(([num, freqObj]) => {
              const freq: Record<number, number> =
                typeof freqObj === "object" && freqObj !== null
                  ? (freqObj as Record<number, number>)
                  : {};

              const entries = Object.entries(freq);
              if (entries.length === 0) return null;

              const values = entries.map((e) => e[1]);
              const maxValue = Math.max(...values);
              const minValue = Math.min(...values);

              const maxNumbers = entries
                .filter(([_, v]) => v === maxValue)
                .map(([k]) => Number(k));
              const minNumbers = entries
                .filter(([_, v]) => v === minValue)
                .map(([k]) => Number(k));

              return (
                <div key={num} className="mb-4">
                  <FreqChart
                    record={freq}
                    title={
                      <div className="flex flex-row flex-wrap items-center gap-3">
                        <LottoBall number={Number(num)} />
                        <span className="text-gray-600">→</span>

                        {maxNumbers.length > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-500">최다:</span>
                            <div className="flex gap-1">
                              {maxNumbers.map((n) => (
                                <LottoBall key={`max-${num}-${n}`} number={n} />
                              ))}
                            </div>
                          </div>
                        )}

                        {minNumbers.length > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-500">최소:</span>
                            <div className="flex gap-1">
                              {minNumbers.map((n) => (
                                <LottoBall key={`min-${num}-${n}`} number={n} />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    }
                  />
                </div>
              );
            })}
          </Accordion>

          {/* kMatchNextFreq */}
          <Accordion
            title="일치 개수별 다음 회차 빈도"
            chartKey="kmatch"
            openKey={openKey}
            setOpenKey={setOpenKey}
          >
            {(["1", "2", "3", "4+"] as const).map((k) => {
              const record = result.kMatchNextFreq[k];
              const values = Object.values(record);
              const maxValue = Math.max(...values);
              const minValue = Math.min(...values);

              const maxNumbers =
                maxValue > 1
                  ? Object.entries(record)
                      .filter(([_, cnt]) => cnt === maxValue)
                      .map(([num]) => Number(num))
                  : [];

              const minNumbers =
                minValue > 0
                  ? Object.entries(record)
                      .filter(([_, cnt]) => cnt === minValue)
                      .map(([num]) => Number(num))
                  : [];

              return (
                <div key={k} className="mb-6">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="font-semibold">{k}개 일치 →</span>

                    {maxNumbers.length > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">최다</span>
                        <div className="flex gap-1">
                          {maxNumbers.map((n) => (
                            <LottoBall
                              key={`max-${k}-${n}`}
                              number={n}
                              size="sm"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {minNumbers.length > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">최소</span>
                        <div className="flex gap-1">
                          {minNumbers.map((n) => (
                            <LottoBall
                              key={`min-${k}-${n}`}
                              number={n}
                              size="sm"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <FreqChart record={record} />
                </div>
              );
            })}
          </Accordion>

          {/* 패턴 */}
          <Accordion
            title="10패턴 → 다음 회차"
            chartKey="pattern10"
            openKey={openKey}
            setOpenKey={setOpenKey}
          >
            <PatternNextFreqSection
              title="10패턴 다음 회차"
              data={result.pattern10NextFreq}
            />
          </Accordion>

          <Accordion
            title="7패턴 → 다음 회차"
            chartKey="pattern7"
            openKey={openKey}
            setOpenKey={setOpenKey}
          >
            <PatternNextFreqSection
              title="7패턴 다음 회차"
              data={result.pattern7NextFreq}
            />
          </Accordion>
        </div>
      )}
    </div>
  );
}
