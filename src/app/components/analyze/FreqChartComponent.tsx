/* -------------------------------
      FreqChart 컴포넌트
--------------------------------*/
import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartTooltip,
  Cell,
} from "recharts";

interface FreqChartProps {
  record?: Record<number, number>;
  title?: React.ReactNode;
  color?: string;
  height?: number;
}

const FreqChartComponent = ({
  record,
  title,
  color = "#3b82f6",
  height = 200,
}: FreqChartProps) => {
  const chartData = useMemo(() => {
    if (!record) return [];
    return Object.entries(record).map(([num, freq]) => ({
      number: Number(num),
      count: freq,
    }));
  }, [record]);

  if (!record) return null;

  const maxValue = Math.max(...chartData.map((d) => d.count));
  const minValue = Math.min(...chartData.map((d) => d.count));

  return (
    <div>
      <strong>{title}</strong>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={chartData}>
          <XAxis dataKey="number" />
          <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
          <RechartTooltip />

          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {chartData.map((d, index) => {
              const isMax = d.count === maxValue;
              const isMin = d.count === minValue;

              let barColor = color;

              if (isMax) barColor = "#ef4444";
              if (isMin) barColor = "#facc15";

              return <Cell key={index} fill={barColor} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const FreqChart = React.memo(FreqChartComponent);
