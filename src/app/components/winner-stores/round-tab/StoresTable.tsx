// "use client";
import { useState, useEffect } from "react";
import { LottoStore } from "@/app/types/stores";
import AddressLink from "../AddressLink";
import { FaSearchPlus } from "react-icons/fa";
import { RiTimelineView } from "react-icons/ri";
import StoreDetailModal from "./StoreDetailModal";
import StoreTimelineModal from "../StoreTimelineModal";

interface StoresTableProps {
  stores: LottoStore[];
  rank: 1 | 2;
}

export default function StoresTable({ stores, rank }: StoresTableProps) {
  const [selectedStore, setSelectedStore] = useState<LottoStore | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowDetail(false);
        setShowTimeline(false);
        setSelectedStore(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      {/* 테이블 */}
      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-xs sm:text-sm">
              <th className="px-2 sm:px-3 py-2 text-left w-10">#</th>
              <th className="px-2 sm:px-3 py-2 text-left">
                판매점(타임라인보기)
              </th>
              <th className="px-2 sm:px-3 py-2 text-left hidden sm:table-cell">
                주소
              </th>
              <th className="px-2 sm:px-3 py-2 text-center w-14">상세</th>
              <th className="px-2 sm:px-3 py-2 text-center">
                {rank === 1 ? "자동 / 반자동 / 수동" : "당첨"}
              </th>
            </tr>
          </thead>

          <tbody>
            {stores.map((store, idx) => (
              <tr
                key={`${store.store}-${idx}`}
                className="
                  border-t
                  hover:bg-gray-50
                  active:bg-gray-100
                  transition
                "
              >
                {/* 번호 */}
                <td className="px-2 sm:px-3 py-2 text-gray-400">{idx + 1}</td>

                {/* 판매점 + 타임라인 */}
                <td className="px-2 sm:px-3 py-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedStore(store);
                        setShowTimeline(true);
                      }}
                      className="
                        text-left
                        font-medium text-gray-800
                        hover:underline
                        truncate
                      "
                    >
                      {store.store}
                    </button>

                    <button
                      onClick={() => {
                        setSelectedStore(store);
                        setShowTimeline(true);
                      }}
                      className="
                        flex items-center justify-center
                        w-7 h-7
                        rounded-full
                        text-gray-400
                        hover:text-blue-600
                        hover:bg-blue-50
                        active:bg-blue-100
                        transition
                        shrink-0
                      "
                      aria-label="타임라인 보기"
                    >
                      <RiTimelineView size={14} />
                    </button>
                  </div>
                </td>

                {/* 주소 (모바일 숨김) */}
                <td className="px-2 sm:px-3 py-2 text-gray-600 hidden sm:table-cell">
                  <AddressLink address={store.address} />
                </td>

                {/* 상세보기 */}
                <td className="px-2 sm:px-3 py-2 text-center">
                  <button
                    onClick={() => {
                      setSelectedStore(store);
                      setShowDetail(true);
                    }}
                    className="
                      inline-flex items-center justify-center
                      w-8 h-8
                      rounded-full
                      text-gray-500
                      hover:text-gray-700
                      hover:bg-gray-100
                      active:bg-gray-200
                      transition
                    "
                    aria-label="상세보기"
                  >
                    <FaSearchPlus size={14} />
                  </button>
                </td>

                {/* 당첨 정보 */}
                <td className="px-2 sm:px-3 py-2">
                  <div className="flex justify-center gap-1 flex-wrap">
                    {rank === 1 && (
                      <>
                        <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">
                          {store.autoWin ?? 0}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">
                          {store.semiAutoWin ?? 0}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-700">
                          {store.manualWin ?? 0}
                        </span>
                      </>
                    )}
                    {rank === 2 && (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-700">
                        {store.autoWin ?? 0}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 상세보기 모달 */}
      {selectedStore && showDetail && (
        <StoreDetailModal
          store={selectedStore}
          onClose={() => setShowDetail(false)}
        />
      )}

      {/* 타임라인 모달 */}
      {selectedStore && showTimeline && (
        <StoreTimelineModal
          store={selectedStore.store}
          address={selectedStore.address}
          onClose={() => setShowTimeline(false)}
        />
      )}
    </>
  );
}
