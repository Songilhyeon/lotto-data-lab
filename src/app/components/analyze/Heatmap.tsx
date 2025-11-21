import React from "react";

interface Props {
  freqPerNumber: Record<number, number>;
  roundsPerNumber: Record<number, number[]>;
  maxFreq: number;
}

export default function Heatmap({
  freqPerNumber,
  roundsPerNumber,
  maxFreq,
}: Props) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 overflow-x-auto">
      <h2 className="font-semibold text-gray-700 mb-2">
        히트맵 (번호 등장 빈도)
      </h2>
      <div className="grid grid-cols-9 gap-2">
        {Array.from({ length: 45 }, (_, i) => {
          const num = i + 1;
          const count = freqPerNumber[num] || 0;
          const intensity = count / maxFreq;
          return (
            <div
              key={num}
              className="w-10 h-10 flex items-center justify-center rounded-full text-white font-bold cursor-pointer transition-all"
              style={{
                backgroundColor: `rgba(59, 130, 246, ${intensity})`,
              }}
              title={`번호 ${num}\n회차: ${
                roundsPerNumber[num]?.join(", ") || "-"
              }`}
            >
              {num}
            </div>
          );
        })}
      </div>
    </div>
  );
}
