"use client";

import { useState, useRef } from "react";
import { apiUrl, getLatestRound } from "@/app/utils/getUtils";
import LottoBall from "@/app/components/LottoBall";
import DraggableNextRound from "@/app/components/DraggableNextRound";
import { FreqChart } from "@/app/components/analyze/FreqChartComponent";
import PatternNextFreqSection from "@/app/components/analyze/PatternNextFreqSection";
import Accordion from "@/app/components/analyze/SingleOpenAccordion";
import { PremiumAnalysisData } from "@/app/types/lottoNumbers";
import { componentBodyDivStyle } from "@/app/utils/getDivStyle";
import ComponentHeader from "@/app/components/ComponentHeader";

export default function PremiumAnalysis() {
  const latest = getLatestRound();
  const [round, setRound] = useState(latest);
  const [recentCount, setRecentCount] = useState(10);
  const [bonusIncluded, setBonusIncluded] = useState(false);
  const [result, setResult] = useState<PremiumAnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

    if (round < 1000) {
      setError("회차는 최소 1000회 이상이어야 합니다.");
      return;
    }

    setLoading(true);
    setError(null);
    let success = false;
    try {
      const res = await fetch(
        `${apiUrl}/lotto/premium/analysis?round=${round}&bonusIncluded=${bonusIncluded}&recent=${recentCount}`,
        { credentials: "include" }
      );

      if (!res.ok) throw new Error(`Error ${res.status}`);
      const json = await res.json();

      if (json.ok) setResult(json.data);
      else setError("분석 데이터를 가져올 수 없습니다.");
      success = true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "알 수 없는 에러");
    } finally {
      setLoading(false);
      if (success) {
        prevParamsRef.current = { round, bonusIncluded, recentCount };
      }
    }
  };

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

    // pattern15NextFreq
    if (openKey === "pattern15") {
      const freq = data.pattern15NextFreq;
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

    // pattern5NextFreq
    if (openKey === "pattern5") {
      const freq = data.pattern5NextFreq;
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

  const highlights = result
    ? getHighlightNumbers(result)
    : { maxNumbers: [], minNumbers: [] };

  return (
    <div className={`${componentBodyDivStyle()} from-pink-50 to-indigo-100`}>
      <ComponentHeader
        title="📊 통합 분석"
        content="과거 회차 데이터를 기반으로 번호 구간, 출현 빈도, 패턴 일치도를 종합해 이번 흐름을 한눈에 분석합니다."
      />

      {/* 컨트롤 바 */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 justify-center w-full sm:w-auto">
        <div className="flex flex-wrap gap-2 items-center">
          <label className="font-medium text-sm sm:text-base">회차 선택:</label>
          <input
            type="number"
            value={round}
            onChange={(e) => setRound(Number(e.target.value))}
            min={1000}
            max={latest}
            className="w-20 sm:w-28 text-center border-2 border-gray-300 rounded-xl px-2 py-1 sm:px-3 sm:py-2 text-sm sm:text-base font-bold shadow-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="text-gray-600 font-medium text-sm sm:text-base">
            회
          </span>
        </div>

        <div className="flex items-center gap-2">
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
            최근 빈도 회차수
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
          className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-sm sm:text-base shadow-md bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 hover:shadow-lg active:scale-95"
        >
          분석 실행
        </button>
      </div>

      {loading && <div>분석 중...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {/* 분석 결과 */}
      {result && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-2 text-center sm:text-left">
            회차 {round} 분석
          </h2>

          {/* 다음 회차 */}
          {result.nextRound && (
            <div className="overflow-x-auto">
              <DraggableNextRound
                nextRound={result.nextRound}
                most={highlights?.maxNumbers}
                least={highlights?.minNumbers}
              />
            </div>
          )}

          {/* 최근 빈도 */}
          <Accordion
            title={`최근 ${recentCount}회 번호 빈도`}
            chartKey="recent"
            openKey={openKey}
            setOpenKey={setOpenKey}
          >
            <div className="flex flex-wrap gap-2 mb-2">
              {highlights && highlights?.maxNumbers.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-xs text-gray-500">최다:</span>
                  {highlights.maxNumbers.map((n) => (
                    <LottoBall key={`max-${n}`} number={n} />
                  ))}
                </div>
              )}
              {highlights && highlights?.minNumbers.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-xs text-gray-500">최소:</span>
                  {highlights.minNumbers.map((n) => (
                    <LottoBall key={`min-${n}`} number={n} />
                  ))}
                </div>
              )}
            </div>

            <FreqChart
              record={result.recentFreq}
              color="#10b981"
              height={260}
            />
          </Accordion>

          {/* perNumberNextFreq, kMatchNextFreq, Pattern sections */}
          <div className="space-y-4">
            <Accordion
              title="번호별 다음 회차 빈도"
              chartKey="perNumber"
              openKey={openKey}
              setOpenKey={setOpenKey}
            >
              <div className="space-y-4 overflow-x-auto">
                {Object.entries(result.perNumberNextFreq).map(
                  ([num, freqObj]) => {
                    const freq =
                      typeof freqObj === "object" && freqObj !== null
                        ? (freqObj as Record<number, number>)
                        : {};
                    if (!Object.keys(freq).length) return null;

                    const values = Object.values(freq);
                    const maxValue = Math.max(...values);
                    const minValue = Math.min(...values);
                    const maxNumbers = Object.entries(freq)
                      .filter(([_, v]) => v === maxValue)
                      .map(([k]) => Number(k));
                    const minNumbers = Object.entries(freq)
                      .filter(([_, v]) => v === minValue)
                      .map(([k]) => Number(k));

                    return (
                      <div key={num} className="mb-4 min-w-[280px]">
                        <FreqChart
                          record={freq}
                          title={
                            <div className="flex flex-wrap items-center gap-2">
                              <LottoBall number={Number(num)} />
                              <span className="text-gray-600">→</span>
                              {maxNumbers.length > 0 && (
                                <div className="flex items-center gap-1 flex-wrap">
                                  <span className="text-xs text-gray-500">
                                    최다:
                                  </span>
                                  {maxNumbers.map((n) => (
                                    <LottoBall
                                      key={`max-${num}-${n}`}
                                      number={n}
                                    />
                                  ))}
                                </div>
                              )}
                              {minNumbers.length > 0 && (
                                <div className="flex items-center gap-1 flex-wrap">
                                  <span className="text-xs text-gray-500">
                                    최소:
                                  </span>
                                  {minNumbers.map((n) => (
                                    <LottoBall
                                      key={`min-${num}-${n}`}
                                      number={n}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          }
                        />
                      </div>
                    );
                  }
                )}
              </div>
            </Accordion>

            {/* kMatchNextFreq */}
            <Accordion
              title="일치 개수별 다음 회차 빈도"
              chartKey="kmatch"
              openKey={openKey}
              setOpenKey={setOpenKey}
            >
              <div className="space-y-4 overflow-x-auto">
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
                    <div key={k} className="mb-4 min-w-[280px]">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-semibold">{k}개 일치 →</span>
                        {maxNumbers.length > 0 && (
                          <div className="flex items-center gap-1 flex-wrap">
                            <span className="text-xs text-gray-500">최다</span>
                            {maxNumbers.map((n) => (
                              <LottoBall
                                key={`max-${k}-${n}`}
                                number={n}
                                size="sm"
                              />
                            ))}
                          </div>
                        )}
                        {minNumbers.length > 0 && (
                          <div className="flex items-center gap-1 flex-wrap">
                            <span className="text-xs text-gray-500">최소</span>
                            {minNumbers.map((n) => (
                              <LottoBall
                                key={`min-${k}-${n}`}
                                number={n}
                                size="sm"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <FreqChart record={record} />
                    </div>
                  );
                })}
              </div>
            </Accordion>

            {/* Pattern sections */}
            <Accordion
              title="15패턴 → 다음 회차"
              chartKey="pattern15"
              openKey={openKey}
              setOpenKey={setOpenKey}
            >
              <PatternNextFreqSection
                title="15패턴 다음 회차 빈도수"
                data={result.pattern15NextFreq}
              />
            </Accordion>

            <Accordion
              title="10패턴 → 다음 회차"
              chartKey="pattern10"
              openKey={openKey}
              setOpenKey={setOpenKey}
            >
              <PatternNextFreqSection
                title="10패턴 다음 회차 빈도수"
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
                title="7패턴 다음 회차 빈도수"
                data={result.pattern7NextFreq}
              />
            </Accordion>

            <Accordion
              title="5패턴 → 다음 회차"
              chartKey="pattern5"
              openKey={openKey}
              setOpenKey={setOpenKey}
            >
              <PatternNextFreqSection
                title="5패턴 다음 회차 빈도수"
                data={result.pattern5NextFreq}
              />
            </Accordion>
          </div>
        </div>
      )}
    </div>
  );
}
