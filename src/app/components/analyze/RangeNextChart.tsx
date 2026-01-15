"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartTooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function NextFrequencyChart({
  frequency,
  title,
}: {
  frequency: Record<number, number>;
  title: React.ReactNode;
}) {
  // 데이터 변환
  const getChartData = () => {
    const full = [];

    for (let i = 1; i <= 45; i++) {
      full.push({
        number: i,
        count: frequency[i] ?? 0, // 존재하지 않으면 0으로 채우기
      });
    }

    return full;
  };
  const chartData = getChartData();
  const maxValue = Math.max(...chartData.map((d) => d.count));
  const minValue = Math.min(...chartData.map((d) => d.count)); // (원하면 사용)
  const color = "#3B82F6";

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-6">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>

      <div className="w-full">
        <ResponsiveContainer width="100%" height={220} minHeight={220} minWidth={0}>
          <BarChart data={chartData}>
            <XAxis dataKey="number" tick={{ fontSize: 10 }} />
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
    </div>
  );
}
