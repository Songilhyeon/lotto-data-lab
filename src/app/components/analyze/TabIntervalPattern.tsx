"use client";

import { useState } from "react";
import useSWR from "swr";

import { apiUrl, getLatestRound } from "@/app/utils/getUtils";
import ComponentHeader from "@/app/components/ComponentHeader";
import RangeFilterBar from "@/app/components/RangeFilterBar";
import IntervalEnsembleBar from "./IntervalEnsembleBar";
import NumberEnsembleBar from "./NumberEnsembleBar";
import {
  componentBodyDivStyle,
  rangeFilterDivStyle,
} from "@/app/utils/getDivStyle";
import { buildIntervalEnsemble } from "@/app/utils/intervalUtils";
import ClusterUnitSelector from "../ai-recommend/ClusterUnitSelector";
import LookUpButton from "./LookUpButton";
import { IntervalUnitHelp, IntervalBucketLegend } from "./IntervalHelp";
import IntervalPatternTable from "./IntervalPatternTable";
import DraggableNextRound from "../DraggableNextRound";
import { LottoDraw } from "@/app/types/lottoNumbers";
import { PerNumberRow } from "@/app/types/api";

type IntervalPatternResponse = {
  ok: boolean;
  start: number;
  end: number;
  baseRound?: number;
  baseNumbers?: number[];
  perNumber: PerNumberRow[];
  ensemble: { num: number; score: number }[];
  nextRound?: LottoDraw;
};

const fetcher = async (url: string): Promise<IntervalPatternResponse> => {
  const res = await fetch(url, { credentials: "include" }); // ✅ 여기!
  if (!res.ok) throw new Error("API Error");
  return res.json();
};

export default function IntervalPatternTab() {
  const latestRound = getLatestRound();
  const [start, setStart] = useState(latestRound - 9);
  const [end, setEnd] = useState(latestRound);
  const [selectedRecent, setSelectedRecent] = useState<number | null>(10);
  const [intervalSize, setIntervalSize] = useState<5 | 7 | 10>(7);
  const [patternLen, setPatternLen] = useState<number>(5);
  const [query, setQuery] = useState<{ start: number; end: number }>({
    start: latestRound - 9,
    end: latestRound,
  });

  const swrKey = `${apiUrl}/lotto/premium/analysis/interval?start=${query.start}&end=${query.end}`;
  const { data, error, isLoading } = useSWR<IntervalPatternResponse>(
    swrKey,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
      keepPreviousData: true,
    }
  );

  const handleEndChange = (value: number) => {
    if (value < start) setStart(value);
    setEnd(value);
    setSelectedRecent(null);
  };

  const handleStartChange = (value: number) => {
    if (value > end) setEnd(value);
    setStart(value);
    setSelectedRecent(null);
  };

  const handleRecent = (count: number) => {
    setSelectedRecent(count);
    setStart(Math.max(1, end - count + 1));
    if (count === latestRound) setEnd(count);
  };

  const clearRecentSelect = () => setSelectedRecent(null);
  const fetchData = () => setQuery({ start, end });

  const intervalData = data?.ensemble
    ? buildIntervalEnsemble(data.ensemble, intervalSize, true)
    : [];

  if (error) return <div className="text-red-600">Interval 분석 오류</div>;

  return (
    <div className={`${componentBodyDivStyle()} from-indigo-50 to-purple-100`}>
      <ComponentHeader
        title="📐 Interval 패턴 분석"
        content="번호 출현 간격(Interval)의 분포 경향을 구간 단위로 분석합니다."
      />

      {data?.nextRound && (
        <div className="min-w-0">
          {/* DraggableNextRound는 내부에서 고정 포지셔닝을 처리함 */}
          <DraggableNextRound nextRound={data.nextRound} />
        </div>
      )}

      <div className={`${rangeFilterDivStyle} mt-3`}>
        <RangeFilterBar
          start={start}
          end={end}
          selectedRecent={selectedRecent}
          includeBonus={false}
          setStart={handleStartChange}
          setEnd={handleEndChange}
          setIncludeBonus={() => {}}
          latest={latestRound}
          onRecentSelect={handleRecent}
          clearRecentSelect={clearRecentSelect}
          showCheckBox={false}
        />
      </div>

      <div className="flex justify-start mt-3 mb-6">
        <LookUpButton onClick={fetchData} loading={isLoading} />
      </div>

      <ClusterUnitSelector
        clusterUnit={intervalSize}
        setClusterUnit={(v) => setIntervalSize(v as 5 | 7 | 10)}
      />
      <IntervalUnitHelp unit={intervalSize} />

      {isLoading && (
        <div className="mt-6 text-center text-gray-600">
          Interval 분석 중...
        </div>
      )}
      {!isLoading && !data && (
        <div className="mt-6 text-sm text-gray-500 text-center">
          조회 범위를 선택한 뒤 <b>조회</b> 버튼을 눌러주세요.
        </div>
      )}

      {!isLoading && data?.ok && (
        <div className="space-y-8 mt-6">
          <section>
            <h4 className="font-semibold mb-1">분석 구간</h4>
            <p className="text-sm text-gray-600">
              {data.start}회 ~ {data.end}회 ({data.end - data.start + 1}회차)
            </p>
          </section>

          <section>
            <h4 className="font-semibold mb-1">Interval 분포 요약 (앙상블)</h4>
            <p className="text-sm text-gray-500 mb-2">
              번호를 {intervalSize}단위 구간으로 묶어, 상대적으로 강했던 번호대
              흐름을 요약합니다.
            </p>
            <IntervalEnsembleBar data={intervalData} />
          </section>

          <section>
            <h4 className="font-semibold mb-1">다음 회차 번호 분포 (앙상블)</h4>
            <p className="text-sm text-gray-500 mb-2">
              Interval 분석 결과를 번호 단위 점수로 환산한 분포입니다.
            </p>
            <NumberEnsembleBar data={data.ensemble} />
          </section>

          <section>
            <h4 className="font-semibold mb-1">
              번호별 Interval 패턴 (근거 데이터)
            </h4>
            <p className="text-sm text-gray-500 mb-1">
              각 번호가 최근에 어떤 간격 패턴으로 출현했는지를 나타냅니다.
            </p>

            <IntervalBucketLegend />

            <div className="mt-4 mb-4 flex flex-wrap items-center gap-3">
              <label className="text-sm text-gray-700 font-medium">
                간격 패턴 횟수
              </label>
              <select
                value={patternLen}
                onChange={(e) => setPatternLen(Number(e.target.value))}
                className="border rounded-md px-2 py-1 text-sm"
              >
          {[3, 4, 5, 6, 7].map((len) => (
            <option key={len} value={len}>
              최근 {len}회
            </option>
          ))}
              </select>
            </div>

            <IntervalPatternTable
              data={data.perNumber}
              patternLen={patternLen}
              patternLabel={`최근 ${patternLen}회`}
            />
          </section>

          <section className="text-xs text-gray-400 border-t pt-4">
            ⚠️ 이 분석은 예측이 아닌, 선택 구간 내 <b>통계적 경향</b> 요약
            자료입니다.
          </section>
        </div>
      )}
    </div>
  );
}
