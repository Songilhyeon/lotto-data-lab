"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { apiUrl } from "@/app/utils/getUtils";
import { useAuth } from "@/app/context/authContext";
import type { SelectionLog } from "@/app/types/api";

type Summary = {
  totalCount: number;
  resolvedCount: number;
  pendingCount: number;
  avgMatch: number;
  hit3plusRate: number;
};

export default function HomeSelectionSummaryCard() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<SelectionLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${apiUrl}/lotto/selection-logs?limit=10`, {
          credentials: "include",
        });
        const json = await res.json();
        if (!res.ok || !json.success) return;
        if (mounted) setLogs(json.data ?? []);
      } catch {
        if (mounted) setLogs([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [user?.id]);

  const summary: Summary | null = useMemo(() => {
    if (!logs.length) return null;
    const resolved = logs.filter((log) => log.match?.isResolved);
    const resolvedCount = resolved.length;
    const pendingCount = logs.length - resolvedCount;
    const avgMatch = resolvedCount
      ? resolved.reduce((sum, log) => sum + (log.match?.matchCount ?? 0), 0) /
        resolvedCount
      : 0;
    const hit3plusCount = resolved.filter(
      (log) => (log.match?.matchCount ?? 0) >= 3,
    ).length;
    const hit3plusRate = resolvedCount
      ? Math.round((hit3plusCount / resolvedCount) * 100)
      : 0;

    return {
      totalCount: logs.length,
      resolvedCount,
      pendingCount,
      avgMatch,
      hit3plusRate,
    };
  }, [logs]);

  const keywords = useMemo(() => {
    if (!logs.length) return null;
    const reasonCounts = new Map<string, number>();
    const memoCounts = new Map<string, number>();

    const pushCount = (map: Map<string, number>, key: string) => {
      map.set(key, (map.get(key) ?? 0) + 1);
    };

    logs.forEach((log) => {
      (log.reasons ?? []).forEach((reason) => {
        if (reason) pushCount(reasonCounts, reason);
      });

      const memo = log.memo ?? "";
      const tokens = memo.match(/[가-힣a-zA-Z0-9]+/g) ?? [];
      tokens
        .map((t) => t.trim())
        .filter((t) => t.length >= 2)
        .filter((t) => !/^\d+$/.test(t))
        .forEach((t) => pushCount(memoCounts, t));
    });

    const toTop = (map: Map<string, number>) =>
      Array.from(map.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([label]) => label);

    const topReasons = toTop(reasonCounts);
    const topKeywords = toTop(memoCounts);

    if (!topReasons.length && !topKeywords.length) return null;
    return { topReasons, topKeywords };
  }, [logs]);

  if (!user) return null;
  if (loading && logs.length === 0) return null;
  if (!summary) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-6 mb-5">
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
        <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-slate-800">
              내 선택 기록 요약
            </div>
            <div className="text-xs text-slate-500">
              최근 {summary.totalCount}건 기준
            </div>
          </div>
          <Link
            href="/me"
            className="text-xs font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4"
          >
            내 기록 보기
          </Link>
        </div>

        <div className="mt-3 grid gap-2 text-xs text-slate-600 sm:grid-cols-3">
          <div>결과 확인: {summary.resolvedCount}건</div>
          <div>결과 대기: {summary.pendingCount}건</div>
          <div>
            평균 일치:{" "}
            {summary.resolvedCount ? summary.avgMatch.toFixed(1) : "-"}개
          </div>
          <div>3개 이상 적중: {summary.hit3plusRate}%</div>
        </div>

        {keywords && (
          <div className="mt-3 text-xs text-slate-600">
            <div className="flex flex-wrap items-center gap-2">
              {keywords.topReasons.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-slate-400">선택 이유</span>
                  {keywords.topReasons.map((label) => (
                    <span
                      key={label}
                      className="rounded-full bg-slate-100 px-2 py-1"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              )}
              {keywords.topKeywords.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-slate-400">전략 키워드</span>
                  {keywords.topKeywords.map((label) => (
                    <span
                      key={label}
                      className="rounded-full bg-amber-50 px-2 py-1 text-amber-700"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
