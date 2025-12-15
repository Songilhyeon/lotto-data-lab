"use client";
import { Card, CardContent } from "@/app/components/winner-stores/Card";
import { LottoStore } from "@/app/types/stores";
import { MdLocationOn } from "react-icons/md";
import { getAddressInfo } from "@/app/utils/getUtils";

interface Props {
  selectedRound: number;
  setSelectedRound: (round: number) => void;
  stores: LottoStore[];
  rank: 1 | 2 | "all";
  latestRound: number; // 서버에서 내려준 최신 회차
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
              {rank === "all" ? "1·2등" : `${rank}등`} 당첨 판매점
            </h2>
            <p className="text-sm text-gray-500">
              특정 회차의 실제 당첨 판매점 정보
            </p>
          </div>

          {/* 회차 선택 */}
          <div className="flex items-center gap-2">
            {/* 이전 회차 */}
            <button
              onClick={() =>
                selectedRound && selectedRound > 1
                  ? setSelectedRound(selectedRound - 1)
                  : null
              }
              disabled={!selectedRound || selectedRound <= 1}
              className="w-10 h-10 rounded-xl border flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ←
            </button>

            {/* 회차 입력 */}
            <input
              type="number"
              min={1}
              max={latestRound}
              value={selectedRound ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                if (!v) return setSelectedRound(latestRound);
                const n = Number(v);
                if (n < 1 || n > latestRound) return;
                setSelectedRound(n);
              }}
              className="w-24 text-center px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* 다음 회차 */}
            <button
              onClick={() =>
                selectedRound && selectedRound < latestRound
                  ? setSelectedRound(selectedRound + 1)
                  : null
              }
              disabled={!selectedRound || selectedRound >= latestRound}
              className="w-10 h-10 rounded-xl border flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              →
            </button>

            <span className="ml-2 text-xs text-gray-400">
              최신 {latestRound}회
            </span>
          </div>
        </div>

        {/* 안내 */}
        {!selectedRound && (
          <div className="text-center text-gray-400 py-12">
            조회할 회차를 입력해주세요
          </div>
        )}

        {/* 결과 없음 */}
        {selectedRound && stores?.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            해당 회차의 당첨 판매점 데이터가 없습니다
          </div>
        )}

        {/* 판매점 리스트 */}
        {stores.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm">
                  <th className="px-3 py-2 text-left">번호</th>
                  <th className="px-3 py-2 text-left">판매점</th>
                  <th className="px-3 py-2 text-left">주소</th>
                  <th className="px-3 py-2 text-center">
                    {rank === 1 && "자동 / 반자동 / 수동"}
                    {rank === 2 && "당첨 개수"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {stores.map((store, idx) => (
                  <tr
                    key={`${store.store}-${idx}`}
                    className="border-t text-sm hover:bg-gray-50"
                  >
                    <td className="px-3 py-2 text-gray-500">{idx + 1}</td>

                    <td className="px-3 py-2 font-medium text-gray-800">
                      {store.store}
                    </td>

                    {/* 주소 + 네이버 지도 링크 */}
                    <td className="px-3 py-2 text-gray-600">
                      {(() => {
                        const info = getAddressInfo(store.address);

                        // 1️⃣ 정상 주소 → 지도 링크
                        if (info.type === "NORMAL") {
                          return (
                            <a
                              href={`https://m.map.naver.com/search2/search.nhn?query=${encodeURIComponent(
                                store.address!
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline text-blue-600 inline-flex items-center gap-1"
                            >
                              {store.address}
                              <MdLocationOn size={16} />
                            </a>
                          );
                        }

                        // 2️⃣ 온라인 판매 (동행복권)
                        if (info.type === "ONLINE") {
                          return (
                            <span className="inline-flex items-center gap-1 text-gray-500">
                              동행복권 온라인 판매
                            </span>
                          );
                        }

                        // 3️⃣ 주소 없음
                        return (
                          <span className="text-gray-400">주소 정보 없음</span>
                        );
                      })()}
                    </td>

                    <td className="px-3 py-2 text-center flex justify-center gap-1">
                      {/* 1등 */}
                      {rank === 1 && (
                        <>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            {store.autoWin ?? 0}
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            {store.semiAutoWin ?? 0}
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                            {store.manualWin ?? 0}
                          </span>
                        </>
                      )}

                      {/* 2등 */}
                      {rank === 2 && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                          {store.autoWin ?? 0}
                        </span>
                      )}

                      {/* all (1·2등 동시에) */}
                      {rank === "all" && (
                        <>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            1등 {store.autoWin ?? 0}
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                            2등 {store.semiAutoWin ?? 0}
                          </span>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
