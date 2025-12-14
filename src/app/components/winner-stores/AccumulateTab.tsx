"use client";
import { useEffect } from "react";
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
} from "@/app/types/stores";
import { useAuth } from "@/app/context/authContext";
import { getLowestN } from "@/app/utils/premiumPreview";
import PreviewTopStoresCard from "@/app/components/winner-stores/PreviewTopStoresCard";

interface Props {
  selectedRank: 1 | 2;
  setSelectedRank: (v: 1 | 2) => void;
  selectedRegion: string;
  setSelectedRegion: (v: string) => void;
  regions: string[];
  setRegions: (v: string[]) => void;
  data: WinnerStoresApiResponse | null;
  setData: (v: WinnerStoresApiResponse) => void;
}

export default function AccumulateTab({
  selectedRank,
  setSelectedRank,
  selectedRegion,
  setSelectedRegion,
  regions,
  setRegions,
  data,
  setData,
}: Props) {
  const { user } = useAuth();

  useEffect(() => {
    async function load() {
      const res = await fetch(`${apiUrl}/lotto/stores?rank=${selectedRank}`);
      const json: WinnerStoresApiResponse = await res.json();

      setData(json);

      const uniqueRegions = Array.from(
        new Set(
          json.nationwide.region
            .map((item) => item.region)
            .filter((r) => r !== "전국")
        )
      ).sort((a, b) => a.localeCompare(b, "ko"));

      setRegions(uniqueRegions);
      setSelectedRegion("전국");
    }

    load();
  }, [selectedRank, setData, setRegions, setSelectedRegion]);

  if (!data) return <div>Loading...</div>;

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
    <>
      <RankTabs selectedRank={selectedRank} setSelectedRank={setSelectedRank} />

      <RegionTabs
        regions={regions}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
      />

      {selectedRank === 1 && (
        <MethodStatsCard
          method={filteredMethodStats}
          title={`${selectedRegion} ${selectedRank}등 당첨 방식 비율`}
        />
      )}

      {user !== null ? (
        <TopStoresCard
          stores={filteredTopStores}
          rank={selectedRank}
          region={selectedRegion}
        />
      ) : (
        <PreviewTopStoresCard
          stores={filteredTopStores.map((s) => ({
            store: s.store,
            address: s.address,
            count: s.appearanceCount,
          }))}
          isPremium={user !== null}
        />
      )}

      <RegionChartCard
        data={filteredRegionStats}
        title={`지역별 ${selectedRank}등 배출 통계 (${selectedRegion})`}
      />
    </>
  );
}
