"use client";

import { useState, useEffect, useMemo } from "react";
import type { LottoNumber } from "@/app/types/lottoNumbers";
import ResultCard from "@/app/components/lotto-history/ResultCard";
import { queryOptions } from "@/app/utils/queryOptions";
import RangeFilterBar from "@/app/components/RangeFilterBar";
import { apiUrl, getLatestRound } from "@/app/utils/getUtils";
import {
  componentBodyDivStyle,
  rangeFilterDivStyle,
} from "@/app/utils/getDivStyle";

export default function HistoryClient() {
  const latestRound = getLatestRound();

  const [start, setStart] = useState<number>(1);
  const [end, setEnd] = useState<number>(latestRound);
  const [results, setResults] = useState<LottoNumber[]>([]);
  const [query, setQuery] = useState<string>(queryOptions[0].value);
  const [limit, setLimit] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRecent, setSelectedRecent] = useState<number | null>(
    latestRound
  );

  const [debouncedStart, setDebouncedStart] = useState(start);
  const [debouncedEnd, setDebouncedEnd] = useState(end);

  // ✅ 현재 쿼리 라벨(배지용)
  const currentQueryLabel = useMemo(() => {
    return queryOptions.find((q) => q.value === query)?.label ?? "정렬 기준";
  }, [query]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedStart(Math.min(start, end));
      setDebouncedEnd(Math.max(start, end));
    }, 500);
    return () => clearTimeout(handler);
  }, [start, end]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          query,
          limit: String(limit),
          start: String(debouncedStart),
          end: String(debouncedEnd),
        });

        const res = await fetch(`${apiUrl}/lotto/record?${params.toString()}`);
        const result = await res.json();

        if (Array.isArray(result.data)) setResults(result.data);
        else setResults([]);
      } catch (err) {
        console.error(err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query, limit, debouncedStart, debouncedEnd]);

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

  return (
    <div className={`${componentBodyDivStyle()} from-indigo-50 to-purple-100`}>
      {/* Range UI */}
      <div className={rangeFilterDivStyle}>
        <RangeFilterBar
          start={start}
          end={end}
          setStart={handleStartChange}
          setEnd={handleEndChange}
          latest={latestRound}
          selectedRecent={selectedRecent}
          onRecentSelect={handleRecent}
          clearRecentSelect={clearRecentSelect}
          showCheckBox={false}
        />
      </div>

      {/* ✅ 현재 정렬 기준 배지 */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-xs sm:text-sm text-gray-600">현재 정렬 기준</span>
        <span className="inline-flex items-center rounded-full border border-indigo-200 bg-white/70 px-3 py-1 text-xs sm:text-sm font-semibold text-indigo-700 shadow-sm">
          {currentQueryLabel}
        </span>
        {query === "rollover1" && (
          <span className="text-xs sm:text-sm text-gray-500">
            (1등 당첨자 0명인 회차만)
          </span>
        )}
      </div>

      {/* 검색 + limit */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center mb-4">
        <select
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="px-3 py-2 border rounded-md w-full sm:w-64"
        >
          <option value="">검색 항목 선택</option>
          {queryOptions.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <label className="text-sm">결과 개수</label>
          <input
            type="number"
            min={1}
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="px-3 py-2 border rounded-md w-full sm:w-32 text-center"
          />
        </div>
      </div>

      {/* 결과 카드 */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <p className="col-span-full text-center text-gray-500">로딩 중...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((record) => (
            <ResultCard key={record.drwNo} record={record} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">데이터가 없습니다.</p>
      )}
    </div>
  );
}
