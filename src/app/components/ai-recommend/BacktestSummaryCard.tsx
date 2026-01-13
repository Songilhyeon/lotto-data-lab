"use client";

import { useEffect, useMemo, useState } from "react";
import { apiUrl } from "@/app/utils/getUtils";

type HitDist = Record<string, number>;

type BacktestSummary = {
  modelKey: string;
  range: { start: number; end: number; span: number };
  totalRuns: number;
  avgHits: number;
  hitDist: HitDist;
  p3plus: number;
  p4plus: number;
  computedAt: string;
  cache: { hit: boolean; ttlSecondsLeft: number };
};

type Weights = {
  hot: number;
  cold: number;
  streak: number;
  pattern: number;
  cluster: number;
  random: number;
  nextFreq: number;
};

type VariantKey = "strict" | "pattern" | "cluster" | "decay" | "chaos";

type Props = {
  modelKey?: "ai_basic" | "ai_next" | "ai_variant" | "ai_advanced";
  clusterUnit?: number;
  start?: number;
  end?: number;
  span?: number;
  weights?: Partial<Weights>; // ✅ 추가
  variantKey?: VariantKey;
  presetName?: string;
  title?: string;
  manualRefresh?: boolean;
  showRefreshButton?: boolean;
};

const AI_MODEL = {
  ai_basic: "AI 기본 모델 · 과거 흐름 점검",
  ai_next: "AI 다음회차 기반 모델 · 과거 흐름 점검",
  ai_v3: "AI 모델 v3 · 과거 흐름 점검",
  ai_variant: "AI 전략형 모델 · 과거 흐름 점검",
  ai_advanced: "AI 심층 모델 · 과거 흐름 점검",
};

function buildQuery(params: Record<string, string | number | undefined>) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined) continue;
    q.set(k, String(v));
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}

function fmt2(n: number) {
  return Math.round(n * 100) / 100;
}

