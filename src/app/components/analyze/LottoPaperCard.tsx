import React from "react";
import { AnalysisResult } from "../../types/lotto";
import { getBallColor } from "../../utils/getBallColor";

interface Props {
  draw: AnalysisResult;
}

export default function LottoPaperCard({ draw }: Props) {
  return (
    <div
      className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center
                border border-gray-200 relative
                bg-[url('/paper-texture.png')] bg-cover
                hover:scale-[1.02] transition-transform duration-200
                "
    >
      <h2 className="font-semibold text-gray-700 mb-2">회차 {draw.drwNo}</h2>

      <div className="flex flex-wrap gap-2 justify-center">
        {draw.numbers.map((num) => (
          <span
            key={num}
            className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold
                        ${getBallColor(num)} ring-1 ring-gray-300`}
          >
            {num}
          </span>
        ))}
        {draw.bnusNo && (
          <span className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-400 text-white font-bold ring-1 ring-gray-300">
            {draw.bnusNo}
          </span>
        )}
      </div>

      <div className="text-sm text-gray-400 mt-1">
        {new Date(draw.drwNoDate).toLocaleDateString()}
      </div>
    </div>
  );
}
