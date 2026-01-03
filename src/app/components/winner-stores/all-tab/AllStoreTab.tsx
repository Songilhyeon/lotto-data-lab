"use client";

import { useEffect, useState, useCallback } from "react";
import { apiUrl } from "@/app/utils/getUtils";
import { Card, CardContent } from "@/app/components/winner-stores/Card";
import LockOverlay from "@/app/components/winner-stores/LockOverlay";
import AllStoreItem from "@/app/components/winner-stores/all-tab/AllStoreItem";
import StoreTimelineModal from "@/app/components/winner-stores/StoreTimelineModal";
import RankTabs from "@/app/components/winner-stores/RankTabs";
import useAuthGuard from "@/app/hooks/useAuthGuard";
import RegionTabs from "@/app/components/winner-stores/RegionTabs";
import { componentBodyDivStyle } from "@/app/utils/getDivStyle";

import type { GroupedStore, AllStoresApiResponse } from "@/app/types/stores";

interface Props {
  selectedRank: 1 | 2;
  setSelectedRank: (v: 1 | 2) => void;
}

/* ----------------------------
  정렬 타입
---------------------------- */
type SortKey = "name" | "latestRound" | "winCount" | "firstRound";
type SortOrder = "asc" | "desc";

export default function AllStoresTab({ selectedRank, setSelectedRank }: Props) {
  const { isAuthed } = useAuthGuard();

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
      정렬 상태 (API 연동)
  ---------------------------- */
  const [sortOption, setSortOption] = useState<{
    key: SortKey;
    order: SortOrder;
  }>({
    key: "latestRound",
    order: "desc",
  });

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  /* ----------------------------
      검색 적용 (동일 값이면 스킵 + trim)
  ---------------------------- */
  const applyKeyword = useCallback(() => {
    const next = searchKeyword.trim();
    if (next === appliedKeyword) return; // ✅ 동일 키워드면 스킵
    setAppliedKeyword(next);
    setCurrentPage(1);
  }, [searchKeyword, appliedKeyword]);

  /* ----------------------------
      Rank 변경 핸들러
  ---------------------------- */
  const handleRankChange = useCallback(
    (rank: 1 | 2) => {
      setSelectedRank(rank);
      setSelectedRegion("전국");
      setCurrentPage(1);
      setSearchKeyword("");
      setAppliedKeyword("");

      // Rank별 기본 정렬 UX
      setSortOption({
        key: rank === 1 ? "latestRound" : "winCount",
        order: "desc",
      });
    },
    [setSelectedRank]
  );

  /* ----------------------------
      데이터 로드 (AbortController + 로딩중 연타 방지)
  ---------------------------- */
  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;

    async function fetchStores() {
      setLoading(true);

      const params = new URLSearchParams({
        rank: String(selectedRank),
        page: String(currentPage),
        limit: String(pageSize),
        sortKey: sortOption.key,
        sortOrder: sortOption.order,
      });

      if (selectedRegion !== "전국") params.append("region", selectedRegion);
      if (appliedKeyword.trim()) params.append("q", appliedKeyword.trim());

      try {
        const res = await fetch(
          `${apiUrl}/lotto/stores/all?${params.toString()}`,
          { signal: controller.signal } // ✅ 이전 요청 취소 가능
        );

        if (!res.ok) throw new Error(`Request failed: ${res.status}`);

        const json: AllStoresApiResponse = await res.json();
        if (!mounted) return;

        setStores(json.stores);
        setTotal(json.total);
        setRegions(json.regions);
      } catch (e: unknown) {
        // ✅ Abort는 정상 흐름으로 취급
        if (e instanceof Error && e.name !== "AbortError") console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchStores();

    return () => {
      mounted = false;
      controller.abort(); // ✅ cleanup 시 이전 요청 취소
    };
  }, [selectedRank, selectedRegion, appliedKeyword, currentPage, sortOption]);

  return (
    <div className={`${componentBodyDivStyle()} from-violet-50 to-purple-100`}>
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
          if (loading) return; // ✅ 로딩 중 연타 방지
          setSelectedRegion(r);
          setCurrentPage(1);
        }}
      />

      <Card className="relative">
        <CardContent className="space-y-5 sm:space-y-6">
          {!isAuthed && <LockOverlay />}

          {/* 🔍 검색 + 정렬 */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            {/* 검색 영역 */}
            <div className="flex items-center gap-2 flex-1">
              <input
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyKeyword()}
                placeholder="판매점명 또는 주소"
                className="
                  h-9
                  flex-1
                  border
                  px-3
                  rounded-lg
                  text-sm
                  focus:outline-none
                  focus:ring-2
                  focus:ring-indigo-200
                "
              />
              <button
                disabled={loading} // ✅ 로딩 중 중복 요청 방지
                onClick={applyKeyword}
                className="
                  h-9
                  px-4
                  rounded-lg
                  bg-black
                  text-white
                  text-sm
                  font-medium
                  hover:bg-gray-800
                  active:bg-gray-900
                  transition
                  whitespace-nowrap
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                검색
              </button>
            </div>

            {/* 정렬 영역 */}
            <div className="flex items-center gap-2">
              <select
                disabled={loading} // ✅ 로딩 중 정렬 변경 방지
                value={sortOption.key}
                onChange={(e) => {
                  const nextKey = e.target.value as SortKey;
                  setSortOption((prev) =>
                    prev.key === nextKey ? prev : { ...prev, key: nextKey }
                  );
                  setCurrentPage(1);
                }}
                className="
                  h-9
                  border
                  rounded-lg
                  px-2.5
                  text-sm
                  bg-white
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                <option value="latestRound">최근 당첨순</option>
                <option value="winCount">당첨 횟수순</option>
                <option value="name">판매점명순</option>
                <option value="firstRound">최초 당첨순</option>
              </select>

              <button
                disabled={loading} // ✅ 로딩 중 토글 방지
                onClick={() =>
                  setSortOption((prev) => ({
                    ...prev,
                    order: prev.order === "asc" ? "desc" : "asc",
                  }))
                }
                className="
                  h-9
                  w-9
                  border
                  rounded-lg
                  text-sm
                  flex
                  items-center
                  justify-center
                  hover:bg-gray-100
                  transition
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
                title={sortOption.order === "asc" ? "오름차순" : "내림차순"}
              >
                {sortOption.order === "asc" ? "▲" : "▼"}
              </button>
            </div>
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
                disabled={loading || currentPage === 1} // ✅ 로딩 중 연타 방지
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="
                  px-4 py-2
                  rounded-lg
                  bg-gray-100
                  text-sm
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                  active:bg-gray-200
                "
              >
                이전
              </button>
              <span className="text-sm font-medium">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={loading || currentPage === totalPages} // ✅ 로딩 중 연타 방지
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className="
                  px-4 py-2
                  rounded-lg
                  bg-gray-100
                  text-sm
                  disabled:opacity-40
                  disabled:cursor-not-allowed
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
