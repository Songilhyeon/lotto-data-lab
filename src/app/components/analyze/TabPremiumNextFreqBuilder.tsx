"use client";

import { useEffect, useMemo, useState } from "react";
import { apiUrl, getLatestRound } from "@/app/utils/getUtils";
import ComponentHeader from "@/app/components/ComponentHeader";
import RangeFilterBar from "../RangeFilterBar";
import {
  componentBodyDivStyle,
  rangeFilterDivStyle,
} from "@/app/utils/getDivStyle";
import { FreqChart } from "@/app/components/analyze/FreqChartComponent";
import NextFreqPagination from "./NextFreqPagination";
import { useProfile } from "@/app/context/profileContext";

/** ---------- Types (백엔드와 맞춤) ---------- */
type RangeUnit = 5 | 7 | 10;

type CmpOp = "eq" | "gte" | "lte";
type BetweenCondition = { op: "between"; min: number; max: number };
type CountCondition = { op: CmpOp; value: number } | BetweenCondition;

type RangeCondition = {
  key: string; // ✅ 동적 구간 key ("1-7", "8-14" ...)
  enabled?: boolean;
  op: CmpOp;
  value: number; // 0~6
};

type PremiumNextFreqConditions = {
  rangeUnit?: RangeUnit; // ✅ 추가(조건 쪽에서도 참고 가능)
  ranges?: RangeCondition[];
  includeNumbers?: number[];
  excludeNumbers?: number[];

  oddCount?: CountCondition;
  sum?: CountCondition;

  consecutive?: { enabled: boolean };

  minNumber?: CountCondition;
  maxNumber?: CountCondition;
};

type PremiumNextFreqRequest = {
  startRound?: number;
  endRound?: number;
  includeBonus?: boolean;

  rangeUnit?: RangeUnit; // ✅ 최상위에도 추가(백엔드 파서에 맞춰 선택)
  conditions: PremiumNextFreqConditions;

  includeMatchedRounds?: boolean;
  includeMatchedRoundsDetail?: boolean;
};

type ApiResponse = {
  data?: {
    meta: {
      startRound: number;
      endRound: number;
      includeBonus: boolean;
      matchedRounds: number;
      nextRoundsUsed: number;
      rangeUnit?: RangeUnit; // ✅ 백엔드가 내려주면 사용
    };
    nextNumberFreq: Record<number, number>;
    top: { num: number; count: number }[];
    nextRangeDist: Record<string, number>; // ✅ 동적 키
    matchedRoundList?: number[];
    matchedRounds?: Array<{
      round: number;
      numbers: number[];
      nextNumbers: number[];
    }>;
  };
  error?: string;
};

const CMP_OPS: { value: CmpOp; label: string }[] = [
  { value: "eq", label: "=" },
  { value: "gte", label: "≥" },
  { value: "lte", label: "≤" },
];

const COUNT_MODE = [
  { value: "off", label: "사용 안 함" },
  { value: "cmp", label: "비교(= / ≥ / ≤)" },
  { value: "between", label: "범위(최소~최대)" },
] as const;

type CountMode = (typeof COUNT_MODE)[number]["value"];

/** ---------- Range Buckets ---------- */
type RangeBucket = { key: string; min: number; max: number };

function makeRangeBuckets(unit: RangeUnit): RangeBucket[] {
  const buckets: RangeBucket[] = [];
  let start = 1;
  while (start <= 45) {
    const end = Math.min(45, start + unit - 1);
    buckets.push({ key: `${start}-${end}`, min: start, max: end });
    start = end + 1;
  }
  return buckets;
}

/** ---------- Utils ---------- */
function clampInt(v: unknown, fallback: number) {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.floor(n);
}

function clamp1to45(n: number) {
  return Math.max(1, Math.min(45, Math.floor(n)));
}

function parseNumberList(raw: string): number[] {
  const nums = raw
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => clamp1to45(Number(x)))
    .filter((n) => Number.isFinite(n));

  return Array.from(new Set(nums)).sort((a, b) => a - b);
}

