import { Card, CardContent } from "@/app/components/winner-stores/Card";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RegionChartCardProps {
  data: { region: string; regionCount: number }[];
  title: string;
}

export default function RegionChartCard({ data, title }: RegionChartCardProps) {
  return (
    <Card className="rounded-2xl shadow-lg bg-gradient-to-br from-white to-slate-50 border border-gray-200 mt-6">
      <CardContent className="p-6 sm:p-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-6 text-gray-800">
          {title}
        </h2>
        <div className="w-full h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="region" fontSize={12} tickLine={false} />
              <YAxis fontSize={12} tickLine={false} />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "regionCount") {
                    return [`${value}`, "총 배출수"];
                  }
                  return [value, name];
                }}
                contentStyle={{
                  borderRadius: "10px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
              />
              <Bar
                dataKey="regionCount"
                fill="url(#colorGradient)"
                radius={[6, 6, 0, 0]}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
