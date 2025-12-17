// "use client";
import { useState } from "react";
import { LottoStore } from "@/app/types/stores";
import StoreDetail from "./StoreDetail";
import AddressLink from "../AddressLink";
import { FaSearchPlus } from "react-icons/fa";

interface StoresTableProps {
  stores: LottoStore[];
  rank: 1 | 2;
}

export default function StoresTable({ stores, rank }: StoresTableProps) {
  const [selectedStore, setSelectedStore] = useState<LottoStore | null>(null);

  return (
    <>
      {/* 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm">
              <th className="px-3 py-2 text-left">번호</th>
              <th className="px-3 py-2 text-left">판매점</th>
              <th className="px-3 py-2 text-left">주소</th>
              <th className="px-3 py-2 text-left"></th>
              <th className="px-3 py-2 text-center">
                {rank === 1 ? "자동 / 반자동 / 수동" : "당첨 개수"}
              </th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store, idx) => (
              <tr
                key={`${store.store}-${idx}`}
                className="border-t text-sm hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedStore(store)}
              >
                <td className="px-3 py-2 text-gray-500">{idx + 1}</td>
                <td className="px-3 py-2 font-medium text-gray-800">
                  {store.store}
                </td>
                <td className="px-3 py-2 text-gray-600">
                  <AddressLink address={store.address} />
                </td>
                <td className="px-1 py-2 text-center">
                  <FaSearchPlus size={15} />
                </td>
                <td className="px-3 py-2 text-center flex justify-center gap-1">
                  {rank === 1 && (
                    <>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {store.autoWin ?? 0}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        {store.semiAutoWin ?? 0}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        {store.manualWin ?? 0}
                      </span>
                    </>
                  )}
                  {rank === 2 && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                      {store.autoWin ?? 0}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 상세보기 모달 */}
      {selectedStore && (
        <StoreDetail
          store={selectedStore}
          onClose={() => setSelectedStore(null)}
        />
      )}
    </>
  );
}
