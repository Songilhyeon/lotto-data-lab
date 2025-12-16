"use client";
import { LottoStore } from "@/app/types/stores";
import AddressLink from "./AddressLink";

interface Props {
  store: LottoStore;
  index: number;
  rank: 1 | 2;
}

export default function StoreRow({ store, index, rank }: Props) {
  return (
    <tr className="border-t text-sm hover:bg-gray-50">
      <td className="px-3 py-2 text-gray-500">{index + 1}</td>
      <td className="px-3 py-2 font-medium text-gray-800">{store.store}</td>
      <td className="px-3 py-2 text-gray-600">
        <AddressLink address={store.address} />
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
  );
}
