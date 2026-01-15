"use client";

import { useState, useEffect } from "react";
import { gaEvent } from "@/app/lib/gtag";

import AccumulateTab from "@/app/components/winner-stores/accumulate-tab/AccumulateTab";
import RoundStoresTab from "@/app/components/winner-stores/round-tab/RoundStoresTab";
import AllStoresTab from "@/app/components/winner-stores/all-tab/AllStoreTab";

import { LottoStore, WinnerStoresApiResponse } from "@/app/types/stores";
import { getLatestRound } from "@/app/utils/getUtils";

const tabs = [
  { id: "round", label: "회차별 당첨 판매점" },
  { id: "accumulate", label: "판매점 누적 통계" },
  { id: "all", label: "전체 판매점" },
];

export default function WinnerStoresClient() {
  const latestRound = getLatestRound();
  const [activeTab, setActiveTab] = useState<"round" | "accumulate" | "all">(
    "round"
  );

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

  return (
    <div className="mt-2">
      {/* 탭 UI */}
      <div className="overflow-x-auto scrollbar-hide mb-4">
        <div className="flex space-x-4 border-b border-gray-200 min-w-max pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(tab.id as "round" | "accumulate" | "all")
              }
              className={`px-3 py-2 text-sm sm:text-base rounded-t-lg whitespace-nowrap transition-all
                ${
                  activeTab === tab.id
                    ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                    : "text-gray-500 hover:text-gray-700"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 콘텐츠 (비활성 탭 언마운트) */}
      <div>
        {activeTab === "round" && (
          <RoundStoresTab
            selectedRank={selectedRank}
            setSelectedRank={setSelectedRank}
            selectedRound={selectedRound}
            setSelectedRound={setSelectedRound}
            latestRound={latestRound}
            roundStores={roundStores}
            setRoundStores={setRoundStores}
          />
        )}

        {activeTab === "accumulate" && (
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
        )}

        {activeTab === "all" && (
          <AllStoresTab
            selectedRank={selectedRank}
            setSelectedRank={setSelectedRank}
          />
        )}
      </div>
    </div>
  );
}
