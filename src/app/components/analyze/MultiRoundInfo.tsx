"use client";

import { useState, useEffect, useRef } from "react";
import LottoPaper from "@/app/components/LottoPaper";
import LottoCard from "@/app/components/LottoCard";
import SimplePattern from "@/app/components/SimplePattern";
import RangeFilterBar from "@/app/components/RangeFilterBar";
import { LottoNumber } from "@/app/types/lotto";
import { apiUrl, getLatestRound } from "@/app/utils/getUtils";
import { analysisDivStyle, rangeFilterDivStyle } from "@/app/utils/getDivStyle";
import ComponentHeader from "@/app/components/ComponentHeader";
import LookUpButton from "@/app/components/analyze/LookUpButton";

const PAGE_SIZE = 12;

export default function MultiRoundInfo() {
  const latestRound = getLatestRound();
  const [start, setStart] = useState(latestRound - 9);
  const [end, setEnd] = useState(latestRound);
  const [includeBonus, setIncludeBonus] = useState(false);
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
    includeBonus: !includeBonus,
  });

  const fetchData = async () => {
    const prev = prevParamsRef.current;
    if (
      prev.start === start &&
      prev.end === end &&
      prev.includeBonus === includeBonus
    )
      return;

    setLoading(true);
    try {
      const res = await fetch(
        `${apiUrl}/lotto/rounds?start=${start}&end=${end}&includeBonus=${includeBonus}`
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
      prevParamsRef.current = { start, end, includeBonus };
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEndChange = (value: number) => {
    if (value < start) setStart(value);
    setEnd(value);
    setSelectedRecent(null);
  };

  const handleStartChange = (value: number) => {
    if (value > end) setEnd(value);
    setStart(value);
    setSelectedRecent(null);
  };

  const handleRecent = (count: number) => {
    setSelectedRecent(count);
    setStart(Math.max(1, end - count + 1));
    if (count === latestRound) setEnd(count);
  };

  const clearRecentSelect = () => setSelectedRecent(null);

  const totalPages = Math.ceil((lottoData || []).length / PAGE_SIZE);
  const pagedData = lottoData?.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className={`${analysisDivStyle()} from-green-50 to-purple-100`}>
      {/* Header */}
      <ComponentHeader
        title="📊 기간별 당첨 정보 조회"
        content="원하는 기간의 로또 정보를 조회하세요."
      />

      {/* Range Filter */}
      <div className={`${rangeFilterDivStyle} mt-3`}>
        <RangeFilterBar
          start={start}
          end={end}
          selectedRecent={selectedRecent}
          includeBonus={includeBonus}
          setStart={handleStartChange}
          setEnd={handleEndChange}
          setIncludeBonus={setIncludeBonus}
          latest={latestRound}
          onRecentSelect={handleRecent}
          clearRecentSelect={clearRecentSelect}
        />
      </div>

      {/* Fetch Button */}
      <div className="flex justify-start mt-3 mb-6 px-1 sm:px-0">
        <LookUpButton onClick={fetchData} loading={loading} />
      </div>

      {/* View Type Switcher */}
      <div className="flex flex-wrap gap-2 justify-center mt-2">
        {["card", "pattern", "paper"].map((type) => (
          <button
            key={type}
            onClick={() => setViewType(type as "card" | "pattern" | "paper")}
            className={`px-3 py-1.5 rounded-lg border text-sm sm:text-base font-medium transition-all
              ${
                viewType === type
                  ? "bg-blue-600 text-white border-blue-600 shadow"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
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

      {/* Loading */}
      {loading && (
        <div className="text-center text-gray-600 mt-4 text-base">
          데이터 불러오는 중...
        </div>
      )}

      {/* Data Grid */}
      <div
        className="
          grid grid-cols-1 
          sm:grid-cols-2 
          lg:grid-cols-3 
          gap-4 mt-6 pb-10
        "
      >
        {pagedData?.map((data) => {
          if (viewType === "card")
            return (
              <LottoCard
                key={data.drwNo}
                data={data}
                includeBonus={includeBonus}
              />
            );
          if (viewType === "pattern")
            return (
              <SimplePattern
                key={data.drwNo}
                data={data}
                includeBonus={includeBonus}
              />
            );
          if (viewType === "paper")
            return (
              <LottoPaper
                key={data.drwNo}
                data={data}
                includeBonus={includeBonus}
              />
            );
          return null;
        })}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-3 text-sm sm:text-base pb-8">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          className="px-4 py-2 rounded-lg border bg-white text-gray-700 disabled:opacity-40 hover:bg-gray-100"
        >
          이전
        </button>

        <span className="px-3 py-2 text-gray-700 font-semibold">
          {currentPage} / {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          className="px-4 py-2 rounded-lg border bg-white text-gray-700 disabled:opacity-40 hover:bg-gray-100"
        >
          다음
        </button>
      </div>
    </div>
  );
}
