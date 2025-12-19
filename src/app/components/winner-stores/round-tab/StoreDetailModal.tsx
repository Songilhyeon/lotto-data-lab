"use client";

import { useState, useEffect } from "react";
import { LottoStore, StoreHistoryItem } from "@/app/types/stores";
import { apiUrl } from "@/app/utils/getUtils";
import { CardContent } from "@/app/components/winner-stores/Card";
import AddressLink from "../AddressLink";
import { useAuth } from "@/app/context/authContext";
import LockOverlay from "../LockOverlay";

interface StoreDetailModalProps {
  store: LottoStore;
  onClose: () => void;
  historyLimit?: number; // default 20
}

export default function StoreDetailModal({
  store,
  onClose,
  historyLimit = 20,
}: StoreDetailModalProps) {
  const [history, setHistory] = useState<Record<number, StoreHistoryItem[]>>({
    1: [],
    2: [],
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      try {
        const res = await fetch(
          `${apiUrl}/lotto/stores/history?store=${encodeURIComponent(
            store.store
          )}&address=${encodeURIComponent(store.address)}&limit=${historyLimit}`
        );
        const json = await res.json();
        setHistory({
          1: json[1]?.storeHistory ?? [],
          2: json[2]?.storeHistory ?? [],
        });
      } catch (err) {
        console.error(err);
        setHistory({ 1: [], 2: [] });
      }
      setLoading(false);
    }

    fetchHistory();
  }, [store, historyLimit]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white w-full max-w-xl h-[80vh] rounded-lg shadow-lg flex flex-col overflow-hidden">
        <CardContent className="p-4 sm:p-6 flex flex-col h-full min-h-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-2 shrink-0">
            <h2 className="text-lg font-semibold text-gray-800">
              {store.store} · 당첨 상세
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 text-xl font-bold"
            >
              &times;
            </button>
          </div>

          {/* Address */}
          <p className="text-sm text-gray-600 mb-3 shrink-0">
            <AddressLink address={store.address} />
          </p>

          {/* Scroll Area */}
          <div className="relative flex-1 min-h-0">
            <div className="h-full overflow-y-auto space-y-4 pr-1">
              {loading ? (
                <p className="text-sm text-gray-500">로딩 중...</p>
              ) : history[1].length === 0 && history[2].length === 0 ? (
                <p className="text-sm text-gray-500">당첨 이력이 없습니다.</p>
              ) : (
                <>
                  {/* Rank 1 */}
                  {history[1].length > 0 && (
                    <section>
                      <h3 className="text-sm font-medium text-gray-700 mb-1">
                        1등 당첨 내역
                      </h3>
                      <div className="grid grid-cols-[60px_1fr_1fr_1fr] gap-2 px-2 text-sm">
                        <div className="font-medium text-gray-700">회차</div>
                        <div className="text-center text-gray-500">자동</div>
                        <div className="text-center text-gray-500">반자동</div>
                        <div className="text-center text-gray-500">수동</div>

                        {history[1].map((h, idx) => (
                          <div key={idx} className="contents">
                            <div>{h.round}회차</div>
                            <div className="text-center bg-blue-100 text-blue-700 rounded">
                              {h.autoWin ?? 0}
                            </div>
                            <div className="text-center bg-green-100 text-green-700 rounded">
                              {h.semiAutoWin ?? 0}
                            </div>
                            <div className="text-center bg-purple-100 text-purple-700 rounded">
                              {h.manualWin ?? 0}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Rank 2 */}
                  {history[2].length > 0 && (
                    <section>
                      <h3 className="text-sm font-medium text-gray-700 mb-1">
                        2등 당첨 내역
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {history[2].map((h, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center px-2 py-1 bg-yellow-50 rounded text-sm"
                          >
                            <span>{h.round}회차</span>
                            <span className="font-medium">
                              {h.autoWin ?? 0}
                            </span>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </>
              )}
            </div>

            {!user && <LockOverlay />}
          </div>
        </CardContent>
      </div>
    </div>
  );
}
