"use client";

import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { StoreHistoryItem } from "@/app/types/stores";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type ChartMode = "stacked" | "grouped";

interface Props {
  storeName: string;
  data: StoreHistoryItem[];
  rank: 1 | 2;
}

export default function StoreHistoryChart({ storeName, data, rank }: Props) {
  const [mode, setMode] = useState<ChartMode>("stacked");

  const chartData =
    rank === 1
      ? {
          labels: data.map((d) => d.round),
          datasets: [
            {
              label: "자동",
              data: data.map((d) => d.autoWin),
              backgroundColor: "rgba(59, 130, 246, 0.7)",
              hoverBackgroundColor: "rgba(59, 130, 246, 0.9)",
              borderColor: "rgba(255,255,255,0.8)",
              borderWidth: 1,
            },
            {
              label: "반자동",
              data: data.map((d) => d.semiAutoWin),
              backgroundColor: "rgba(34, 197, 94, 0.7)",
              hoverBackgroundColor: "rgba(34, 197, 94, 0.9)",
              borderColor: "rgba(255,255,255,0.8)",
              borderWidth: 1,
            },
            {
              label: "수동",
              data: data.map((d) => d.manualWin),
              backgroundColor: "rgba(168, 85, 247, 0.7)",
              hoverBackgroundColor: "rgba(168, 85, 247, 0.9)",
              borderColor: "rgba(255,255,255,0.8)",
              borderWidth: 1,
            },
          ],
        }
      : {
          labels: data.map((d) => d.round),
          datasets: [
            {
              label: "당첨 건수",
              data: data.map((d) => d.autoWin + d.semiAutoWin + d.manualWin),
              backgroundColor: "rgba(107, 114, 128, 0.7)", // gray-500
              hoverBackgroundColor: "rgba(107, 114, 128, 0.9)",
              borderRadius: 6,
            },
          ],
        };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text:
          rank === 1
            ? `${storeName} 1등 당첨 히스토리`
            : `${storeName} 2등 당첨 히스토리`,
      },
      legend: {
        display: rank === 1,
      },
    },
    scales: {
      x: {
        stacked: rank === 1 && mode === "stacked",
      },
      y: {
        stacked: rank === 1 && mode === "stacked",
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: (value) => Number(value).toFixed(0),
        },
      },
    },
  };

  return (
    <div>
      {/* 🔘 토글 버튼 */}
      {rank === 1 && (
        <div className="flex justify-end gap-2 mb-3">
          <button
            onClick={() => setMode("stacked")}
            className={`px-3 py-1 text-sm rounded ${
              mode === "stacked"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            스택
          </button>
          <button
            onClick={() => setMode("grouped")}
            className={`px-3 py-1 text-sm rounded ${
              mode === "grouped"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            분리
          </button>
        </div>
      )}

      <Bar options={options} data={chartData} />
    </div>
  );
}
