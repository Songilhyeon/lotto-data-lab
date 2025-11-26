"use client";
import { Tooltip } from "react-tooltip";
import { useEffect, useState } from "react";
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
import { getLatestRound } from "@/app/utils/getLatestRound";

interface LottoDraw {
  drwNo: number;
  numbers: number[];
}

const url = process.env.NEXT_PUBLIC_BACKEND_URL;
const latest = getLatestRound();

export default function ChartPreview() {
  const [draws, setDraws] = useState<LottoDraw[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${url}/api/lotto/frequency?start=${latest - 19}&end=${latest}`
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

  // 번호별 등장 횟수 및 회차 기록
  const freqData: Record<number, { count: number; rounds: number[] }> = {};
  let oddCount = 0;
  let evenCount = 0;

  draws.forEach((draw) => {
    draw.numbers.forEach((n) => {
      if (!freqData[n]) {
        freqData[n] = { count: 0, rounds: [] };
      }
      freqData[n].count++;
      freqData[n].rounds.push(draw.drwNo);
      // 홀짝 카운트
      if (n % 2 === 0) evenCount++;
      else oddCount++;
    });
  });

  const barChartData = Object.entries(freqData).map(([num, { count }]) => ({
    number: +num,
    count,
  }));

  const pieData = [
    { name: "홀수", value: oddCount },
    { name: "짝수", value: evenCount },
  ];

  const maxFreq = Math.max(...Object.values(freqData).map((v) => v.count), 1);
  const minFreq = Math.min(...Object.values(freqData).map((v) => v.count), 1);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
      <h3 className="text-xl font-semibold mb-4">미리보기 차트</h3>

      {loading ? (
        <p className="text-gray-500">데이터 불러오는 중...</p>
      ) : (
        <>
          {/* BarChart */}
          <div className="w-full h-48 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <XAxis dataKey="number" />
                <YAxis />
                <RechartTooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* PieChart */}
          <div className="w-full h-48 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  label
                >
                  <Cell fill="#ef4444" />
                  <Cell fill="#3b82f6" />
                </Pie>
                <RechartTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Heatmap */}
          <div className="w-full">
            <h4 className="text-sm font-semibold mb-2">번호 등장 히트맵</h4>
            <div className="grid grid-cols-6 gap-1">
              {Array.from({ length: 45 }, (_, i) => {
                const number = i + 1;
                const item = freqData[number] || { count: 0, rounds: [] };

                return (
                  <HeatmapCell
                    key={number}
                    number={number}
                    count={item.count}
                    rounds={item.rounds}
                    maxCount={maxFreq}
                    minCount={minFreq}
                  />
                );
              })}
            </div>
          </div>

          <Tooltip
            id="lotto-tooltip"
            place="top"
            className="bg-transparent! p-0! shadow-none!"
          />
        </>
      )}

      <p className="text-gray-500 text-sm mt-2 text-center">
        분석 페이지에서 전체 데이터와 다양한 차트를 확인할 수 있습니다.
      </p>
    </div>
  );
}
