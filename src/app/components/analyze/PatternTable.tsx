import React from "react";
import { AnalysisResult } from "../../types/lotto";

interface Props {
  results: AnalysisResult[];
  includeBonus: boolean;
}

export default function PatternTable({ results, includeBonus }: Props) {
  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
      <h2 className="font-semibold text-gray-700 mb-2">홀짝 패턴</h2>
      <table className="min-w-full text-center text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-2 py-1">회차</th>
            {[...Array(6)].map((_, i) => (
              <th key={i} className="px-2 py-1">
                번호 {i + 1}
              </th>
            ))}
            {includeBonus && <th className="px-2 py-1">보너스</th>}
          </tr>
        </thead>
        <tbody>
          {results.map((draw) => (
            <tr key={draw.drwNo} className="odd:bg-gray-50 even:bg-gray-100">
              <td className="px-2 py-1 font-semibold">{draw.drwNo}</td>
              {draw.numbers.map((num) => (
                <td key={num} className="px-2 py-1">
                  <span
                    className={`px-2 py-1 rounded-full text-white font-bold ${
                      num % 2 === 0 ? "bg-blue-500" : "bg-red-500"
                    }`}
                  >
                    {num % 2 === 0 ? "짝" : "홀"}
                  </span>
                </td>
              ))}
              {includeBonus && (
                <td className="px-2 py-1">
                  <span className="px-2 py-1 rounded-full text-white bg-gray-400 font-bold">
                    {draw.bnusNo}
                  </span>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
