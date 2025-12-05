"use client";

import { useState, useEffect } from "react";
import type { LottoNumber } from "@/app/types/lotto";
import ResultCard from "@/app/components/lotto-history/ResultCard";
import { queryOptions } from "@/app/utils/queryOptions";
import RangeFilterBar from "@/app/components/RangeFilterBar";
import { apiUrl, getLatestRound } from "@/app/utils/getUtils";

export default function LottoHistoryPage() {
  // 클라이언트 전용으로 초기값 설정
  const [start, setStart] = useState<number>(getLatestRound() - 9);
  const [end, setEnd] = useState<number>(getLatestRound());
  const [results, setResults] = useState<LottoNumber[]>([]);
  const [query, setQuery] = useState<string>(queryOptions[0].value);
  const [limit, setLimit] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRecent, setSelectedRecent] = useState<number | null>(10);

  const latestRound = getLatestRound();

  // 🔹 디바운스 상태
  const [debouncedStart, setDebouncedStart] = useState(start);
  const [debouncedEnd, setDebouncedEnd] = useState(end);

  // 디바운스 적용
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedStart(Math.min(start, end)); // 유효 범위 보정
      setDebouncedEnd(Math.max(start, end));
    }, 500); // 500ms 동안 입력이 없으면 적용

    return () => clearTimeout(handler);
  }, [start, end]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("query", query);
        params.append("limit", String(limit));
        params.append("start", String(debouncedStart));
        params.append("end", String(debouncedEnd));

        const res = await fetch(`${apiUrl}/lotto/history?${params.toString()}`);
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

  return (
    <div className="w-full pt-6 px-4 sm:px-6 max-w-full sm:max-w-6xl mx-auto">
      <header className="mb-4 sm:mb-6 text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl font-bold">로또 히스토리</h1>
      </header>

      {/* Range UI */}
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

      {/* 검색 항목 + limit 컨트롤 */}
      <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center mb-4">
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

        <label>결과 개수</label>
        <input
          type="number"
          min={1}
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="px-3 py-2 border rounded-md w-full sm:w-32 text-center"
          placeholder="결과 개수"
        />
      </div>

      {/* 결과 카드 */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <p className="col-span-full text-center text-gray-500">로딩 중...</p>
        </div>
      ) : results && results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((record) => (
            <ResultCard key={record.drwNo} record={record} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">데이터가 없습니다.</div>
      )}
    </div>
  );
}
