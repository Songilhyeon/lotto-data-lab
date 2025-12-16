"use client";
import { LottoStore } from "@/app/types/stores";
import StoreRow from "./StoreRow";

interface Props {
  stores: LottoStore[];
  rank: 1 | 2;
}

export default function StoresTable({ stores, rank }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 text-gray-600 text-sm">
            <th className="px-3 py-2 text-left">번호</th>
            <th className="px-3 py-2 text-left">판매점</th>
            <th className="px-3 py-2 text-left">주소</th>
            <th className="px-3 py-2 text-center">
              {rank === 1 && "자동 / 반자동 / 수동"}
              {rank === 2 && "당첨 개수"}
            </th>
          </tr>
        </thead>
        <tbody>
          {stores.map((store, idx) => (
            <StoreRow
              key={`${store.store}-${idx}`}
              store={store}
              index={idx}
              rank={rank}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
