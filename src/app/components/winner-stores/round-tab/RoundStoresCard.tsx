"use client";
import { Card, CardContent } from "@/app/components/winner-stores/Card";
import { LottoStore } from "@/app/types/stores";
import RoundSelector from "./RoundSelector";
import StoresTable from "./StoresTable";

interface Props {
  selectedRound: number;
  setSelectedRound: (round: number) => void;
  stores: LottoStore[];
  rank: 1 | 2;
  latestRound: number;
}

export default function RoundStoresCard({
  selectedRound,
  setSelectedRound,
  stores,
  rank,
  latestRound,
}: Props) {
  return (
    <Card className="mt-6">
      <CardContent className="p-4 sm:p-6 space-y-6">
        {/* 헤더 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              {`${rank}등`} 당첨 판매점
            </h2>
            <p className="text-sm text-gray-500">
              특정 회차의 실제 당첨 판매점 정보
            </p>
          </div>

          {/* 회차 선택 */}
          <RoundSelector
            selectedRound={selectedRound}
            setSelectedRound={setSelectedRound}
            latestRound={latestRound}
          />
        </div>

        {/* 안내 / 결과 없음 */}
        {!selectedRound ? (
          <div className="text-center text-gray-400 py-12">
            조회할 회차를 입력해주세요
          </div>
        ) : stores?.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            해당 회차의 당첨 판매점 데이터가 없습니다
          </div>
        ) : (
          <StoresTable stores={stores} rank={rank} />
        )}
      </CardContent>
    </Card>
  );
}
