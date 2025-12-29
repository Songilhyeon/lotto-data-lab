import { useState } from "react";
import LottoBall from "@/app/components/LottoBall";
import { LottoDraw } from "@/app/types/lottoNumbers";

interface ResultItem {
  round: number;
  numbers: number[];
  nextNumbers: number[];
}

interface ResultsListProps {
  results: ResultItem[];
  selectedRound?: LottoDraw;
}

const PAGE_SIZE = 12; // 한 페이지에 보여줄 카드 수

export default function SimilarPagination({
  results,
  selectedRound,
}: ResultsListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(results.length / PAGE_SIZE);
  const pagedResults = results.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <>
      {/* Results List */}
      {results.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
            🎯 검색된 회차
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {pagedResults.map((item) => (
              <div
                key={item.round}
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border-2 border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all"
              >
                <div className="mb-3">
                  <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-bold">
                    {item.round}회
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      {item.numbers.map((num) => (
                        <LottoBall
                          key={num}
                          number={num}
                          isSelected={selectedRound?.numbers.includes(num)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 페이지네이션 버튼 */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 rounded border bg-white text-gray-700 disabled:opacity-50"
              >
                이전
              </button>
              <span className="px-2 py-1">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className="px-3 py-1 rounded border bg-white text-gray-700 disabled:opacity-50"
              >
                다음
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
