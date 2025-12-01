"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartTooltip,
  ResponsiveContainer,
} from "recharts";

export default function NextFrequencyChart({
  frequency,
  title,
}: {
  frequency: Record<number, number>;
  title: string;
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

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-6">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>

      <div style={{ width: "100%", height: 220 }}>
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
  );
}