function withRefreshParam(baseUrl: string) {
  const joiner = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${joiner}__r=${Date.now()}`;
}

export default function BacktestSummaryCard({
  modelKey = "ai_basic",
  clusterUnit,
  start,
  end,
  span,
  weights,
  variantKey,
  presetName,
  title,
  manualRefresh = false,
  showRefreshButton = false,
}: Props) {
  const [data, setData] = useState<BacktestSummary | null>(null);
  const [err, setErr] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [requestedUrl, setRequestedUrl] = useState<string>("");
  const [hasAutoRequested, setHasAutoRequested] = useState(false);

  const url = useMemo(() => {
    const query = buildQuery({
      modelKey,
      clusterUnit,
      start,
      end,
      maxSpan: span, // 서버는 maxSpan 사용
      variantKey,
      presetName,

      hot: weights?.hot,
      cold: weights?.cold,
      streak: weights?.streak,
      pattern: weights?.pattern,
      cluster: weights?.cluster,
      random: weights?.random,
      nextFreq: weights?.nextFreq,
    });
    return `${apiUrl}/lotto/backtest/summary${query}`;
  }, [
    modelKey,
    clusterUnit,
    start,
    end,
    span,
    weights,
    variantKey,
    presetName,
  ]);

  useEffect(() => {
    if (!manualRefresh) {
      setRequestedUrl(url);
      return;
    }

    if (!hasAutoRequested) {
      setRequestedUrl(url);
      setHasAutoRequested(true);
    }
  }, [url, manualRefresh, hasAutoRequested]);

  useEffect(() => {
    if (!requestedUrl) return;
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setErr("");

        const res = await fetch(requestedUrl, { cache: "no-store" });
        if (!res.ok) throw new Error(await res.text());

        const json = (await res.json()) as BacktestSummary;
        if (!mounted) return;
        setData(json);
      } catch (e: unknown) {
        if (!mounted) return;
        setErr(e instanceof Error ? e.message : "백테스트 요약 불러오기 실패");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [requestedUrl]);

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white/70 p-4">
        <div className="text-sm text-gray-600">과거 흐름 점검 불러오는 중…</div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
        <div className="text-sm font-semibold text-red-700">과거 흐름 점검</div>
        <div className="mt-1 text-sm text-red-700">{err}</div>
      </div>
    );
  }

  if (!data) return null;

  const dist = data.hitDist ?? {};
  const get = (k: number) => dist[String(k)] ?? 0;

  const runs = data.totalRuns || 0;
  const hitsTotal = [0, 1, 2, 3, 4, 5, 6].reduce(
    (acc, k) => acc + k * get(k),
    0
  );
  const hit1plusRuns = Math.max(0, runs - get(0));
  const maxHits = ([6, 5, 4, 3, 2, 1, 0].find((k) => get(k) > 0) ?? 0) as
    | 0
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6;

  const resolvedTitle = title ?? AI_MODEL[modelKey];

  return (
    <div className="rounded-xl border border-gray-200 bg-white/70 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-black text-gray-900">
            {resolvedTitle}
          </div>
          <div className="mt-1 text-xs text-gray-500">
            최근 {data.range.span}회 기준 (trainEndRound {data.range.start}~
            {data.range.end})
            {typeof clusterUnit === "number" && (
              <span className="ml-2">· clusterUnit {clusterUnit}</span>
            )}
          </div>
          <div className="mt-2 text-xs text-gray-600 leading-relaxed">
            예측을 보장하는 기능은 아니며, 이 점수 방식이 과거 데이터에서{" "}
            <b className="text-gray-800">어떤 성향이었는지</b> 참고용으로만 보는
            카드입니다.
          </div>
        </div>

        <div className="shrink-0 text-right">
          {showRefreshButton && (
            <button
              onClick={() => setRequestedUrl(withRefreshParam(url))}
              className="mb-2 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              요약 갱신
            </button>
          )}
          <div className="text-2xl font-black text-gray-900">
            {fmt2(data.avgHits)}개
          </div>
          <div className="text-xs text-gray-500">TOP6 평균 포함 개수</div>
        </div>
      </div>

      {/* 핵심 지표 (퍼센트 제거) */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <div className="text-xs text-gray-500">1개 이상 포함</div>
          <div className="mt-1 text-lg font-black text-gray-900 tabular-nums">
            {hit1plusRuns.toLocaleString()} / {runs.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-gray-500">
            최근 {data.range.span}회 중, TOP 6 번호가 1개 이상 포함된 회차 수
          </div>
        </div>

        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <div className="text-xs text-gray-500">TOP6 출현 누적</div>
          <div className="mt-1 text-lg font-black text-gray-900 tabular-nums">
            {hitsTotal.toLocaleString()}회
          </div>
          <div className="mt-1 text-[11px] text-gray-500">
            (포함 합계) · 회차당 포함 개수를 전부 더한 값
          </div>
        </div>

        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <div className="text-xs text-gray-500">최고 포함</div>
          <div className="mt-1 text-lg font-black text-gray-900 tabular-nums">
            {maxHits}개
          </div>
          <div className="mt-1 text-[11px] text-gray-500">
            최근 {data.range.span}회 기준 최고 기록
          </div>
        </div>
      </div>

      {/* 분포 */}
      <div className="mt-3 rounded-lg border border-gray-100 bg-white p-3">
        <div className="text-xs font-semibold text-gray-700">
          포함 분포 (hits)
        </div>
        <div className="mt-2 grid grid-cols-7 gap-2 text-center">
          {[0, 1, 2, 3, 4, 5, 6].map((k) => (
            <div key={k} className="rounded-md bg-gray-50 p-2">
              <div className="text-xs text-gray-500">{k}</div>
              <div className="text-sm font-black text-gray-900 tabular-nums">
                {get(k)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2 text-[11px] text-gray-500 leading-relaxed">
          * 이 모델이 계산한 높은 점수 TOP6 번호가 다음 회차 당첨번호에 포함된
          번호 개수와 회차 개수입니다.
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
        <span>runs: {runs.toLocaleString()}</span>
        <span>
          cache: {data.cache.hit ? "HIT" : "MISS"} · TTL{" "}
          {data.cache.ttlSecondsLeft}s
        </span>
      </div>
    </div>
  );
}
