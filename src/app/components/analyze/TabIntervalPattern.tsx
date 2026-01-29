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
import {
  buildIntervalEnsemble,
  getIntervalKey,
} from "@/app/utils/intervalUtils";
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
  ensemble: { num: number; score: number; support?: number }[];
  nextRound?: LottoDraw;
  patternLen?: number;
  minSample?: number;
  normalize?: "max" | "percentile";
};

const DEFAULT_RECENT_COUNT = 100;
const DEFAULT_INTERVAL_SIZE = 7;
const DEFAULT_PATTERN_LEN = 3;
const DEFAULT_MIN_SAMPLE = 3;
const DEFAULT_NORMALIZE: "max" | "percentile" = "max";

const fetcher = async (url: string): Promise<IntervalPatternResponse> => {
  const res = await fetch(url, { credentials: "include" }); // ✅ 여기!
  if (!res.ok) {
    let msg = "API Error";
    try {
      const data = await res.json();
      msg = data?.message || data?.error || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
};

export default function IntervalPatternTab() {
  const latestRound = getLatestRound();
  const [start, setStart] = useState(latestRound - DEFAULT_RECENT_COUNT + 1);
  const [end, setEnd] = useState(latestRound);
  const [selectedRecent, setSelectedRecent] = useState<number | null>(
    DEFAULT_RECENT_COUNT,
  );
  const [intervalSize, setIntervalSize] =
    useState<5 | 7 | 10>(DEFAULT_INTERVAL_SIZE);
  const [patternLen, setPatternLen] = useState<3 | 4 | 5 | 6 | 7>(
    DEFAULT_PATTERN_LEN,
  );
  const [minSample, setMinSample] = useState<3 | 5 | 7>(DEFAULT_MIN_SAMPLE);
  const [normalize, setNormalize] = useState<"max" | "percentile">(
    DEFAULT_NORMALIZE,
  );
  const [query, setQuery] = useState<{
    start: number;
    end: number;
    patternLen: number;
    minSample: number;
    normalize: "max" | "percentile";
  }>({
    start: latestRound - DEFAULT_RECENT_COUNT + 1,
    end: latestRound,
    patternLen: DEFAULT_PATTERN_LEN,
    minSample: DEFAULT_MIN_SAMPLE,
    normalize: DEFAULT_NORMALIZE,
  });

  const swrKey = `${apiUrl}/lotto/premium/analysis/interval?start=${query.start}&end=${query.end}&patternLen=${query.patternLen}&minSample=${query.minSample}&normalize=${query.normalize}`;
  const { data, error, isLoading, mutate } = useSWR<IntervalPatternResponse>(
    swrKey,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
      dedupingInterval: 0,
      shouldRetryOnError: false,
      errorRetryCount: 0,
      keepPreviousData: true,
    },
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
  const fetchData = () => {
    const nextQuery = {
      start,
      end,
      patternLen,
      minSample,
      normalize,
    };
    if (
      query.start === nextQuery.start &&
      query.end === nextQuery.end &&
      query.patternLen === nextQuery.patternLen &&
      query.minSample === nextQuery.minSample &&
      query.normalize === nextQuery.normalize
    ) {
      mutate();
      return;
    }
    setQuery(nextQuery);
  };

  const intervalData = data?.ensemble
    ? buildIntervalEnsemble(data.ensemble, intervalSize, true)
    : [];
  const nextRoundNumbers = data?.nextRound?.numbers ?? [];
  const highlightIntervals = new Set(
    nextRoundNumbers.map((num) => getIntervalKey(num, intervalSize)),
  );
  const highlightNumbers = new Set(nextRoundNumbers);
  const supportValues =
    data?.ensemble
      ?.map((row) => row.support ?? 0)
      .filter((v) => v > 0) ?? [];
  const supportStats = supportValues.length
    ? {
        avg:
          supportValues.reduce((sum, v) => sum + v, 0) / supportValues.length,
        max: Math.max(...supportValues),
        min: Math.min(...supportValues),
      }
    : null;

  const errorMessage =
    error instanceof Error ? error.message : "Interval 분석 오류";

  return (
    <div className={`${componentBodyDivStyle()} from-indigo-50 to-purple-100`}>
      <ComponentHeader
        title="📐 간격 패턴 분석"
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

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Interval 분석 오류: {errorMessage}
        </div>
      )}

      <div className="flex justify-start mt-3 mb-6">
        <LookUpButton onClick={fetchData} loading={isLoading} />
      </div>

      <ClusterUnitSelector
        clusterUnit={intervalSize}
        setClusterUnit={(v) => setIntervalSize(v as 5 | 7 | 10)}
      />
      <IntervalUnitHelp unit={intervalSize} />

      <div className="mt-4 flex flex-wrap items-start gap-3 text-sm">
        <label className="flex flex-col gap-1">
          <span className="font-medium text-gray-700">패턴 길이</span>
          <select
            value={patternLen}
            onChange={(e) =>
              setPatternLen(Number(e.target.value) as 3 | 4 | 5 | 6 | 7)
            }
            className="rounded-md border border-gray-200 bg-white px-2 py-1 text-sm"
          >
            {[3, 4, 5, 6, 7].map((len) => (
              <option key={len} value={len}>
                최근 {len}회
              </option>
            ))}
          </select>
          <span className="text-xs text-gray-500">최근 간격 개수</span>
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-medium text-gray-700">최소 샘플</span>
          <select
            value={minSample}
            onChange={(e) => setMinSample(Number(e.target.value) as 3 | 5 | 7)}
            className="rounded-md border border-gray-200 bg-white px-2 py-1 text-sm"
          >
            {[3, 5, 7].map((cnt) => (
              <option key={cnt} value={cnt}>
                {cnt}회 이상
              </option>
            ))}
          </select>
          <span className="text-xs text-gray-500">표본이 적으면 제외</span>
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-medium text-gray-700">정규화 방식</span>
          <select
            value={normalize}
            onChange={(e) =>
              setNormalize(
                e.target.value === "percentile" ? "percentile" : "max",
              )
            }
            className="rounded-md border border-gray-200 bg-white px-2 py-1 text-sm"
          >
            <option value="max">최대값 기준</option>
            <option value="percentile">분위수 기준</option>
          </select>
          <span className="text-xs text-gray-500">
            최대값/순위 기준
          </span>
        </label>
      </div>

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
            <h4 className="font-semibold mb-1">Interval 분포 요약</h4>
            <p className="text-sm text-gray-500 mb-2">
              번호를 {intervalSize}단위 구간으로 묶어, 상대적으로 강했던 번호대
              흐름을 요약합니다.
            </p>
            <IntervalEnsembleBar
              data={intervalData}
              highlightIntervals={highlightIntervals}
            />
          </section>

          <section>
            <h4 className="font-semibold mb-1">다음 회차 번호 분포</h4>
            <p className="text-sm text-gray-500 mb-2">
              Interval 분석 결과를 번호 단위 점수로 환산한 분포입니다.
            </p>
            {supportStats && (
              <div className="mb-2 text-xs text-gray-500">
                신뢰도(표본) 평균 {supportStats.avg.toFixed(1)} · 최대{" "}
                {supportStats.max} · 최소 {supportStats.min}
              </div>
            )}
            <NumberEnsembleBar
              data={data.ensemble}
              highlightNumbers={highlightNumbers}
            />
          </section>

          <section>
            <h4 className="font-semibold mb-1">
              번호별 Interval 패턴 (근거 데이터)
            </h4>
            <p className="text-sm text-gray-500 mb-1">
              각 번호가 최근에 어떤 간격 패턴으로 출현했는지를 나타냅니다.
            </p>

            <IntervalBucketLegend />

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
