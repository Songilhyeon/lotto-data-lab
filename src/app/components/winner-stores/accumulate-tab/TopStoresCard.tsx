"use client";

import { useState, useEffect } from "react";
import TopStoreItem from "./TopStoreItem";
import { Card, CardContent } from "@/app/components/winner-stores/Card";
import { TopStore, StoreHistoryItem } from "@/app/types/stores";
import { AccessLevel } from "@/app/types/users";
import LockOverlay from "@/app/components/winner-stores/LockOverlay";
import StoreHistoryChart from "@/app/components/winner-stores/accumulate-tab/StoreHistoryChart";
import { MdClose } from "react-icons/md";
import { apiUrl } from "@/app/utils/getUtils";

interface TopStoresCardProps {
  stores: TopStore[];
  rank: number;
  region: string;
  accessLevel: AccessLevel;
}

interface StoreHistoryResponse {
  totalCount: number;
  storeHistory: StoreHistoryItem[];
}

type StoreHistoryCacheKey = string;

function makeCacheKey(params: {
  store: string;
  address: string;
  rank: number;
  limit: number;
}): StoreHistoryCacheKey {
  return `${params.rank}|${params.store}|${params.address}|${params.limit}`;
}

// ⭐ 히스토리 fetch
async function fetchStoreHistory(params: {
  store: string;
  address: string;
  rank: number;
  limit: number;
}): Promise<StoreHistoryResponse> {
  const qs = new URLSearchParams({
    store: params.store,
    address: params.address,
    rank: String(params.rank),
    limit: String(params.limit),
  });

  const res = await fetch(`${apiUrl}/lotto/stores/history?${qs.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch history");

  const json = await res.json();
  return json[params.rank];
}

export default function TopStoresCard({
  stores,
  rank,
  region,
  accessLevel,
}: TopStoresCardProps) {
  const [selectedStore, setSelectedStore] = useState<TopStore | null>(null);
  const [historyData, setHistoryData] = useState<StoreHistoryItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // ⭐ 히스토리 캐시
  const [historyCache, setHistoryCache] = useState<
    Record<StoreHistoryCacheKey, StoreHistoryItem[]>
  >({});

  const [limit, setLimit] = useState(5);

  const isLocked = accessLevel === "GUEST";
  const previewCount = 5;
  const selectRank: 1 | 2 = rank === 2 ? 2 : 1;

  const visibleStores = isLocked
    ? [...stores]
        .sort((a, b) => a.appearanceCount - b.appearanceCount)
        .slice(0, previewCount)
    : stores;

  /** ESC로 모달 닫기 */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedStore(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  /** 🔥 히스토리 API + 캐싱 */
  useEffect(() => {
    if (!selectedStore) return;

    const cacheKey = makeCacheKey({
      store: selectedStore.store,
      address: selectedStore.address,
      rank,
      limit,
    });

    // ✅ 캐시 히트
    if (historyCache[cacheKey]) {
      setHistoryData(historyCache[cacheKey]);
      return;
    }

    let cancelled = false;

    const loadHistory = async () => {
      setLoading(true);
      try {
        const data = await fetchStoreHistory({
          store: selectedStore.store,
          address: selectedStore.address,
          rank,
          limit,
        });

        if (cancelled) return;
        setTotalCount(data.totalCount);

        setHistoryCache((prev) => ({
          ...prev,
          [cacheKey]: data.storeHistory,
        }));
        setHistoryData(data.storeHistory);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadHistory();

    return () => {
      cancelled = true;
    };
  }, [selectedStore, rank, limit, historyCache]);

  return (
    <Card className="relative overflow-hidden rounded-2xl shadow-lg bg-gradient-to-br from-white to-slate-50 border border-gray-200 mt-6">
      <CardContent className="p-6 sm:p-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-5 text-gray-800">
          {rank}등 최다 배출 판매점 TOP 10 ({region})
        </h2>

        <div className="relative">
          <div className="space-y-4">
            {visibleStores.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedStore(item)}
                className="w-full text-left"
              >
                <TopStoreItem
                  index={isLocked ? 0 : idx + 1}
                  rank={rank}
                  store={item.store}
                  address={item.address}
                  appearanceCount={item.appearanceCount}
                  autoWin={item.autoWin}
                  semiAutoWin={item.semiAutoWin}
                  manualWin={item.manualWin}
                />
              </button>
            ))}
          </div>

          {isLocked && <LockOverlay />}
        </div>
      </CardContent>

      {/* 모달 */}
      {selectedStore && !isLocked && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl w-11/12 max-w-3xl max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={() => setSelectedStore(null)}
            >
              <MdClose size={24} />
            </button>

            <div className="mb-4">
              <h3 className="text-lg font-semibold">{selectedStore.store}</h3>
              <p className="text-sm text-gray-500">{selectedStore.address}</p>
            </div>

            {/* ⭐ 최근 N회 선택 */}
            <div className="mb-4">
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="border rounded px-3 py-1 text-sm"
              >
                {totalCount > 5 && <option value={5}>최근 5회</option>}
                {totalCount > 10 && <option value={10}>최근 10회</option>}
                {totalCount > 20 && <option value={20}>최근 20회</option>}
                <option value={totalCount}>전체</option>
              </select>
            </div>

            {loading ? (
              <div className="text-center py-10 text-gray-500">
                히스토리 불러오는 중...
              </div>
            ) : (
              <StoreHistoryChart
                storeName={selectedStore.store}
                data={historyData}
                rank={selectRank}
              />
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
