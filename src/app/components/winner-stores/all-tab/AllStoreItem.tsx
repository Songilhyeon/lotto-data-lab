"use client";

import { GroupedStore } from "@/app/types/stores";
import { RiTimelineView } from "react-icons/ri";
import AddressLink from "@/app/components/winner-stores/AddressLink";

interface Props {
  store: GroupedStore;
  onOpenTimeline: () => void;
}

export default function AllStoreItem({ store, onOpenTimeline }: Props) {
  return (
    <div
      className="
        border rounded-xl
        p-3 sm:p-4
        bg-white
        hover:bg-gray-50
        transition
      "
    >
      {/* 상단 */}
      <div className="flex justify-between items-start gap-3">
        {/* 정보 */}
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">
            {store.store}
          </h3>
          <p className="text-[11px] sm:text-xs text-gray-500 truncate mt-0.5">
            <AddressLink address={store.address} />
          </p>
        </div>

        {/* 타임라인 버튼 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenTimeline();
          }}
          className="
            flex items-center justify-center
            w-9 h-9 sm:w-8 sm:h-8
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
          <RiTimelineView size={20} className="sm:text-[18px]" />
        </button>
      </div>

      {/* 하단 */}
      <div
        className="
          mt-2
          flex flex-col
          sm:flex-row sm:items-center sm:justify-between
          gap-1 sm:gap-3
          text-[11px] sm:text-xs
          text-gray-600
        "
      >
        <span className="font-medium">총 {store.totalWins}회</span>

        <div className="flex gap-2 sm:gap-4 text-gray-400">
          <span>최근 {store.lastWinDrwNo}회</span>
          <span>최초 {store.firstWinDrwNo}회</span>
        </div>
      </div>
    </div>
  );
}
