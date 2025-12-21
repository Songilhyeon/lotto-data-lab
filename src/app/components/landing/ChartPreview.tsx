"use client";

import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: {
    topNumbers: { number: number; count: number }[];
    rangeStats: { range: string; count: number }[];
  };
}

export default function ChartPreview({ data }: Props) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6 sm:p-8">
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
        최근 회차 통계 미리보기
      </h3>

      <p className="text-sm text-gray-600 mb-6">
        최근 회차 기준으로 자주 등장한 번호와 번호 구간 분포를 요약해
        보여줍니다.
      </p>

      {/* TOP 번호 */}
      <div className="mb-8">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          최근 자주 나온 번호 TOP 5
        </h4>
        <div className="w-full h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.topNumbers}>
              <XAxis dataKey="number" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 구간 분포 */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          번호 구간 분포
        </h4>
        <div className="w-full h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.rangeStats}>
              <XAxis dataKey="range" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CTA */}
      <div className="text-right">
        <Link
          href="/analyze?tab=numberFrequency"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          전체 통계 보기 →
        </Link>
      </div>
    </div>
  );
}