function removeEmpty<T extends object>(obj: T): Partial<T> {
  const out: Partial<T> = { ...obj };
  for (const k of Object.keys(out)) {
    const v = out[k as keyof T];
    if (v === undefined || v === null) {
      delete out[k as keyof T];
      continue;
    }
    if (Array.isArray(v) && v.length === 0) {
      delete out[k as keyof T];
      continue;
    }
  }
  return out;
}

function normalizeConditions(
  c: PremiumNextFreqConditions
): PremiumNextFreqConditions {
  const out: PremiumNextFreqConditions = { ...c };

  if (!out.ranges?.length) delete out.ranges;
  if (!out.includeNumbers?.length) delete out.includeNumbers;
  if (!out.excludeNumbers?.length) delete out.excludeNumbers;

  if (!out.consecutive) delete out.consecutive;

  if (!out.oddCount) delete out.oddCount;
  if (!out.sum) delete out.sum;
  if (!out.minNumber) delete out.minNumber;
  if (!out.maxNumber) delete out.maxNumber;

  return out;
}

/** ---------- CountCondition Editor ---------- */
function CountCondEditor({
  title,
  value,
  onChange,
  minHint,
  maxHint,
  hintText,
}: {
  title: string;
  value?: CountCondition;
  onChange: (v?: CountCondition) => void;
  minHint?: number;
  maxHint?: number;
  hintText?: string;
}) {
  const mode: CountMode = !value
    ? "off"
    : value.op === "between"
    ? "between"
    : "cmp";

  const cmp =
    value && value.op !== "between"
      ? (value as { op: CmpOp; value: number })
      : null;
  const btw =
    value && value.op === "between" ? (value as BetweenCondition) : null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white/70 p-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="font-extrabold">{title}</div>
        <select
          className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm"
          value={mode}
          onChange={(e) => {
            const m = e.target.value as CountMode;
            if (m === "off") return onChange(undefined);
            if (m === "cmp")
              return onChange({ op: "gte", value: minHint ?? 0 });
            return onChange({
              op: "between",
              min: minHint ?? 0,
              max: maxHint ?? minHint ?? 0,
            });
          }}
        >
          {COUNT_MODE.map((x) => (
            <option key={x.value} value={x.value}>
              {x.label}
            </option>
          ))}
        </select>
      </div>

      {mode === "cmp" && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <select
            className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm"
            value={cmp?.op ?? "gte"}
            onChange={(e) => {
              const op = e.target.value as CmpOp;
              onChange({ op, value: clampInt(cmp?.value ?? 0, 0) });
            }}
          >
            {CMP_OPS.map((x) => (
              <option key={x.value} value={x.value}>
                {x.label}
              </option>
            ))}
          </select>

          <input
            className="w-28 rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm"
            type="number"
            value={cmp?.value ?? minHint ?? 0}
            onChange={(e) =>
              onChange({
                op: cmp?.op ?? "gte",
                value: clampInt(e.target.value, minHint ?? 0),
              })
            }
          />

          {(hintText || minHint !== undefined || maxHint !== undefined) && (
            <span className="text-xs text-gray-500">
              {hintText ?? `권장 범위: ${minHint ?? "-"} ~ ${maxHint ?? "-"}`}
            </span>
          )}
        </div>
      )}

      {mode === "between" && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="w-10 text-xs text-gray-500">최소</span>
          <input
            className="w-28 rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm"
            type="number"
            value={btw?.min ?? minHint ?? 0}
            onChange={(e) => {
              const min = clampInt(e.target.value, minHint ?? 0);
              const max = clampInt(btw?.max ?? maxHint ?? min, maxHint ?? min);
              onChange({ op: "between", min, max: Math.max(min, max) });
            }}
          />
          <span className="w-10 text-xs text-gray-500">최대</span>
          <input
            className="w-28 rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm"
            type="number"
            value={btw?.max ?? maxHint ?? minHint ?? 0}
            onChange={(e) => {
              const max = clampInt(e.target.value, maxHint ?? minHint ?? 0);
              const min = clampInt(btw?.min ?? minHint ?? 0, minHint ?? 0);
              onChange({ op: "between", min, max: Math.max(min, max) });
            }}
          />
          {(hintText || minHint !== undefined || maxHint !== undefined) && (
            <span className="text-xs text-gray-500">
              {hintText ?? `권장 범위: ${minHint ?? "-"} ~ ${maxHint ?? "-"}`}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/** ---------- Main ---------- */
export default function PremiumNextFreqBuilder() {
  const { profile, saveDefaultOptions } = useProfile();
  const latestRound = getLatestRound();

  const [start, setStart] = useState<number>(latestRound - 99);
  const [end, setEnd] = useState<number>(latestRound);

  const [includeBonus, setIncludeBonus] = useState<boolean>(false);
  const [includeMatchedRounds, setIncludeMatchedRounds] =
    useState<boolean>(false);
  const [includeMatchedRoundsDetail, setIncludeMatchedRoundsDetail] =
    useState<boolean>(false);
  const [selectedRecent, setSelectedRecent] = useState<number | null>(100);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [didHydrate, setDidHydrate] = useState(false);
  const [savingDefaults, setSavingDefaults] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [savedRangeConditions, setSavedRangeConditions] = useState<
    RangeCondition[]
  >([]);

  // ✅ NEW: rangeUnit + dynamic keys
  const [rangeUnit, setRangeUnit] = useState<RangeUnit>(7);

  useEffect(() => {
    if (!profile || didHydrate) return;
    const recentWindow = profile.defaultOptions.recentWindow;
    setSelectedRecent(recentWindow);
    setStart(Math.max(1, latestRound - recentWindow + 1));
    setEnd(latestRound);
    setIncludeBonus(profile.defaultOptions.includeBonus);
    const initialRangeUnit =
      profile.defaultOptions.rangeUnit === 5 ||
      profile.defaultOptions.rangeUnit === 7 ||
      profile.defaultOptions.rangeUnit === 10
        ? profile.defaultOptions.rangeUnit
        : 7;
    setRangeUnit(initialRangeUnit);
    setShowAdvanced(profile.defaultOptions.showAdvanced);
    setSavedRangeConditions(profile.defaultOptions.rangeConditions ?? []);
    setIncludeRaw((profile.defaultOptions.includeNumbers ?? []).join(","));
    setExcludeRaw((profile.defaultOptions.excludeNumbers ?? []).join(","));
    setOddCountCond(profile.defaultOptions.oddCount);
    setSumCond(profile.defaultOptions.sum);
    setMinCond(profile.defaultOptions.minNumber);
    setMaxCond(profile.defaultOptions.maxNumber);
    setConsecutiveMode(profile.defaultOptions.consecutiveMode ?? "any");
    setDidHydrate(true);
  }, [profile, didHydrate, latestRound]);

  const buckets = useMemo(() => makeRangeBuckets(rangeUnit), [rangeUnit]);
  const rangeKeys = useMemo(() => buckets.map((b) => b.key), [buckets]);

  // ✅ dynamic maps
  const [rangeEnabled, setRangeEnabled] = useState<Record<string, boolean>>({});
  const [rangeOp, setRangeOp] = useState<Record<string, CmpOp>>({});
  const [rangeValue, setRangeValue] = useState<Record<string, number>>({});

  // unit 변경/초기 로드시 키셋 세팅
  useEffect(() => {
    const enabled: Record<string, boolean> = {};
    const op: Record<string, CmpOp> = {};
    const value: Record<string, number> = {};

    for (const k of rangeKeys) {
      enabled[k] = false;
      op[k] = "eq";
      value[k] = 0;
    }
    setRangeEnabled(enabled);
    setRangeOp(op);
    setRangeValue(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rangeKeys.join("|")]);

  useEffect(() => {
    if (!didHydrate || savedRangeConditions.length === 0) return;
    const enabled: Record<string, boolean> = { ...rangeEnabled };
    const op: Record<string, CmpOp> = { ...rangeOp };
    const value: Record<string, number> = { ...rangeValue };

    for (const cond of savedRangeConditions) {
      if (!rangeKeys.includes(cond.key)) continue;
      enabled[cond.key] = cond.enabled ?? false;
      op[cond.key] = cond.op;
      value[cond.key] = cond.value;
    }

    setRangeEnabled(enabled);
    setRangeOp(op);
    setRangeValue(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedRangeConditions, rangeKeys.join("|"), didHydrate]);

  const [includeRaw, setIncludeRaw] = useState<string>("");
  const [excludeRaw, setExcludeRaw] = useState<string>("");

  const [oddCountCond, setOddCountCond] = useState<CountCondition | undefined>(
    undefined
  );
  const [sumCond, setSumCond] = useState<CountCondition | undefined>(undefined);
  const [minCond, setMinCond] = useState<CountCondition | undefined>(undefined);
  const [maxCond, setMaxCond] = useState<CountCondition | undefined>(undefined);

  const [consecutiveMode, setConsecutiveMode] = useState<"any" | "yes" | "no">(
    "any"
  );

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string>("");
  const [data, setData] = useState<ApiResponse["data"]>(undefined);

  const includeNumbers = useMemo(
    () => parseNumberList(includeRaw),
    [includeRaw]
  );
  const excludeNumbers = useMemo(
    () => parseNumberList(excludeRaw),
    [excludeRaw]
  );

  const conflicts = useMemo(() => {
    const s = new Set(includeNumbers);
    return excludeNumbers.filter((n) => s.has(n));
  }, [includeNumbers, excludeNumbers]);

  const conditions: PremiumNextFreqConditions = useMemo(() => {
    const ranges: RangeCondition[] = [];
    for (const k of rangeKeys) {
      if (!rangeEnabled[k]) continue;
      ranges.push({
        key: k,
        op: rangeOp[k] ?? "eq",
        value: clampInt(rangeValue[k] ?? 0, 0),
      });
    }

    const consecutive =
      consecutiveMode === "any"
        ? undefined
        : consecutiveMode === "yes"
        ? { enabled: true }
        : { enabled: false };

    return normalizeConditions(
      removeEmpty({
        rangeUnit, // ✅ 조건에도 포함
        ranges,
        includeNumbers,
        excludeNumbers,
        oddCount: oddCountCond,
        sum: sumCond,
        minNumber: minCond,
        maxNumber: maxCond,
        consecutive,
      })
    ) as PremiumNextFreqConditions;
  }, [
    rangeUnit,
    rangeKeys,
    rangeEnabled,
    rangeOp,
    rangeValue,
    includeNumbers,
    excludeNumbers,
    oddCountCond,
    sumCond,
    minCond,
    maxCond,
    consecutiveMode,
  ]);

  const payload: PremiumNextFreqRequest = useMemo(() => {
    return {
      startRound: start ? clampInt(start, 1) : undefined,
      endRound: end ? clampInt(end, 1) : undefined,
      includeBonus,
      rangeUnit, // ✅ 최상위에도 포함(백엔드 파서에 맞춰 나중에 하나만 남겨도 됨)
      includeMatchedRounds,
      includeMatchedRoundsDetail,
      conditions,
    };
  }, [
    start,
    end,
    includeBonus,
    rangeUnit,
    includeMatchedRounds,
    includeMatchedRoundsDetail,
    conditions,
  ]);

  async function run() {
    setErr("");
    setData(undefined);

    if (conflicts.length > 0) {
      setErr(`포함/제외 번호가 겹쳐요: ${conflicts.join(", ")}`);
      return;
    }
    if (!payload.startRound || payload.startRound < 1) {
      setErr("시작 회차(startRound)가 올바르지 않아요.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/lotto/premium/analysis/advanced`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const json = (await res.json()) as ApiResponse;
      if (!res.ok || json.error)
        throw new Error(json.error || `HTTP ${res.status}`);

      setData(json.data);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "요청에 실패했어요.");
    } finally {
      setLoading(false);
    }
  }

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

  // ✅ 결과 렌더링은 서버 meta.rangeUnit 우선
  const resultRangeUnit = (data?.meta?.rangeUnit ?? rangeUnit) as RangeUnit;
  const resultRangeKeys = useMemo(
    () => makeRangeBuckets(resultRangeUnit).map((b) => b.key),
    [resultRangeUnit]
  );

  return (
    <div className={`${componentBodyDivStyle()} from-pink-50 to-indigo-100`}>
      <ComponentHeader
        title="🔎 조건 기반 분석"
        content="특정 조건을 만족한 회차만 골라, 그 ‘다음 회차’에서 어떤 번호/구간이 자주 나왔는지 확인할 수 있습니다."
      />

      {/* 회차 범위 필터 */}
      <div className={rangeFilterDivStyle + " mt-4"}>
        <RangeFilterBar
          start={start}
          end={end}
          latest={latestRound}
          includeBonus={includeBonus}
          selectedRecent={selectedRecent}
          setStart={handleStartChange}
          setEnd={handleEndChange}
          setIncludeBonus={setIncludeBonus}
          onRecentSelect={handleRecent}
          clearRecentSelect={clearRecentSelect}
        />
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <input
            type="checkbox"
            checked={showAdvanced}
            onChange={(e) => setShowAdvanced(e.target.checked)}
          />
          고급 옵션 표시
        </label>
        <button
          type="button"
          disabled={savingDefaults}
          onClick={async () => {
            setSavingDefaults(true);
            const recentWindow = selectedRecent ?? 20;
            const similarityMode =
              profile?.defaultOptions.similarityMode ?? "pattern";
            const rangeConditions = rangeKeys.map((key) => ({
              key,
              enabled: !!rangeEnabled[key],
              op: rangeOp[key] ?? "eq",
              value: rangeValue[key] ?? 0,
            }));
            const result = await saveDefaultOptions({
              includeBonus,
              recentWindow,
              clusterUnit: profile?.defaultOptions.clusterUnit ?? 5,
              similarityMode,
              showAdvanced,
              rangeUnit,
              rangeConditions,
              includeNumbers,
              excludeNumbers,
              oddCount: oddCountCond,
              sum: sumCond,
              minNumber: minCond,
              maxNumber: maxCond,
              consecutiveMode: consecutiveMode ?? "any",
            });
            setSaveMessage(
              result.ok ? "기본값 저장 완료" : result.message ?? "저장 실패",
            );
            setSavingDefaults(false);
          }}
          className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 disabled:opacity-60"
        >
          {savingDefaults ? "저장 중..." : "이 설정을 기본값으로 저장"}
        </button>
        {saveMessage && (
          <span className="text-xs text-gray-500">{saveMessage}</span>
        )}
      </div>

      {/* 구간 조건 */}
      <div className="mb-3 rounded-xl border border-gray-200 bg-white/70 p-3">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <div className="font-black">구간 조건</div>

          {/* ✅ NEW: range unit selector */}
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
            <span className="text-xs font-semibold text-gray-500">
              구간 단위
            </span>
            <select
              value={rangeUnit}
              onChange={(e) =>
                setRangeUnit(Number(e.target.value) as RangeUnit)
              }
              className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm"
              title="구간을 5/7/10 단위로 나눠서 조건을 적용해요."
            >
              <option value={5}>5구간</option>
              <option value={7}>7구간 (권장)</option>
              <option value={10}>10구간</option>
            </select>
          </label>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {rangeKeys.map((k) => {
            const opText =
              (rangeOp[k] ?? "eq") === "eq"
                ? "정확히"
                : (rangeOp[k] ?? "eq") === "gte"
                ? "최소"
                : "최대";

            return (
              <div
                key={k}
                className="rounded-xl border border-gray-200 bg-white p-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <label className="flex min-w-[120px] items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!rangeEnabled[k]}
                      onChange={(e) =>
                        setRangeEnabled((prev) => ({
                          ...prev,
                          [k]: e.target.checked,
                        }))
                      }
                    />
                    <b>{k}</b>
                  </label>

                  <select
                    className="min-w-[88px] rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm disabled:bg-gray-50"
                    value={rangeOp[k] ?? "eq"}
                    disabled={!rangeEnabled[k]}
                    onChange={(e) =>
                      setRangeOp((prev) => ({
                        ...prev,
                        [k]: e.target.value as CmpOp,
                      }))
                    }
                  >
                    {CMP_OPS.map((x) => (
                      <option key={x.value} value={x.value}>
                        {x.label}
                      </option>
                    ))}
                  </select>

                  <input
                    className="w-20 rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm disabled:bg-gray-50"
                    type="number"
                    min={0}
                    max={6}
                    disabled={!rangeEnabled[k]}
                    value={rangeValue[k] ?? 0}
                    onChange={(e) =>
                      setRangeValue((prev) => ({
                        ...prev,
                        [k]: Math.max(
                          0,
                          Math.min(6, clampInt(e.target.value, 0))
                        ),
                      }))
                    }
                  />

                  <span className="min-w-[220px] flex-1 text-xs text-gray-500">
                    예: {k} 구간 번호가 “{opText} {rangeValue[k] ?? 0}개”
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showAdvanced && (
        <>
          {/* 포함/제외 번호 */}
          <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white/70 p-3">
              <div className="mb-2 font-black">반드시 포함할 번호</div>
              <input
                value={includeRaw}
                onChange={(e) => setIncludeRaw(e.target.value)}
                placeholder="예: 5,14,33"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
              />
              <div className="mt-2 text-xs text-gray-500">
                입력값 해석 결과:{" "}
                {includeNumbers.length ? includeNumbers.join(", ") : "(없음)"}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white/70 p-3">
              <div className="mb-2 font-black">반드시 제외할 번호</div>
              <input
                value={excludeRaw}
                onChange={(e) => setExcludeRaw(e.target.value)}
                placeholder="예: 1,2,3"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
              />
              <div className="mt-2 text-xs text-gray-500">
                입력값 해석 결과:{" "}
                {excludeNumbers.length ? excludeNumbers.join(", ") : "(없음)"}
              </div>
            </div>
          </div>

          {conflicts.length > 0 && (
            <div className="mb-3 rounded-xl border border-red-500 bg-red-50 p-3 font-bold text-red-700">
              포함/제외 번호가 겹쳐요:{" "}
              <span className="font-black">{conflicts.join(", ")}</span>
            </div>
          )}

          {/* 개수/합 조건 */}
          <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-2">
            <CountCondEditor
              title="홀수 개수(oddCount)"
              value={oddCountCond}
              onChange={setOddCountCond}
              minHint={0}
              maxHint={6}
              hintText="권장 범위: 0 ~ 6"
            />
            <CountCondEditor
              title="번호 합(sum)"
              value={sumCond}
              onChange={setSumCond}
              minHint={21}
              maxHint={255}
              hintText="권장 범위(예시): 21 ~ 255"
            />
            <CountCondEditor
              title="최소값(minNumber)"
              value={minCond}
              onChange={setMinCond}
              minHint={1}
              maxHint={45}
              hintText="권장 범위: 1 ~ 45"
            />
            <CountCondEditor
              title="최대값(maxNumber)"
              value={maxCond}
              onChange={setMaxCond}
              minHint={1}
              maxHint={45}
              hintText="권장 범위: 1 ~ 45"
            />
          </div>

          {/* 연번 조건 */}
          <div className="mb-3 rounded-xl border border-gray-200 bg-white/70 p-3">
            <div className="mb-2 font-black">연번(연속번호) 조건</div>
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="consecutive"
                  checked={consecutiveMode === "any"}
                  onChange={() => setConsecutiveMode("any")}
                />
                상관없음
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="consecutive"
                  checked={consecutiveMode === "yes"}
                  onChange={() => setConsecutiveMode("yes")}
                />
                연번이 있어야 함
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="consecutive"
                  checked={consecutiveMode === "no"}
                  onChange={() => setConsecutiveMode("no")}
                />
                연번이 없어야 함
              </label>
            </div>
          </div>
        </>
      )}

      {/* 실행 */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white/70 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={run}
            disabled={loading}
            className="rounded-xl border border-gray-900 bg-gray-900 px-4 py-2 font-black text-white disabled:border-gray-300 disabled:bg-gray-200 disabled:text-gray-900"
          >
            {loading ? "분석 중..." : "조건 적용해서 다음 회차 빈도 계산"}
          </button>

          {err && <span className="font-extrabold text-red-600">{err}</span>}
        </div>

        {showAdvanced && (
          <div className="flex flex-col items-end gap-1">
            <label
              className="flex items-center gap-2 font-extrabold cursor-pointer select-none whitespace-nowrap"
              title="체크하면 matchedRoundList가 결과에 포함돼요"
            >
              <input
                type="checkbox"
                checked={includeMatchedRounds}
                onChange={(e) => setIncludeMatchedRounds(e.target.checked)}
              />
              매칭된 회차 목록 포함
              <span className="text-xs font-semibold text-gray-500">
                (검증용)
              </span>
            </label>

            <label
              className="flex items-center gap-2 font-extrabold cursor-pointer select-none whitespace-nowrap"
              title="체크하면 매칭된 회차 목록이 상세히 포함돼요"
            >
              <input
                type="checkbox"
                checked={includeMatchedRoundsDetail}
                onChange={(e) => setIncludeMatchedRoundsDetail(e.target.checked)}
              />
              매칭된 회차 목록 상세 포함
              <span className="text-xs font-semibold text-gray-500">
                (검증용)
              </span>
            </label>
          </div>
        )}
      </div>

      {/* 결과 */}
      {data && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white/70 p-3">
            <div className="mb-2 font-black">분석 요약</div>
            <div className="space-y-1 text-sm text-gray-700">
              <div>
                시작 회차:{" "}
                <b className="text-gray-900">{data.meta.startRound}</b>
              </div>
              <div>
                종료 회차: <b className="text-gray-900">{data.meta.endRound}</b>
              </div>
              <div>
                보너스 포함:{" "}
                <b className="text-gray-900">
                  {data.meta.includeBonus ? "포함" : "미포함"}
                </b>
              </div>
              <div>
                조건 매칭 회차 수:{" "}
                <b className="text-gray-900">{data.meta.matchedRounds}</b>
              </div>
              <div>
                다음 회차 표본 수:{" "}
                <b className="text-gray-900">{data.meta.nextRoundsUsed}</b>
              </div>
              <div>
                구간 단위:{" "}
                <b className="text-gray-900">
                  {data.meta.rangeUnit ?? rangeUnit}
                </b>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900">
                다음 회차 구간 분포{" "}
                <span className="text-gray-400">(누적)</span>
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {resultRangeKeys.map((k) => (
                <div
                  key={k}
                  className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
                >
                  <span className="text-xs font-medium text-gray-600">{k}</span>
                  <span className="rounded-full bg-gray-900 px-2.5 py-0.5 text-xs font-bold text-white">
                    {data.nextRangeDist?.[k] ?? 0}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 text-xs leading-relaxed text-gray-500">
              조건에 맞는 회차들의 <b className="text-gray-700">다음 회차</b>
              에서 각 번호 구간이 등장한 횟수를 누적한 통계입니다.
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white/70 p-3 md:col-span-2">
            <div className="mb-2 font-black">자주 나온 번호 TOP 12</div>
            <div className="flex flex-wrap gap-2">
              {data.top.map((x) => (
                <div
                  key={x.num}
                  className="rounded-full border border-gray-200 bg-white px-3 py-1 font-black"
                >
                  {x.num}{" "}
                  <span className="text-sm font-bold text-gray-500">
                    ({x.count}회)
                  </span>
                </div>
              ))}
            </div>
            <FreqChart
              record={data.nextNumberFreq}
              color="#10b981"
              height={260}
            />
          </div>

          {data.matchedRoundList && (
            <div className="rounded-xl border border-gray-200 bg-white/70 p-3 md:col-span-2">
              <div className="mb-2 font-black">
                조건에 매칭된 회차 목록 ({data.matchedRoundList.length}개)
              </div>
              <div className="break-words text-sm leading-7 text-gray-700">
                {data.matchedRoundList.join(", ")}
              </div>
            </div>
          )}

          {data.matchedRounds && data.matchedRounds.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white/70 p-3 md:col-span-2">
              <NextFreqPagination results={data.matchedRounds} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
