"use client";
import { useEffect } from "react";
import { apiUrl } from "@/app/utils/getUtils";
import RoundStoresCard from "@/app/components/winner-stores/round-tab/RoundStoresCard";
import { LottoStore } from "@/app/types/stores";
import { getAddressInfo } from "@/app/utils/getUtils";
import RankTabs from "@/app/components/winner-stores/RankTabs";
import { componentBodyDivStyle } from "@/app/utils/getDivStyle";

interface Props {
  selectedRank: 1 | 2;
  setSelectedRank: (v: 1 | 2) => void;
  selectedRound: number;
  setSelectedRound: (v: number) => void;
  latestRound: number;
  roundStores: {
    1: LottoStore[];
    2: LottoStore[];
  };
  setRoundStores: React.Dispatch<
    React.SetStateAction<{
      1: LottoStore[];
      2: LottoStore[];
    }>
  >;
}

function sortStoresByAddress(stores: LottoStore[]) {
  return [...stores].sort((a, b) => {
    const aInfo = getAddressInfo(a.address);
    const bInfo = getAddressInfo(b.address);

    const priority = {
      NORMAL: 0,
      ONLINE: 1,
      EMPTY: 2,
    } as const;

    // 1️⃣ 주소 타입 우선순위
    if (aInfo.type !== bInfo.type) {
      return priority[aInfo.type] - priority[bInfo.type];
    }

    // 2️⃣ 정상 주소끼리 오름차순
    if (aInfo.type === "NORMAL" && bInfo.type === "NORMAL") {
      return a.address!.localeCompare(b.address!, "ko");
    }

    return 0;
  });
}

export default function RoundStoresTab({
  selectedRank,
  setSelectedRank,
  selectedRound,
  setSelectedRound,
  latestRound,
  roundStores,
  setRoundStores,
}: Props) {
  useEffect(() => {
    if (!selectedRound) return;

    async function load() {
      const res = await fetch(
        `${apiUrl}/lotto/stores/round?round=${selectedRound}`
      );
      const json: { 1: LottoStore[]; 2: LottoStore[] } = await res.json();

      setRoundStores({
        1: sortStoresByAddress(json[1] || []),
        2: sortStoresByAddress(json[2] || []),
      });
    }

    load();
  }, [selectedRound, setRoundStores]);

  return (
    <div className={`${componentBodyDivStyle()} from-green-50 to-pink-100`}>
      <RankTabs selectedRank={selectedRank} setSelectedRank={setSelectedRank} />

      <RoundStoresCard
        selectedRound={selectedRound}
        setSelectedRound={setSelectedRound}
        stores={roundStores[selectedRank]}
        rank={selectedRank}
        latestRound={latestRound}
      />
    </div>
  );
}
