"use client";

import { useState, useEffect } from "react";
import type { LottoNumber } from "@/app/types/lotto";
import ResultCard from "@/app/components/lotto-history/ResultCard";
import { queryOptions } from "@/app/utils/queryOptions";
import RangeFilterBar from "@/app/components/RangeFilterBar";
import { apiUrl, getLatestRound } from "@/app/utils/getUtils";
import ComponentHeader from "@/app/components/ComponentHeader";
import { analysisDivStyle, rangeFilterDivStyle } from "@/app/utils/getDivStyle";

export default function LottoHistoryPage() {
  const [start, setStart] = useState<number>(getLatestRound() - 9);
  const [end, setEnd] = useState<number>(getLatestRound());
  const [results, setResults] = useState<LottoNumber[]>([]);
  const [query, setQuery] = useState<string>(queryOptions[0].value);
  const [limit, setLimit] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRecent, setSelectedRecent] = useState<number | null>(10);

  const latestRound = getLatestRound();

  // 디바운스 상태
  const [debouncedStart, setDebouncedStart] = useState(start);
  const [debouncedEnd, setDebouncedEnd] = useState(end);

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
    <div className="p-4">
      <div className={`${analysisDivStyle()} from-indigo-50 to-purple-100`}>
        <ComponentHeader
          title="📊 로또 기록 순위"
          content="당첨자 수·금액·판매액 같은 기록을 TOP 순위로 가볍게 구경해요 ✨"
        />

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
            <p className="col-span-full text-center text-gray-500">
              로딩 중...
            </p>
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
    </div>
  );
}
