"use client";

import { useEffect, useState } from "react";
import { apiUrl } from "@/app/utils/getUtils";
import { CardContent } from "@/app/components/winner-stores/Card";
import AddressLink from "./AddressLink";
import { useAuth } from "@/app/context/authContext";
import LockOverlay from "./LockOverlay";

interface TimelineItem {
  drwNo: number;
  rank: number; // 1 | 2
  drwNoDate: string;
  autoWin?: number;
  semiAutoWin?: number;
  manualWin?: number;
}

interface TimelineYear {
  year: number;
  items: TimelineItem[];
}

interface StoreTimelineModalProps {
  store: string;
  address: string;
  onClose: () => void;
}

type YearFilter = "3" | "5" | "all";

export default function StoreTimelineModal({
  store,
  address,
  onClose,
}: StoreTimelineModalProps) {
  const [timeline, setTimeline] = useState<TimelineYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [yearFilter, setYearFilter] = useState<YearFilter>("3");
  const { user } = useAuth();

  useEffect(() => {
    async function fetchTimeline() {
      setLoading(true);
      try {
        const res = await fetch(
          `${apiUrl}/lotto/stores/timeline?store=${encodeURIComponent(
            store
          )}&address=${encodeURIComponent(address)}`
        );
        const json = await res.json();
        setTimeline(json.timeline ?? []);
      } catch (e) {
        console.error(e);
        setTimeline([]);
      }
      setLoading(false);
    }

    fetchTimeline();
  }, [store, address]);

  const currentYear = new Date().getFullYear();

  const filteredTimeline = timeline.filter((block) => {
    if (yearFilter === "all") return true;
    const limit = yearFilter === "3" ? 3 : 5;
    return block.year >= currentYear - (limit - 1);
  });

  /* =========================
    🔥 연속 계산: 최신 회차에만 표시
  ========================= */
  function calculateStreaks(items: TimelineItem[]) {
    const streakMap = new Map<number, number>();
    let streak = 1;
    let latesRound = 0;

    for (let i = 0; i < items.length; i++) {
      const current = items[i].drwNo;
      const next = items[i + 1]?.drwNo;
      if (streak === 1) latesRound = current;

      const gap = current - next;
      if (next && (gap === 1 || gap === 0)) {
        streak += gap;
      } else {
        if (streak >= 2) {
          // 🔥 최신 회차(끝 회차)에만 표시
          streakMap.set(latesRound, streak);
        }
        streak = 1;
      }
    }

    return streakMap;
  }

  /* =========================
    연속 블록 표시용 마킹
  ========================= */
  function markStreaks(items: TimelineItem[]) {
    return items.map((item, idx) => {
      const prev = items[idx - 1];
      const next = items[idx + 1];

      const isPrevConsecutive =
        prev &&
        (prev.drwNo - item.drwNo === 1 || prev.drwNo - item.drwNo === 0);
      const isNextConsecutive =
        next &&
        (item.drwNo - next.drwNo === 1 || item.drwNo - next.drwNo === 0);

      const isStreak = isPrevConsecutive || isNextConsecutive;

      return {
        ...item,
        isStreak,
        isStreakStart: !isPrevConsecutive && isNextConsecutive,
        isStreakEnd: isPrevConsecutive && !isNextConsecutive,
        isSingle: !isStreak,
      };
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white w-full max-w-2xl h-[85vh] rounded-lg shadow-lg flex flex-col overflow-hidden">
        <CardContent className="p-4 sm:p-6 flex flex-col h-full min-h-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-3 shrink-0">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {store} · 타임라인
              </h2>
              <p className="text-xs text-gray-500">
                <AddressLink address={address} />
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 text-xl font-bold"
            >
              &times;
            </button>
          </div>

          {/* 1️⃣ 필터 버튼 */}
          <div className="flex gap-2 mb-3">
            {[
              { key: "3", label: "최근 3년" },
              { key: "5", label: "최근 5년" },
              { key: "all", label: "전체" },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setYearFilter(f.key as YearFilter)}
                className={`px-3 py-1 rounded-full text-xs font-medium border
                  ${
                    yearFilter === f.key
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="relative flex-1 min-h-0">
            <div className="h-full overflow-y-auto space-y-8 pr-1">
              {loading ? (
                <p className="text-sm text-gray-500">로딩 중...</p>
              ) : filteredTimeline.length === 0 ? (
                <p className="text-sm text-gray-500">
                  타임라인 데이터가 없습니다.
                </p>
              ) : (
                filteredTimeline.map((yearBlock) => {
                  const streakMap = calculateStreaks(yearBlock.items);

                  return (
                    <section key={yearBlock.year}>
                      {/* Year Header */}
                      <div className="sticky top-0 z-10 bg-white py-2">
                        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <span>{yearBlock.year}년</span>
                          <span className="text-xs text-gray-400">
                            ({yearBlock.items.length}회)
                          </span>
                        </h3>
                      </div>

                      {/* Items */}
                      <div className="mt-2 space-y-2">
                        {markStreaks(yearBlock.items).map((item, idx) => (
                          <div
                            key={idx}
                            className={`
                                relative flex justify-between items-center px-3 py-2 text-sm
                                ${
                                  item.rank === 1
                                    ? "bg-blue-50"
                                    : "bg-yellow-50"
                                }
                                ${item.isStreak ? "bg-orange-50" : ""}
                                ${item.isSingle ? "rounded-md mb-2" : ""}
                                ${item.isStreakStart ? "rounded-t-md mt-2" : ""}
                                ${item.isStreakEnd ? "rounded-b-md mb-2" : ""}
                              `}
                          >
                            {/* Left */}
                            <div className="flex items-center gap-2 flex-wrap">
                              {item.isStreak && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-400 rounded-l-md" />
                              )}
                              <span className="font-medium">
                                {item.drwNo}회
                              </span>

                              {/* 🔥 최신 회차에만 표시 */}
                              {streakMap.has(item.drwNo) && (
                                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                                  🔥 {streakMap.get(item.drwNo)}연속
                                </span>
                              )}

                              <span className="text-xs text-gray-500">
                                {item.drwNoDate.slice(0, 10)}
                              </span>

                              <span
                                className={`px-2 py-0.5 rounded text-xs font-medium
                                  ${
                                    item.rank === 1
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-yellow-100 text-yellow-700"
                                  }`}
                              >
                                {item.rank}등
                              </span>
                            </div>

                            {/* Right */}
                            {item.rank === 1 ? (
                              <div className="flex gap-2 text-xs">
                                <span className="px-2 py-0.5 bg-blue-100 rounded">
                                  자동 {item.autoWin ?? 0}
                                </span>
                                <span className="px-2 py-0.5 bg-green-100 rounded">
                                  반자동 {item.semiAutoWin ?? 0}
                                </span>
                                <span className="px-2 py-0.5 bg-purple-100 rounded">
                                  수동 {item.manualWin ?? 0}
                                </span>
                              </div>
                            ) : (
                              <span className="px-2 py-0.5 bg-yellow-100 rounded text-xs">
                                {item.autoWin ?? 0}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>
                  );
                })
              )}
            </div>

            {!user && <LockOverlay />}
          </div>
        </CardContent>
      </div>
    </div>
  );
}
