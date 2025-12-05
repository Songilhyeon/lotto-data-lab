"use client";

import { useState, useEffect, useRef } from "react";
import LottoPaper from "@/app/components/LottoPaper";
import LottoCard from "@/app/components/LottoCard";
import SimplePattern from "@/app/components/SimplePattern";
import RangeFilterBar from "@/app/components/RangeFilterBar";
import { LottoNumber } from "@/app/types/lotto";
import { apiUrl, getLatestRound } from "@/app/utils/getUtils";

const PAGE_SIZE = 12; // 한 페이지에 보여줄 개수

export default function MultiRoundInfo() {
  const latestRound = getLatestRound();
  const [start, setStart] = useState(latestRound - 9);
  const [end, setEnd] = useState(latestRound);
  const [lottoData, setLottoData] = useState<LottoNumber[] | null>([]);
  const [viewType, setViewType] = useState<"card" | "pattern" | "paper">(
    "card"
  );
  const [selectedRecent, setSelectedRecent] = useState<number | null>(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const prevParamsRef = useRef({
    start: -1,
    end: -1,
  });

  /** ️API 호출 함수 */
  const fetchData = async () => {
    const prev = prevParamsRef.current;
    if (prev.start === start && prev.end === end) {
      console.log("⭐ same params, skip fetch");
      return; // ← fetch 실행 안 함
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${apiUrl}/lotto/rounds?start=${start}&end=${end}`
      );
      const json = await res.json();

      if (!json.success || !json.data) {
        setLottoData([]);
      } else {
        const sorted = [...json.data].sort((a, b) => b.drwNo - a.drwNo);
        setLottoData(sorted);
      }
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      setLottoData(null);
    } finally {
      setLoading(false);
      prevParamsRef.current = { start, end }; // ← params 저장
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /** ️⃣ RangeFilterBar 이벤트 START */
  // --- end 입력 시 recent 선택 해제 ---
  const handleEndChange = (value: number) => {
    if (value < start) setStart(value);
    setEnd(value);
    setSelectedRecent(null); // 수동 변경 시 recent 해제
  };

  // --- start 직접 수정 ---
  const handleStartChange = (value: number) => {
    if (value > end) setEnd(value);
    setStart(value);
    setSelectedRecent(null); // 수동 변경 시 recent 해제
  };

  const handleRecent = (count: number) => {
    setSelectedRecent(count);
    setStart(Math.max(1, end - count + 1));
    if (count === latestRound) setEnd(count);
  };

  const clearRecentSelect = () => setSelectedRecent(null);
  /** ️⃣ RangeFilterBar 이벤트 END */

  // --- 페이지네이션 계산 ---
  const totalPages = Math.ceil((lottoData || []).length / PAGE_SIZE);
  const pagedData =
    lottoData?.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE) ||
    [];

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-purple-100 p-4 sm:p-6 lg:p-8">
      {/* Range UI */}
      <RangeFilterBar
        start={start}
        end={end}
        selectedRecent={selectedRecent}
        setStart={handleStartChange}
        setEnd={handleEndChange}
        latest={latestRound}
        onRecentSelect={handleRecent}
        clearRecentSelect={clearRecentSelect}
        showCheckBox={false}
      />

      {/* 조회하기 버튼 */}
      <div className="flex justify-start mt-2 mb-6">
        <button
          onClick={fetchData}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
        >
          {loading ? "조회 중..." : "조회하기"}
        </button>
      </div>

      {/* viewType 선택 */}
      <div className="flex gap-3 justify-center mt-4">
        {["card", "pattern", "paper"].map((type) => (
          <button
            key={type}
            onClick={() => setViewType(type as "card" | "pattern" | "paper")}
            className={`px-4 py-2 rounded-lg border ${
              viewType === type
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            {type === "card"
              ? "당첨 정보"
              : type === "pattern"
              ? "단순 패턴"
              : "용지 패턴"}
          </button>
        ))}
      </div>

      {loading && (
        <div className="text-center text-gray-600 mt-6">
          데이터 불러오는 중...
        </div>
      )}

      {/* 데이터 표시 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center gap-5 mt-6">
        {pagedData.map((data) => {
          if (viewType === "card")
            return <LottoCard key={data.drwNo} data={data} />;
          if (viewType === "pattern")
            return <SimplePattern key={data.drwNo} data={data} />;
          if (viewType === "paper")
            return <LottoPaper key={data.drwNo} data={data} />;
          return null;
        })}
      </div>

      {/* 페이지네이션 버튼 */}
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
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          className="px-3 py-1 rounded border bg-white text-gray-700 disabled:opacity-50"
        >
          다음
        </button>
      </div>
    </div>
  );
}
