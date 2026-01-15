"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  componentBodyDivStyle,
  rangeFilterDivStyle,
} from "@/app/utils/getDivStyle";
import { apiUrl, getLatestRound } from "@/app/utils/getUtils";
import LookUpButton from "./LookUpButton";
import DraggableNextRound from "../DraggableNextRound";
import { LottoDraw } from "@/app/types/lottoNumbers";
import ComponentHeader from "@/app/components/ComponentHeader";
import LottoBall from "../LottoBall";

type RoundDistPattern = {
  numbers: number[];
  gaps: number[];
  buckets: string[];
  bucketDist: { S: number; M: number; L: number; XL: number };
  gapStats: { min: number; max: number; avg: number; median: number };
  patternStr: string;
};

type SimilarMatch = {
  matchedRound: number;
  matchedNumbers: number[];
  matchedGaps: number[];
  matchedPattern: string;
  similarity: number;
  nextRound: number;
  nextNumbers: number[];
};

type RoundPatternResponse = {
  ok: boolean;
  targetRound: number;
  pattern: RoundDistPattern;
  similarMatches: SimilarMatch[];
  prediction: {
    numbers: { num: number; score: number }[];
    patterns: { pattern: string; probability: number }[];
  };
  nextRound?: LottoDraw;
};

const fetcher = async (url: string): Promise<RoundPatternResponse> => {
  const res = await fetch(url, { credentials: "include" }); // ✅ 여기!
  if (!res.ok) throw new Error("API Error");
  return res.json();
};

