"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartTooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import HeatmapCell from "@/app/components/HeatmapCell";
import { apiUrl, getLatestRound } from "@/app/utils/getUtils";

interface LottoDraw {
  drwNo: number;
  numbers: number[];
}

const previewTabs = ["출현 빈도", "홀짝 비율", "번호 히트맵"] as const;

export default function ChartPreview() {
  const [active, setActive] =
    useState<(typeof previewTabs)[number]>("출현 빈도");
  const [draws, setDraws] = useState<LottoDraw[]>([]);
  const [loading, setLoading] = useState(true);

  const latestRound = getLatestRound();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${apiUrl}/lotto/frequency?start=${
            latestRound - 19
          }&end=${latestRound}`
        );
        const result = await res.json();

        if (Array.isArray(result.data.roundResults))
          setDraws(result.data.roundResults);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 데이터 처리
  const freqData: Record<number, number> = {};
  let odd = 0;
  let even = 0;

  draws.forEach((d) => {
    d.numbers.forEach((n) => {
      freqData[n] = (freqData[n] || 0) + 1;
      if (n % 2 === 0) even++;
      else odd++;
    });
  });

  const barData = Object.entries(freqData).map(([num, count]) => ({
    number: +num,
    count,
  }));

  const pieData = [
    { name: "홀수", value: odd },
    { name: "짝수", value: even },
  ];

  const max = Math.max(...Object.values(freqData), 1);
  const min = Math.min(...Object.values(freqData), 1);

  // ----------------------------------------
  // Render
  // ----------------------------------------
  return (
    <div
      className="bg-white border border-gray-100 rounded-xl shadow-sm px-5 py-6 
        w-full max-w-md mx-auto flex flex-col items-center"
    >
      <h3 className="text-lg sm:text-xl font-semibold mb-1 text-gray-900">
        미리보기 차트
      </h3>

      <p className="text-gray-500 text-xs sm:text-sm mb-5">
        최근 20회 데이터 요약
      </p>

      {/* 탭 버튼 */}
      <div className="flex gap-2 mb-5">
        {previewTabs.map((t) => (
          <button
            key={t}
            onClick={() => setActive(t)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition
              ${
                active === t
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* 차트 영역 */}
      {loading ? (
        <p className="text-gray-500 py-10">데이터 불러오는 중...</p>
      ) : (
        <div className="w-full h-56 relative">
          <AnimatePresence mode="wait">
            {/* 출현 빈도 */}
            {active === "출현 빈도" && (
              <motion.div
                key="freq"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.22 }}
                className="absolute inset-0"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <XAxis dataKey="number" fontSize={10} />
                    <YAxis fontSize={10} />
                    <RechartTooltip />
                    <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            )}

            {/* 홀짝 비율 */}
            {active === "홀짝 비율" && (
              <motion.div
                key="pie"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.22 }}
                className="absolute inset-0"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={65}
                      label
                    >
                      <Cell fill="#ef4444" />
                      <Cell fill="#3b82f6" />
                    </Pie>
                    <RechartTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>
            )}

            {/* 번호 히트맵 */}
            {active === "번호 히트맵" && (
              <motion.div
                key="heat"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.22 }}
                className="absolute inset-0 overflow-hidden"
              >
                <div className="grid grid-cols-9 gap-[2px] p-2 max-h-full overflow-y-auto">
                  {Array.from({ length: 45 }, (_, i) => (
                    <HeatmapCell
                      key={i + 1}
                      number={i + 1}
                      count={freqData[i + 1] || 0}
                      rounds={[]}
                      maxCount={max}
                      minCount={min}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <p className="text-gray-500 text-xs mt-4 text-center">
        전체 분석은 &quot;분석 시작하기&quot;에서 확인하세요.
      </p>
    </div>
  );
}
