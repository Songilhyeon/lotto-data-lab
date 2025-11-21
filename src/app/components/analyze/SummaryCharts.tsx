import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface Props {
  oddEvenStats: { odd: number; even: number; total: number };
  statsData: { number: number; count: number }[];
}

export default function SummaryCharts({ oddEvenStats, statsData }: Props) {
  return (
    <div className="space-y-6">
      {/* 홀짝 비율 */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="font-semibold text-gray-700 mb-4">홀/짝 비율</h2>
        <div className="text-lg mb-2">
          홀 {oddEvenStats.odd}개 | 짝 {oddEvenStats.even}개
        </div>
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden flex">
          <div
            className="bg-red-400"
            style={{
              width: `${(oddEvenStats.odd / oddEvenStats.total) * 100}%`,
            }}
          />
          <div
            className="bg-blue-400"
            style={{
              width: `${(oddEvenStats.even / oddEvenStats.total) * 100}%`,
            }}
          />
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={[
                { name: "홀수", value: oddEvenStats.odd },
                { name: "짝수", value: oddEvenStats.even },
              ]}
              dataKey="value"
              innerRadius={60}
              outerRadius={80}
              label
            >
              <Cell fill="#ef4444" />
              <Cell fill="#3b82f6" />
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 번호 등장 차트 */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="font-semibold text-gray-700 mb-4">번호 등장 횟수</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="number" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
