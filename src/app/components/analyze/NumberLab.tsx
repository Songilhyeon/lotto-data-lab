"use client";

import { useState } from "react";
import { getBallColor } from "../../utils/getBallColor";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartTooltip,
} from "recharts";

interface MatchResult {
  round: number;
  numbers: number[];
  bonus: number;
  matchCount: number;
  nextNumbers: number[];
}

interface ComboEntry {
  combo: number[];
  count: number;
  rounds: number[];
}

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function NumberLab() {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [analysisResult, setAnalysisResult] = useState<
    Record<number, MatchResult[]>
  >({});
  const [frequencyNext, setFrequencyNext] = useState<Record<number, number>>(
    {}
  );
  const [appearRounds, setAppearRounds] = useState<Record<number, number[]>>(
    {}
  );
  const [comboTop, setComboTop] = useState<
    Record<number, { key: string; count: number; rounds: number[] }[]>
  >({});

  const [loading, setLoading] = useState(false);
  const [openCards, setOpenCards] = useState<Record<string, boolean>>({});

  const toggleNumber = (num: number) => {
    if (selectedNumbers.length >= 6 && !selectedNumbers.includes(num)) return;
    setSelectedNumbers((prev) =>
      prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num]
    );
  };

  const runAnalysis = async () => {
    if (selectedNumbers.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch(`${url}/api/lotto/numberlab`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numbers: selectedNumbers }),
      });
      const data = await res.json();

      console.log(data);

      // 안전 파싱(백엔드 하위호환을 위해)
      const matchGroups = data.matchGroups || data.results || {};
      // ensure keys 1..6 exist
      const fixed: Record<number, MatchResult[]> = {};
      for (let i = 1; i <= 6; i++) fixed[i] = matchGroups[i] || [];

      setAnalysisResult(fixed);
      setFrequencyNext(data.frequencyNext || {});
      setAppearRounds(data.appear || {});

      // combos: backend provides combos as array per k (combos[k] = [{combo,count,rounds},...])
      const backendCombos = data.combos || data.combosByK || {};
      // ensure k keys 2..6 exist and filter out count===0 if any
      const fixedCombos: Record<number, ComboEntry[]> = {};
      for (let k = 2; k <= 6; k++) {
        const arr: ComboEntry[] = Array.isArray(backendCombos[k])
          ? backendCombos[k].filter((c: ComboEntry) => c.count > 0)
          : [];
        fixedCombos[k] = arr;
      }

      // comboTop: accept backend top or compute from combos
      const backendTop = data.comboTop || {};
      // normalize top
      const fixedTop: Record<
        number,
        { key: string; count: number; rounds: number[] }[]
      > = {};
      for (let k = 2; k <= 6; k++) {
        if (Array.isArray(backendTop[k])) {
          fixedTop[k] = backendTop[k];
        } else {
          // compute from fixedCombos
          fixedTop[k] = (fixedCombos[k] || [])
            .map((c) => ({
              key: c.combo.join(","),
              count: c.count,
              rounds: c.rounds,
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
        }
      }
      setComboTop(fixedTop);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // bar chart data for "frequencyNext" (unchanged)
  const barChartData = Array.from({ length: 45 }, (_, i) => {
    const num = i + 1;
    return { number: num, count: frequencyNext[num] ?? 0 };
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-3xl xl:text-[2.2rem] font-bold text-gray-800 mb-2">
            로또 번호 실험실
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            원하는 6개 이하의 숫자를 선택하고 일치번호 / 조합 패턴을
            분석해보세요
          </p>
        </div>

        {/* Selection + Grid (same as before) */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              선택한 번호 ({selectedNumbers.length}/6)
            </h2>

            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {selectedNumbers
                  .sort((a, b) => a - b)
                  .map((n) => (
                    <div
                      key={n}
                      className={`w-9 h-9 rounded-full ${getBallColor(
                        n
                      )} text-white flex items-center justify-center font-bold`}
                    >
                      {n}
                    </div>
                  ))}
              </div>
            </div>
            <div className="flex gap-2">
              {selectedNumbers.length > 0 && (
                <button
                  onClick={() => setSelectedNumbers([])}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  모두 지우기
                </button>
              )}
              <button
                onClick={runAnalysis}
                disabled={loading || selectedNumbers.length === 0}
                className="ml-2 px-4 py-2 rounded-lg bg-blue-600 text-white"
              >
                {loading ? "분석 중..." : "🔬 분석 실행"}
              </button>
            </div>
          </div>

          <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-3">
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 45 }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => toggleNumber(num)}
                  className={`rounded-full h-8 w-8 flex items-center justify-center text-xs ${
                    selectedNumbers.includes(num)
                      ? `${getBallColor(num)} text-white`
                      : "bg-white text-gray-700 border border-gray-200"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Next frequency */}
        {Object.keys(frequencyNext).length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-6">
            <h2 className="text-xl font-bold mb-4">📊 다음 회차 출현 빈도</h2>
            <div style={{ width: "100%", height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <XAxis dataKey="number" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <RechartTooltip />
                  <Bar dataKey="count" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Match results (unchanged core) */}
        {Object.keys(analysisResult).length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-6">
            <h2 className="text-xl font-bold mb-4">
              🎯 일치 회차 정보 (중복 회차 미포함)
            </h2>

            <div className="space-y-4">
              {Object.keys(analysisResult)
                .sort((a, b) => Number(b) - Number(a))
                .filter(
                  (matchCount) => analysisResult[Number(matchCount)].length > 0
                ) // 🔥 1회 이상만
                .map((matchCount) => {
                  const list = analysisResult[Number(matchCount)];

                  const isOpen = openCards[matchCount] || false;

                  const toggleCard = () =>
                    setOpenCards((prev) => ({
                      ...prev,
                      [matchCount]: !prev[matchCount],
                    }));

                  return (
                    <div
                      key={matchCount}
                      className="rounded-xl p-4 sm:p-6 border-l-4 border-blue-500 bg-linear-to-r from-gray-50 to-gray-100"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">
                          {matchCount}개 일치
                        </h3>
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                          {list.length}회
                        </span>
                      </div>

                      {list && Number(matchCount) >= 3 ? (
                        <div>
                          <div>
                            <button
                              onClick={toggleCard}
                              className="text-blue-500 text-sm mb-2"
                            >
                              {isOpen ? "숨기기 ▲" : "자세히 보기 ▼"}
                            </button>

                            {isOpen &&
                              list.map((item) => (
                                <div key={item.round}>{item.round}</div>
                              ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          해당하는 회차가 없습니다
                        </p>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* 🔥 전체 조합 탐색(옵션): 모든 k 탭 형태 */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-6">
          <h2 className="text-xl font-bold mb-4">
            🔥 각 번호 조합 출현 빈도 (중복 회차 포함)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((k) => {
              // 1개 조합은 appearRounds, 나머지는 comboTop
              const list =
                k === 1
                  ? Object.keys(appearRounds)
                      .filter((num) => appearRounds[Number(num)].length > 0)
                      .map((num) => ({
                        key: num,
                        count: appearRounds[Number(num)].length,
                      }))
                  : comboTop[k] || [];

              if (list.length === 0) return null;

              return (
                <div key={k} className="p-4 rounded-lg border bg-gray-50">
                  <h3 className="font-semibold mb-2">{k}개 조합</h3>
                  <div className="space-y-2 max-h-56 overflow-auto">
                    {list.map((item, idx) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between bg-white p-2 rounded border"
                      >
                        <div className="text-sm font-medium">
                          {idx + 1}. [{item.key}]
                        </div>
                        <div className="text-sm text-blue-600">
                          {item.count}회
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
