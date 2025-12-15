"use client";

import { useState, useEffect } from "react";
// import { useAuth } from "@/app/context/authContext";
import { gaEvent } from "@/app/lib/gtag";

import AccumulateTab from "@/app/components/winner-stores/AccumulateTab";
import RoundTab from "@/app/components/winner-stores/RoundTab";

import { LottoStore, WinnerStoresApiResponse } from "@/app/types/stores";
import { getLatestRound } from "@/app/utils/getUtils";

const tabs = [
  { id: "round", label: "회차별 당첨 판매점" },
  { id: "accumulate", label: "전체 회차 판매점" },
];

export default function WinnerStoresPage() {
  // const { user } = useAuth();
  const latestRound = getLatestRound();

  const [activeTab, setActiveTab] = useState<"round" | "accumulate">("round");

  // 공통 상태
  const [selectedRound, setSelectedRound] = useState(latestRound);
  const [roundStores, setRoundStores] = useState<{
    1: LottoStore[];
    2: LottoStore[];
  }>({ 1: [], 2: [] });

  const [selectedRank, setSelectedRank] = useState<1 | 2>(1);
  const [selectedRegion, setSelectedRegion] = useState("전국");
  const [regions, setRegions] = useState<string[]>([]);
  const [data, setData] = useState<WinnerStoresApiResponse | null>(null);

  useEffect(() => {
    gaEvent("tab_change", { tab: activeTab });
  }, [activeTab]);

  // 🔒 로그인 안 했으면 여기서 끝
  // if (!user) {
  //   return (
  //     <div className="w-full flex justify-center mt-12 px-4">
  //       <div className="bg-white shadow-md rounded-2xl px-6 py-6 text-center max-w-md">
  //         <p className="text-lg font-semibold text-gray-800 mb-2">
  //           로그인이 필요해요 😊
  //         </p>
  //         <p className="text-sm text-gray-500">
  //           당첨 판매점 분석은 로그인 사용자만 이용할 수 있어요.
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="px-4 sm:px-6 pt-4 pb-10">
      {/* 탭 UI (기존 페이지 구조와 동일) */}
      <div className="overflow-x-auto scrollbar-hide mb-4">
        <div className="flex space-x-4 border-b border-gray-200 min-w-max pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "round" | "accumulate")}
              className={`px-3 py-2 text-sm sm:text-base rounded-t-lg whitespace-nowrap transition-all
                ${
                  activeTab === tab.id
                    ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                    : "text-gray-500 hover:text-gray-700"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 콘텐츠 (언마운트 방지) */}
      <div className="mt-2">
        <div style={{ display: activeTab === "round" ? "block" : "none" }}>
          <RoundTab
            selectedRound={selectedRound}
            setSelectedRound={setSelectedRound}
            latestRound={latestRound}
            roundStores={roundStores}
            setRoundStores={setRoundStores}
          />
        </div>

        <div style={{ display: activeTab === "accumulate" ? "block" : "none" }}>
          <AccumulateTab
            selectedRank={selectedRank}
            setSelectedRank={setSelectedRank}
            selectedRegion={selectedRegion}
            setSelectedRegion={setSelectedRegion}
            regions={regions}
            setRegions={setRegions}
            data={data}
            setData={setData}
          />
        </div>
      </div>
    </div>
  );
}
