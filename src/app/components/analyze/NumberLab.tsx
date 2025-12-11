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
import { apiUrl } from "@/app/utils/getUtils";
import { analysisDivStyle } from "@/app/utils/getDivStyle";
import ComponentHeader from "@/app/components/ComponentHeader";

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

export default function NumberLab() {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [analysisResult, setAnalysisResult] = useState<
    Record<number, MatchResult[]>
  >({});
  const [frequencyNext, setFrequencyNext] = useState<
    Record<string, Record<number, number>>
  >({});
  const [appearRounds, setAppearRounds] = useState<Record<number, number[]>>(
    {}
  );
  const [comboTop, setComboTop] = useState<
    Record<number, { key: string; count: number; rounds: number[] }[]>
  >({});

  const [loading, setLoading] = useState(false);
  const [openCards, setOpenCards] = useState<Record<string, boolean>>({});

  const matchTabs = [
    { key: "1", label: "1개", description: "1개 일치" },
    { key: "2", label: "2개", description: "2개 일치" },
    { key: "3", label: "3개", description: "3개 일치" },
    { key: "4+", label: "4+", description: "4개 이상 일치" },
    { key: "all", label: "전체", description: "전체 합산" },
  ];
  const [activeTab, setActiveTab] = useState("all");

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
      const res = await fetch(`${apiUrl}/lotto/numberlab`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numbers: selectedNumbers }),
      });
      const data = await res.json();

      const matchGroups = data.matchGroups || data.results || {};
      const fixed: Record<number, MatchResult[]> = {};
      for (let i = 1; i <= 6; i++) fixed[i] = matchGroups[i] || [];

      setAnalysisResult(fixed);
      setFrequencyNext(data.frequencyNext || {});
      setAppearRounds(data.appear || {});

      const backendCombos = data.combos || data.combosByK || {};
      const fixedCombos: Record<number, ComboEntry[]> = {};
      for (let k = 2; k <= 6; k++) {
        const arr: ComboEntry[] = Array.isArray(backendCombos[k])
          ? backendCombos[k].filter((c: ComboEntry) => c.count > 0)
          : [];
        fixedCombos[k] = arr;
      }

      const backendTop = data.comboTop || {};
      const fixedTop: Record<
        number,
        { key: string; count: number; rounds: number[] }[]
      > = {};
      for (let k = 2; k <= 6; k++) {
        if (Array.isArray(backendTop[k])) {
          fixedTop[k] = backendTop[k];
        } else {
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

  const getChartData = () => {
    const keyMap: Record<string, string> = {
      "1": "1",
      "2": "2",
      "3": "3",
      "4+": "4+",
    };
    if (activeTab === "all") {
      const base: Record<number, number> = {};
      for (let n = 1; n <= 45; n++) base[n] = 0;
      ["1", "2", "3", "4+"].forEach((k) => {
        const row = frequencyNext[k] || {};
        for (let n = 1; n <= 45; n++) base[n] += row[n] || 0;
      });
      return Array.from({ length: 45 }, (_, i) => ({
        number: i + 1,
        count: base[i + 1],
      }));
    } else {
      const activeKey = keyMap[activeTab];
      const dataSource = frequencyNext[activeKey] || {};
      return Array.from({ length: 45 }, (_, i) => ({
        number: i + 1,
        count: dataSource[i + 1] ?? 0,
      }));
    }
  };

  return (
    <div
      className={analysisDivStyle("blue-50", "indigo-100") + " px-3 sm:px-6"}
    >
      <ComponentHeader
        title="🔮 로또 번호 실험실"
        content="원하는 6개 이하의 숫자를 선택하고 일치번호 / 조합 패턴을 분석해보세요."
      />

      {/* 번호 선택 */}
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            선택한 번호 ({selectedNumbers.length}/6)
          </h2>

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

          <div className="flex gap-2 flex-wrap">
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

        <div className="max-w-full overflow-x-auto">
          <div className="grid grid-cols-9 sm:grid-cols-9 gap-2 min-w-[360px]">
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

      {/* 일치 회차 카드 */}
      {Object.keys(analysisResult).length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">🎯 일치 회차 정보</h2>
          <div className="space-y-4">
            {Object.keys(analysisResult)
              .sort((a, b) => Number(b) - Number(a))
              .filter((mc) => analysisResult[Number(mc)].length > 0)
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
                    className="rounded-xl p-3 sm:p-4 border-l-4 border-blue-500 bg-linear-to-r from-gray-50 to-gray-100 overflow-x-auto"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold">
                        {matchCount}개 일치
                      </h3>
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        {list.length}개 회차
                      </span>
                    </div>

                    {list && Number(matchCount) >= 3 && (
                      <div>
                        <button
                          onClick={toggleCard}
                          className="text-blue-500 text-sm mb-2"
                        >
                          {isOpen ? "숨기기 ▲" : "자세히 보기 ▼"}
                        </button>
                        {isOpen && (
                          <div className="flex flex-wrap gap-2 text-sm">
                            {list.map((item) => (
                              <span key={item.round}>{item.round}회</span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* 다음 회차 출현 빈도 */}
      {Object.keys(frequencyNext).length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">📊 다음 회차 출현 빈도</h2>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {matchTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1 rounded-full text-sm font-bold border ${
                  activeTab === tab.key
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-600 border-gray-300"
                }`}
              >
                {tab.description}
              </button>
            ))}
          </div>

          {/* Bar Chart */}
          <div
            className="w-full min-w-0 overflow-x-auto"
            style={{ height: 220 }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getChartData()}>
                <XAxis dataKey="number" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <RechartTooltip />
                <Bar dataKey="count" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 조합 분석 */}
      {(Object.keys(appearRounds).length > 0 ||
        Object.keys(comboTop).length > 0) && (
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">🔥 각 번호 조합 출현 빈도</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((k) => {
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
                <div
                  key={k}
                  className="p-3 rounded-lg border bg-gray-50 max-h-56 overflow-auto"
                >
                  <h3 className="font-semibold mb-2">{k}개 조합</h3>
                  <div className="space-y-2">
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
      )}
    </div>
  );
}
