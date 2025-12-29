"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type EnsembleItem = {
  num: number;
  score: number;
};

export default function NumberEnsembleBar({ data }: { data: EnsembleItem[] }) {
  if (!data || data.length === 0)
    return (
      <div className="w-full h-[260px] flex items-center justify-center bg-gray-100 rounded-lg border border-gray-300 text-red-600 font-semibold text-lg">
        ⚠️ 간격 패턴 데이터가 없습니다. 조회 간격을 넓혀 보세요.
      </div>
    );
  const color = "#3b82f6";

  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="num" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="score" radius={[4, 4, 0, 0]} fill={color} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