export default function RoundDistPatternTab() {
  const latestRound = getLatestRound();
  const [targetRound, setTargetRound] = useState(latestRound);
  const [minSimilarity, setMinSimilarity] = useState(0.7);
  const [topN, setTopN] = useState(10);
  const [method, setMethod] = useState<"bucket" | "exact" | "hybrid">("hybrid");

  // API 요청을 위한 query state (null이면 요청 안 함)
  const [query, setQuery] = useState<{
    round: number;
    minSimilarity: number;
    topN: number;
    method: string;
  } | null>(null);

  const swrKey = query
    ? `${apiUrl}/lotto/premium/analysis/round-dist?round=${query.round}&minSimilarity=${query.minSimilarity}&topN=${query.topN}&method=${query.method}`
    : null;

  const { data, error, isLoading } = useSWR<RoundPatternResponse>(
    swrKey,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
      keepPreviousData: true,
    }
  );

  const fetchData = () => {
    setQuery({
      round: targetRound,
      minSimilarity,
      topN,
      method,
    });
  };

  return (
    <div className={`${componentBodyDivStyle()} from-indigo-50 to-purple-100`}>
      {/* Header */}
      <ComponentHeader
        title="📊 회차별 번호 분포 패턴 분석"
        content="선택 회차의 번호 간 간격 패턴을 분석하고, 과거 유사 패턴의 다음 회차를
          참고합니다."
      />

      {data?.nextRound && (
        <div className="min-w-0">
          {/* DraggableNextRound는 내부에서 고정 포지셔닝을 처리함 */}
          <DraggableNextRound nextRound={data.nextRound} />
        </div>
      )}

      {/* 설정 패널 */}
      <div className={rangeFilterDivStyle}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              분석 회차
            </label>
            <input
              type="number"
              value={targetRound}
              onChange={(e) => setTargetRound(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              max={latestRound}
              min={1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              최소 유사도 (0~1)
            </label>
            <input
              type="number"
              value={minSimilarity}
              onChange={(e) => setMinSimilarity(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              min={0}
              max={1}
              step={0.1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              패턴 매칭 개수
            </label>
            <input
              type="number"
              value={topN}
              onChange={(e) => setTopN(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              min={1}
              max={50}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              비교 방식
            </label>
            <select
              value={method}
              onChange={(e) =>
                setMethod(e.target.value as "bucket" | "exact" | "hybrid")
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="hybrid">Hybrid (추천)</option>
              <option value="bucket">Bucket (빠름)</option>
              <option value="exact">Exact (정밀)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 분석 시작 버튼 */}
      <div className="flex justify-start mt-3 mb-6">
        <LookUpButton onClick={fetchData} loading={isLoading} />
      </div>

      {/* 간격 버킷 설명 */}
      <div className="bg-blue-50/80 backdrop-blur-sm rounded-lg p-4 mb-6">
        <p className="font-semibold text-sm mb-2 text-gray-700">
          📏 간격 버킷 기준
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-600">
          <div>
            <span className="font-mono font-bold text-green-600">S</span>: ≤5
            (좁음)
          </div>
          <div>
            <span className="font-mono font-bold text-blue-600">M</span>: 6~10
            (중간)
          </div>
          <div>
            <span className="font-mono font-bold text-orange-600">L</span>:
            11~20 (넓음)
          </div>
          <div>
            <span className="font-mono font-bold text-red-600">XL</span>: 21+
            (매우 넓음)
          </div>
        </div>
      </div>

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="mt-6 text-center text-gray-600 bg-white/80 backdrop-blur-sm rounded-lg p-8">
          패턴 분석 중...
        </div>
      )}

      {/* 초기 상태 (조회 전) */}
      {!isLoading && !data && !error && (
        <div className="mt-6 text-sm text-gray-500 text-center bg-white/80 backdrop-blur-sm rounded-lg p-8">
          분석할 회차와 옵션을 선택한 뒤 <b>조회하기</b> 버튼을 눌러주세요.
        </div>
      )}

      {/* 에러 처리 */}
      {error && (
        <div className="text-red-600 bg-red-50/80 backdrop-blur-sm p-4 rounded-lg">
          분석 중 오류가 발생했습니다.
        </div>
      )}

      {/* 결과 표시 */}
      {!isLoading && data?.ok && (
        <div className="space-y-6">
          {/* 대상 회차 패턴 */}
          <section className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-6">
            <h3 className="font-bold text-lg mb-4 text-gray-800">
              🎯 {data.targetRound}회 분포 패턴
            </h3>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  당첨 번호
                </p>
                <div className="flex gap-2 flex-wrap">
                  {data.pattern.numbers.map((num) => (
                    <LottoBall key={num} number={num} />
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  번호 간 간격
                </p>
                <div className="flex gap-3 items-center flex-wrap">
                  {data.pattern.gaps.map((gap, idx) => (
                    <div key={idx} className="text-center">
                      <div className="text-xs text-gray-500 mb-1">
                        {data.pattern.buckets[idx]}
                      </div>
                      <div className="font-bold text-indigo-600 text-lg">
                        {gap}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-600">패턴</span>
                  <div className="font-mono font-bold text-indigo-600 mt-1">
                    {data.pattern.patternStr}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-600">최소</span>
                  <div className="font-bold text-gray-800 mt-1">
                    {data.pattern.gapStats.min}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-600">최대</span>
                  <div className="font-bold text-gray-800 mt-1">
                    {data.pattern.gapStats.max}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-600">평균</span>
                  <div className="font-bold text-gray-800 mt-1">
                    {data.pattern.gapStats.avg.toFixed(1)}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <span className="text-xs bg-green-100 text-green-800 px-3 py-1.5 rounded-full font-medium">
                  S: {data.pattern.bucketDist.S}개
                </span>
                <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full font-medium">
                  M: {data.pattern.bucketDist.M}개
                </span>
                <span className="text-xs bg-orange-100 text-orange-800 px-3 py-1.5 rounded-full font-medium">
                  L: {data.pattern.bucketDist.L}개
                </span>
                <span className="text-xs bg-red-100 text-red-800 px-3 py-1.5 rounded-full font-medium">
                  XL: {data.pattern.bucketDist.XL}개
                </span>
              </div>
            </div>
          </section>

          {/* 유사 패턴 매칭 결과 */}
          <section className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-6">
            <h3 className="font-bold text-lg mb-4 text-gray-800">
              🔍 유사 패턴 매칭 결과 ({data.similarMatches.length}개)
            </h3>

            {data.similarMatches.length > 0 ? (
              <div
                className="
      grid grid-cols-1 md:grid-cols-2
      gap-4
      max-h-[28rem] overflow-y-auto pr-2
    "
              >
                {data.similarMatches.map((match) => (
                  <div
                    key={match.matchedRound}
                    className="
          rounded-xl border border-gray-200 bg-white p-4 shadow-sm
          hover:shadow-md transition-shadow
        "
                  >
                    {/* 상단 헤더 */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-indigo-600">
                          {match.matchedRound}회
                        </span>
                        <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          {match.matchedPattern}
                        </span>
                      </div>

                      <span className="text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                        유사도 {(match.similarity * 100).toFixed(0)}%
                      </span>
                    </div>

                    {/* 번호 영역 */}
                    <div className="mb-3">
                      <div className="flex gap-1.5 flex-wrap">
                        {match.matchedNumbers.map((num) => (
                          <LottoBall key={num} number={num} size="sm" />
                        ))}
                      </div>
                    </div>

                    {/* 메타 정보 */}
                    <div className="grid grid-cols-1 gap-2 text-xs text-gray-600 mb-4">
                      <div>
                        <span className="font-medium text-gray-500">간격</span>
                        <div>{match.matchedGaps.join(", ")}</div>
                      </div>
                    </div>

                    {/* 다음 회차 */}
                    <div className="rounded-lg bg-gray-50 p-3 border border-gray-200">
                      <p className="text-xs text-gray-500 mb-2 font-medium">
                        → {match.nextRound}회 (다음 회차)
                      </p>
                      <div className="flex gap-1.5 flex-wrap">
                        {match.nextNumbers.map((num) => (
                          <LottoBall key={num} number={num} size="sm" />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-xl border border-dashed">
                <p className="font-medium">
                  유사도 {minSimilarity * 100}% 이상인 패턴이 없습니다
                </p>
                <p className="text-sm mt-1 text-gray-400">
                  최소 유사도를 낮춰보세요
                </p>
              </div>
            )}
          </section>

          {/* 예측 번호 */}
          {data.prediction.numbers.length > 0 && (
            <section className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-6">
              <h3 className="font-bold text-lg mb-2 text-gray-800">
                🎲 번호 점수
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                유사 패턴의 다음 회차 번호를 유사도 가중치로 집계한 결과입니다.
              </p>

              <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
                {data.prediction.numbers.slice(0, 20).map((item) => (
                  <div key={item.num} className="text-center">
                    <div className="w-11 h-11 rounded-full text-white flex items-center justify-center font-bold text-sm mx-auto shadow-md">
                      <LottoBall number={item.num} size="lg" />
                    </div>
                    <div className="text-xs text-gray-500 mt-1.5 font-medium">
                      {(item.score * 100).toFixed(0)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 예측 패턴 */}
          {data.prediction.patterns.length > 0 && (
            <section className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-6">
              <h3 className="font-bold text-lg mb-2 text-gray-800">
                📐 예측 패턴 분포
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                다음 회차에 나타날 가능성이 높은 간격 패턴들입니다.
              </p>

              <div className="space-y-2">
                {data.prediction.patterns.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold w-32 text-gray-700">
                      {item.pattern}
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-7 overflow-hidden relative">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full flex items-center justify-end pr-2 transition-all"
                        style={{ width: `${item.probability * 100}%` }}
                      ></div>
                      {/* 중앙 % 표시 */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-xs font-semibold text-green-500 drop-shadow-sm">
                          {(item.probability * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 경고 문구 */}
          <section className="text-xs text-gray-400 border-t border-gray-200 pt-4">
            ⚠️ 이 분석은 과거 유사 패턴의 <b>통계적 경향</b>을 참고한 것으로,
            실제 당첨을 보장하지 않습니다.
          </section>
        </div>
      )}
    </div>
  );
}
