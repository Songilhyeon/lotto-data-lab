// app/history/page.tsx (수정)
"use client";
import { useState, useEffect } from "react";
import type { LottoNumber } from "@/app/types/lotto";
import ResultCard from "@/app/components/history/ResultCard";
import { queryOptions } from "@/app/utils/queryOptions";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function LottoHistoryPage() {
  const [data, setData] = useState<LottoNumber[]>([]);
  const [query, setQuery] = useState(queryOptions[0].value);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!query) return setData([]);
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("query", query);

        const res = await fetch(
          `${url}/api/lotto/history?${params.toString()}`
        );
        const result = await res.json();

        if (Array.isArray(result.data)) setData(result.data);
        else setData([]);
      } catch (err) {
        console.error(err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  return (
    <div className="p-4 sm:p-6 max-w-full sm:max-w-6xl mx-auto">
      <header className="mb-4 sm:mb-6 text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl font-bold">로또 히스토리</h1>
      </header>

      {/* 검색 항목 드롭다운 */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mb-4">
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
      </div>

      {/* 결과 카드 */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <p className="col-span-full text-center text-gray-500">로딩 중...</p>
        </div>
      ) : data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((record) => (
            <ResultCard key={record.drwNo} record={record} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">데이터가 없습니다.</div>
      )}
    </div>
  );
}
