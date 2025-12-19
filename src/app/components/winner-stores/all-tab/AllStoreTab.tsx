"use client";

import { useEffect, useState } from "react";
import { apiUrl } from "@/app/utils/getUtils";
import { Card, CardContent } from "@/app/components/winner-stores/Card";
import LockOverlay from "@/app/components/winner-stores/LockOverlay";
import AllStoreItem from "@/app/components/winner-stores/all-tab/AllStoreItem";
import StoreTimelineModal from "@/app/components/winner-stores/StoreTimelineModal";
import RankTabs from "@/app/components/winner-stores/RankTabs";
import { useAuth } from "@/app/context/authContext";
import RegionTabs from "@/app/components/winner-stores/RegionTabs";
import { analysisDivStyle } from "@/app/utils/getDivStyle";

import type { GroupedStore, AllStoresApiResponse } from "@/app/types/stores";

interface Props {
  selectedRank: 1 | 2;
  setSelectedRank: (v: 1 | 2) => void;
}

export default function AllStoresTab({ selectedRank, setSelectedRank }: Props) {
  const { user } = useAuth();

  const [stores, setStores] = useState<GroupedStore[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState("전국");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const [total, setTotal] = useState(0);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [appliedKeyword, setAppliedKeyword] = useState("");

  const [loading, setLoading] = useState(false);

  const [timelineTarget, setTimelineTarget] = useState<{
    store: string;
    address: string;
  } | null>(null);

  /* ----------------------------
      데이터 로드
  ---------------------------- */
  useEffect(() => {
    let ignore = false;

    async function fetchStores() {
      setLoading(true);

      const params = new URLSearchParams({
        rank: String(selectedRank),
        page: String(currentPage),
        limit: String(pageSize),
      });

      if (selectedRegion !== "전국") params.append("region", selectedRegion);
      if (appliedKeyword.trim()) params.append("q", appliedKeyword.trim());

      try {
        const res = await fetch(
          `${apiUrl}/lotto/stores/all?${params.toString()}`
        );
        const json: AllStoresApiResponse = await res.json();
        if (ignore) return;

        setStores(json.stores);
        setTotal(json.total);
        setRegions(json.regions);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchStores();
    return () => {
      ignore = true;
    };
  }, [selectedRank, selectedRegion, appliedKeyword, currentPage]);

  const totalPages = Math.ceil(total / pageSize);

  function handleRankChange(rank: 1 | 2) {
    setSelectedRank(rank);
    setSelectedRegion("전국");
    setCurrentPage(1);
    setSearchKeyword("");
    setAppliedKeyword("");
  }

  return (
    <div className={`${analysisDivStyle()} from-indigo-50 to-purple-100`}>
      {/* Rank Tabs */}
      <RankTabs
        selectedRank={selectedRank}
        setSelectedRank={handleRankChange}
      />

      {/* 지역 필터 */}
      <RegionTabs
        regions={regions}
        selectedRegion={selectedRegion}
        setSelectedRegion={(r) => {
          setSelectedRegion(r);
          setCurrentPage(1);
        }}
      />

      <Card className="relative">
        <CardContent className="space-y-5 sm:space-y-6">
          {!user && <LockOverlay />}

          {/* 🔍 검색 */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <input
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && setAppliedKeyword(searchKeyword)
              }
              placeholder="판매점명 또는 주소 검색"
              className="
                border px-3 py-2.5
                rounded-lg
                w-full
                text-sm
                focus:outline-none focus:ring-2 focus:ring-indigo-200
              "
            />
            <button
              onClick={() => {
                setAppliedKeyword(searchKeyword);
                setCurrentPage(1);
              }}
              className="
                px-4 py-2.5
                rounded-lg
                bg-black text-white
                text-sm font-medium
                hover:bg-gray-800
                active:bg-gray-900
                transition
              "
            >
              검색
            </button>
          </div>

          {/* 리스트 */}
          {loading ? (
            <p className="text-sm text-gray-500">로딩 중...</p>
          ) : stores.length === 0 ? (
            <p className="text-sm text-gray-500">검색 결과가 없습니다.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {stores.map((store) => (
                <AllStoreItem
                  key={`${store.store}-${store.address}`}
                  store={store}
                  onOpenTimeline={() =>
                    setTimelineTarget({
                      store: store.store,
                      address: store.address,
                    })
                  }
                />
              ))}
            </div>
          )}

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 pt-2 sm:pt-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="
                  px-4 py-2
                  rounded-lg
                  bg-gray-100
                  text-sm
                  disabled:opacity-40
                  active:bg-gray-200
                "
              >
                이전
              </button>
              <span className="text-sm font-medium">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="
                  px-4 py-2
                  rounded-lg
                  bg-gray-100
                  text-sm
                  disabled:opacity-40
                  active:bg-gray-200
                "
              >
                다음
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 타임라인 모달 */}
      {timelineTarget && (
        <StoreTimelineModal
          store={timelineTarget.store}
          address={timelineTarget.address}
          onClose={() => setTimelineTarget(null)}
        />
      )}
    </div>
  );
}
