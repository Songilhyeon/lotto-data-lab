"use client";
import { useEffect, useState } from "react";
import { apiUrl } from "@/app/utils/getUtils";

import RankTabs from "@/app/components/winner-stores/RankTabs";
import RegionTabs from "@/app/components/winner-stores/RegionTabs";
import MethodStatsCard from "@/app/components/winner-stores/MethodStatsCard";
import TopStoresCard from "@/app/components/winner-stores/TopStoresCard";
import RegionChartCard from "@/app/components/winner-stores/RegionChartCard";

import {
  WinnerStoresApiResponse,
  TopStore,
  MethodStats,
  RegionStat,
} from "@/app/types/winnerStores";

export default function WinnerStoresPage() {
  const [selectedRank, setSelectedRank] = useState<1 | 2>(1);
  const [selectedRegion, setSelectedRegion] = useState("전국");
  const [regions, setRegions] = useState<string[]>([]);
  const [data, setData] = useState<WinnerStoresApiResponse | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch(`${apiUrl}/lotto/stores?rank=${selectedRank}`);
      const json: WinnerStoresApiResponse = await res.json();

      setData(json);

      const uniqueRegions = Array.from(
        new Set(
          json.nationwide.region
            .map((item) => item.region)
            .filter((region) => region !== "전국")
        )
      ).sort((a, b) => a.localeCompare(b, "ko"));

      setRegions(uniqueRegions);
      setSelectedRegion("전국");
    }

    load();
  }, [selectedRank]);
  if (!data) return <div>Loading...</div>;

  // ---------------------------
  // 파생 데이터 (타입 안전)
  // ---------------------------
  const filteredTopStores: TopStore[] =
    selectedRegion === "전국"
      ? data.nationwide.tops.map((item) => ({
          ...item,
          region: item.address.split(" ")[0].includes("동행복권")
            ? "인터넷"
            : item.address.split(" ")[0],
        }))
      : data.byRegion[selectedRegion]?.tops ?? [];

  const filteredMethodStats: MethodStats =
    selectedRegion === "전국"
      ? data.nationwide.method
      : data.byRegion[selectedRegion]?.method ?? data.nationwide.method;

  const filteredRegionStats: RegionStat[] =
    selectedRegion === "전국"
      ? data.nationwide.region
      : data.byRegion[selectedRegion]?.subRegionStats.map((item) => ({
          region: item.subRegion,
          regionCount: item.regionCount,
        })) ?? [];

  return (
    <div className="p-4">
      <header className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          당첨 지역 분석
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          회차 누적 기반의 판매점/지역 분석 데이터
        </p>
      </header>

      <RankTabs selectedRank={selectedRank} setSelectedRank={setSelectedRank} />

      <RegionTabs
        regions={regions}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
      />

      <MethodStatsCard
        method={filteredMethodStats}
        title={`${selectedRegion} ${selectedRank}등 당첨 방식 비율`}
      />

      <TopStoresCard
        stores={filteredTopStores}
        rank={selectedRank}
        region={selectedRegion}
      />

      <RegionChartCard
        data={filteredRegionStats}
        title={`지역별 ${selectedRank}등 배출 통계 (${selectedRegion})`}
      />
    </div>
  );
}
