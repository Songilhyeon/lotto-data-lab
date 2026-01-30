"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiUrl, getLatestRound } from "@/app/utils/getUtils";
import { DefaultOptions, UserProfile } from "@/app/types/userProfile";
import { isPremiumRole, useAuth } from "@/app/context/authContext";
import { useProfile } from "@/app/context/profileContext";
import PickNumberGrid from "@/app/components/help/PickNumberGrid";
import LottoBall from "@/app/components/LottoBall";
import { X } from "lucide-react";
import type { SelectionLog } from "@/app/types/api";
import Accordion from "@/app/components/analyze/SingleOpenAccordion";
import { SelectionLogMatch } from "@/app/types/api";
import { componentBodyDivStyle } from "@/app/utils/getDivStyle";
import ComponentHeader from "@/app/components/ComponentHeader";

const DEFAULT_OPTIONS: DefaultOptions = {
  includeBonus: false,
  recentWindow: 20,
  clusterUnit: 5,
  similarityMode: "pattern",
  showAdvanced: false,
  rangeUnit: 7,
  rangeConditions: [],
  includeNumbers: [],
  excludeNumbers: [],
  oddCount: undefined,
  sum: undefined,
  minNumber: undefined,
  maxNumber: undefined,
  consecutiveMode: "any",
};

const NUMBER_POOL = Array.from({ length: 45 }, (_, i) => i + 1);
const SELECTION_REASONS = [
  "패턴",
  "간격",
  "AI 점수",
  "홀짝",
  "합/구간",
  "직관",
];

type CmpOp = "eq" | "gte" | "lte";
type CountCondition =
  | { op: "between"; min: number; max: number }
  | { op: CmpOp; value: number };

const COUNT_OPS: Array<{ value: CmpOp; label: string }> = [
  { value: "eq", label: "=" },
  { value: "gte", label: "≥" },
  { value: "lte", label: "≤" },
];

const COUNT_MODES = [
  { value: "off", label: "사용 안 함" },
  { value: "cmp", label: "비교(= / ≥ / ≤)" },
  { value: "between", label: "범위(최소~최대)" },
];

type CountEditorProps = {
  title: string;
  value?: CountCondition;
  onChange: (next?: CountCondition) => void;
  minHint?: number;
  maxHint?: number;
};

const getMatchRankMeta = (match: SelectionLogMatch) => {
  if (!match.isResolved) {
    return {
      label: "추첨 대기",
      className: "border-slate-200 bg-slate-100 text-slate-600",
    };
  }
  const { matchCount, bonusMatch } = match;
  if (matchCount === 6) {
    return {
      label: "1등 (6개 일치)",
      className: "border-amber-200 bg-amber-50 text-amber-700",
    };
  }
  if (matchCount === 5 && bonusMatch) {
    return {
      label: "2등 (5개 + 보너스)",
      className: "border-orange-200 bg-orange-50 text-orange-700",
    };
  }
  if (matchCount === 5) {
    return {
      label: "3등 (5개 일치)",
      className: "border-rose-200 bg-rose-50 text-rose-700",
    };
  }
  if (matchCount === 4) {
    return {
      label: "4등 (4개 일치)",
      className: "border-sky-200 bg-sky-50 text-sky-700",
    };
  }
  if (matchCount === 3) {
    return {
      label: "5등 (3개 일치)",
      className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    };
  }
  return {
    label: `낙첨 (${matchCount}개 일치)`,
    className: "border-slate-200 bg-white text-slate-500",
  };
};

function CountConditionEditor({
  title,
  value,
  onChange,
  minHint,
  maxHint,
}: CountEditorProps) {
  const mode =
    value && "op" in value && value.op === "between"
      ? "between"
      : value
        ? "cmp"
        : "off";
  const cmpValue =
    value && "op" in value && value.op !== "between" ? value : null;
  const betweenValue =
    value && "op" in value && value.op === "between" ? value : null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white/70 p-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="font-extrabold">{title}</div>
        <select
          className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm"
          value={mode}
          onChange={(e) => {
            const next = e.target.value;
            if (next === "off") return onChange(undefined);
            if (next === "cmp")
              return onChange({
                op: "gte",
                value: minHint ?? 0,
              });
            return onChange({
              op: "between",
              min: minHint ?? 0,
              max: maxHint ?? minHint ?? 0,
            });
          }}
        >
          {COUNT_MODES.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {mode === "cmp" && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <select
            className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm"
            value={cmpValue?.op ?? "gte"}
            onChange={(e) =>
              onChange({
                op: e.target.value as CmpOp,
                value: cmpValue?.value ?? minHint ?? 0,
              })
            }
          >
            {COUNT_OPS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <input
            type="number"
            className="w-24 rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm"
            value={cmpValue?.value ?? minHint ?? 0}
            onChange={(e) =>
              onChange({
                op: cmpValue?.op ?? "gte",
                value: Number(e.target.value),
              })
            }
          />
        </div>
      )}

      {mode === "between" && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500">최소</span>
          <input
            type="number"
            className="w-24 rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm"
            value={betweenValue?.min ?? minHint ?? 0}
            onChange={(e) =>
              onChange({
                op: "between",
                min: Number(e.target.value),
                max: Math.max(
                  Number(e.target.value),
                  betweenValue?.max ?? maxHint ?? minHint ?? 0,
                ),
              })
            }
          />
          <span className="text-xs text-gray-500">최대</span>
          <input
            type="number"
            className="w-24 rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm"
            value={betweenValue?.max ?? maxHint ?? minHint ?? 0}
            onChange={(e) =>
              onChange({
                op: "between",
                min: Math.min(
                  betweenValue?.min ?? minHint ?? 0,
                  Number(e.target.value),
                ),
                max: Number(e.target.value),
              })
            }
          />
        </div>
      )}
    </div>
  );
}

const makeRangeBuckets = (unit: number) => {
  const buckets: Array<{ key: string; min: number; max: number }> = [];
  let start = 1;
  while (start <= 45) {
    const end = Math.min(45, start + unit - 1);
    buckets.push({ key: `${start}-${end}`, min: start, max: end });
    start = end + 1;
  }
  return buckets;
};

const parseNumberList = (raw: string) => {
  if (!raw.trim()) return [] as number[];
  return Array.from(
    new Set(
      raw
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean)
        .map((v) => Math.floor(Number(v)))
        .filter((v) => Number.isFinite(v) && v >= 1 && v <= 45),
    ),
  ).sort((a, b) => a - b);
};

export default function MeClient() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { profile, loadingProfile, profileError, refreshProfile } =
    useProfile();
  const isPremium = isPremiumRole(user?.role);
  const latestRound = getLatestRound();
  const [displayName, setDisplayName] = useState("");
  const [favoriteNumbers, setFavoriteNumbers] = useState<number[]>([]);
  const [avoidNumbers, setAvoidNumbers] = useState<number[]>([]);
  const [defaultOptions, setDefaultOptions] =
    useState<DefaultOptions>(DEFAULT_OPTIONS);
  const [includeRaw, setIncludeRaw] = useState("");
  const [excludeRaw, setExcludeRaw] = useState("");
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectionLogs, setSelectionLogs] = useState<SelectionLog[]>([]);
  const [selectionLoading, setSelectionLoading] = useState(false);
  const [selectionError, setSelectionError] = useState<string | null>(null);
  const [selectionMemo, setSelectionMemo] = useState("");
  const [selectionReasons, setSelectionReasons] = useState<string[]>([]);
  const [targetRound, setTargetRound] = useState(latestRound + 1);
  const [selectionNumbers, setSelectionNumbers] = useState<number[]>([]);
  const [selectionPickerOpen, setSelectionPickerOpen] = useState(false);
  const [selectionSaving, setSelectionSaving] = useState(false);
  const selectionLimit = isPremium ? 12 : 3;
  const selectionAtLimit = !isPremium && selectionLogs.length >= 3;
  const [selectionPage, setSelectionPage] = useState(1);
  const [openKey, setOpenKey] = useState<string | null>("profile");
  const [selectionReportWindow, setSelectionReportWindow] = useState(5);
  const [selectedLogIds, setSelectedLogIds] = useState<string[]>([]);
  const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false);

  const [profileSignature, setProfileSignature] = useState<string | null>(null);

  useEffect(() => {
    if (loadingProfile) {
      setLoading(true);
      return;
    }

    setLoading(false);

    if (profileError) {
      setError(profileError);
      return;
    }

    if (!profile) {
      if (profileSignature === "__empty__") return;
      setDisplayName("");
      setFavoriteNumbers([]);
      setAvoidNumbers([]);
      setDefaultOptions(DEFAULT_OPTIONS);
      setIncludeRaw("");
      setExcludeRaw("");
      setUpdatedAt("");
      setProfileSignature("__empty__");
      return;
    }

    const nextSignature = JSON.stringify({
      displayName: profile.displayName ?? "",
      favoriteNumbers: profile.favoriteNumbers ?? [],
      avoidNumbers: profile.avoidNumbers ?? [],
      defaultOptions: profile.defaultOptions ?? DEFAULT_OPTIONS,
      updatedAt: profile.updatedAt ?? "",
    });

    if (profileSignature === nextSignature) return;

    const options = profile.defaultOptions ?? DEFAULT_OPTIONS;
    const buckets = makeRangeBuckets(options.rangeUnit);
    const rangeConditions =
      options.rangeConditions.length > 0
        ? options.rangeConditions
        : buckets.map((bucket) => ({
            key: bucket.key,
            enabled: false,
            op: "eq" as const,
            value: 0,
          }));
    setDisplayName(profile.displayName ?? "");
    setFavoriteNumbers(profile.favoriteNumbers ?? []);
    setAvoidNumbers(profile.avoidNumbers ?? []);
    setDefaultOptions({
      ...options,
      rangeConditions,
      consecutiveMode: options.consecutiveMode ?? "any",
    });
    setIncludeRaw((options.includeNumbers ?? []).join(","));
    setExcludeRaw((options.excludeNumbers ?? []).join(","));
    setUpdatedAt(profile.updatedAt ?? "");
    setProfileSignature(nextSignature);
  }, [loadingProfile, profileError, profile, profileSignature]);

  useEffect(() => {
    const buckets = makeRangeBuckets(defaultOptions.rangeUnit);
    setDefaultOptions((prev) => {
      const nextConditions = buckets.map((bucket) => {
        const found = prev.rangeConditions.find((c) => c.key === bucket.key);
        return (
          found ?? {
            key: bucket.key,
            enabled: false,
            op: "eq" as const,
            value: 0,
          }
        );
      });
      return { ...prev, rangeConditions: nextConditions };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultOptions.rangeUnit]);

  const fetchSelectionLogs = async (page = 1) => {
    if (!user) return;
    setSelectionLoading(true);
    setSelectionError(null);
    try {
      const nextOffset = (page - 1) * selectionLimit;
      const res = await fetch(
        `${apiUrl}/lotto/selection-logs?limit=${selectionLimit}&offset=${nextOffset}`,
        {
          credentials: "include",
        },
      );
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.message || "선택 기록을 불러오지 못했습니다.");
      }
      const nextData = json.data ?? [];
      setSelectionLogs(nextData);
      setSelectionPage(page);
      setSelectedLogIds([]);
    } catch (err: unknown) {
      setSelectionError(
        err instanceof Error ? err.message : "선택 기록을 불러오지 못했습니다.",
      );
    } finally {
      setSelectionLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchSelectionLogs(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, selectionLimit]);

  useEffect(() => {
    if (!success) return;
    const timer = window.setTimeout(() => setSuccess(null), 2500);
    return () => window.clearTimeout(timer);
  }, [success]);

  const formattedUpdatedAt = useMemo(() => {
    if (!updatedAt) return "저장 기록 없음";
    const date = new Date(updatedAt);
    if (Number.isNaN(date.getTime())) return "저장 기록 없음";
    return new Intl.DateTimeFormat("ko-KR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  }, [updatedAt]);

  const selectionQuickReport = useMemo(() => {
    if (!selectionLogs.length) return null;
    const windowedLogs = selectionLogs.slice(0, selectionReportWindow);
    const resolved = windowedLogs.filter((log) => log.match?.isResolved);
    const resolvedCount = resolved.length;
    const pendingCount = windowedLogs.length - resolvedCount;
    const totalMatch = resolved.reduce(
      (sum, log) => sum + (log.match?.matchCount ?? 0),
      0,
    );
    const avgMatch = resolvedCount ? totalMatch / resolvedCount : 0;
    const bestMatch = resolvedCount
      ? Math.max(...resolved.map((log) => log.match?.matchCount ?? 0))
      : 0;
    const bonusHitCount = resolved.filter(
      (log) => log.match?.bonusMatch,
    ).length;
    const hit3plusCount = resolved.filter(
      (log) => (log.match?.matchCount ?? 0) >= 3,
    ).length;
    const hit3plusRate = resolvedCount
      ? Math.round((hit3plusCount / resolvedCount) * 100)
      : 0;
    const latestResolvedRound = resolvedCount
      ? Math.max(...resolved.map((log) => log.targetRound))
      : null;

    const allResolved = selectionLogs.filter((log) => log.match?.isResolved);
    const allResolvedCount = allResolved.length;
    const allAvgMatch = allResolvedCount
      ? allResolved.reduce(
          (sum, log) => sum + (log.match?.matchCount ?? 0),
          0,
        ) / allResolvedCount
      : 0;

    const recentResolved = selectionLogs
      .slice(0, selectionReportWindow)
      .filter((log) => log.match?.isResolved);
    const recentAvgMatch = recentResolved.length
      ? recentResolved.reduce(
          (sum, log) => sum + (log.match?.matchCount ?? 0),
          0,
        ) / recentResolved.length
      : 0;
    const recentDelta = allResolvedCount
      ? Math.round((recentAvgMatch - allAvgMatch) * 10) / 10
      : 0;

    return {
      totalCount: windowedLogs.length,
      resolvedCount,
      pendingCount,
      avgMatch,
      bestMatch,
      bonusHitCount,
      hit3plusRate,
      latestResolvedRound,
      allAvgMatch,
      recentAvgMatch,
      recentDelta,
    };
  }, [selectionLogs, selectionReportWindow]);

  const selectionKeywordReport = useMemo(() => {
    if (!selectionLogs.length) return null;
    const windowedLogs = selectionLogs.slice(0, selectionReportWindow);
    const reasonCounts = new Map<string, number>();
    const memoCounts = new Map<string, number>();

    const pushCount = (map: Map<string, number>, key: string) => {
      map.set(key, (map.get(key) ?? 0) + 1);
    };

    windowedLogs.forEach((log) => {
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
        .slice(0, 6)
        .map(([label, count]) => ({ label, count }));

    const topReasons = toTop(reasonCounts);
    const topKeywords = toTop(memoCounts);

    if (!topReasons.length && !topKeywords.length) return null;
    return { topReasons, topKeywords };
  }, [selectionLogs, selectionReportWindow]);

  const validate = () => {
    const trimmedName = displayName.trim();
    if (trimmedName && (trimmedName.length < 2 || trimmedName.length > 20)) {
      return "닉네임은 2~20자여야 합니다.";
    }
    if (favoriteNumbers.length > 10 || avoidNumbers.length > 10) {
      return "선호/회피 번호는 각각 최대 10개까지 가능합니다.";
    }
    const overlap = favoriteNumbers.filter((num) => avoidNumbers.includes(num));
    if (overlap.length > 0) {
      return "선호 번호와 회피 번호는 겹칠 수 없습니다.";
    }
    if (defaultOptions.recentWindow < 5 || defaultOptions.recentWindow > 200) {
      return "최근 회차 범위는 5~200 사이여야 합니다.";
    }
    return null;
  };

  const handleToggleNumber = (
    num: number,
    list: number[],
    otherList: number[],
    setter: (next: number[]) => void,
  ) => {
    setError(null);
    if (otherList.includes(num)) {
      setError("선호 번호와 회피 번호는 겹칠 수 없습니다.");
      return;
    }
    if (!list.includes(num) && list.length >= 10) {
      setError("번호는 최대 10개까지 선택할 수 있습니다.");
      return;
    }
    const next = list.includes(num)
      ? list.filter((n) => n !== num)
      : [...list, num].sort((a, b) => a - b);
    setter(next);
  };

  const saveProfile = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const includeNumbers = parseNumberList(includeRaw);
    const excludeNumbers = parseNumberList(excludeRaw);
    if (includeNumbers.length > 10 || excludeNumbers.length > 10) {
      setError("선호/회피 번호는 각각 최대 10개까지 가능합니다.");
      return;
    }
    const overlap = includeNumbers.filter((n) => excludeNumbers.includes(n));
    if (overlap.length > 0) {
      setError("선호 번호와 회피 번호는 겹칠 수 없습니다.");
      return;
    }

    const nextDefaultOptions = {
      ...defaultOptions,
      includeNumbers,
      excludeNumbers,
    };

    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${apiUrl}/auth/profile`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: displayName.trim() || null,
          favoriteNumbers,
          avoidNumbers,
          defaultOptions: nextDefaultOptions,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "저장에 실패했습니다.");
      }

      const profile: UserProfile = data.profile;
      setUpdatedAt(profile.updatedAt);
      try {
        await refreshProfile();
      } catch {}
      setSuccess("저장되었습니다.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const toggleSelectionReason = (value: string) => {
    setSelectionReasons((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const saveSelectionLog = async () => {
    if (selectionSaving) return;
    if (selectionAtLimit) {
      setSelectionError(
        "무료 계정은 선택 기록을 3개까지만 저장할 수 있습니다.",
      );
      return;
    }
    const numbers = [...selectionNumbers].sort((a, b) => a - b);
    if (numbers.length !== 6) {
      setSelectionError("번호를 6개 선택한 뒤 저장해 주세요.");
      return;
    }
    if (!Number.isInteger(targetRound) || targetRound < 1) {
      setSelectionError("목표 회차를 확인해 주세요.");
      return;
    }

    setSelectionSaving(true);
    setSelectionError(null);
    try {
      const res = await fetch(`${apiUrl}/lotto/selection-logs`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetRound,
          numbers,
          reasons: selectionReasons,
          memo: selectionMemo,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.message || "선택 기록 저장에 실패했습니다.");
      }
      await fetchSelectionLogs(1);
      setSelectionMemo("");
      setSelectionReasons([]);
      setSelectionNumbers([]);
    } catch (err: unknown) {
      setSelectionError(
        err instanceof Error ? err.message : "선택 기록 저장에 실패했습니다.",
      );
    } finally {
      setSelectionSaving(false);
    }
  };

  const deleteSelectedLogs = async () => {
    if (bulkDeleteLoading || selectedLogIds.length === 0) return;
    const confirmed = window.confirm(
      `선택한 ${selectedLogIds.length}개 기록을 삭제할까요?`,
    );
    if (!confirmed) return;

    setBulkDeleteLoading(true);
    setSelectionError(null);
    try {
      const res = await fetch(`${apiUrl}/lotto/selection-logs/bulk-delete`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedLogIds }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.message || "기록 삭제에 실패했습니다.");
      }
      const deletedCount = Number(json.deletedCount) || selectedLogIds.length;
      await fetchSelectionLogs(
        Math.max(
          1,
          selectionLogs.length <= deletedCount
            ? selectionPage - 1
            : selectionPage,
        ),
      );
      setSelectedLogIds([]);
    } catch (err: unknown) {
      setSelectionError(
        err instanceof Error ? err.message : "기록 삭제에 실패했습니다.",
      );
    } finally {
      setBulkDeleteLoading(false);
    }
  };

  const toggleSelectedLog = (id: string) => {
    setSelectedLogIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleSelectionNumber = (num: number) => {
    setSelectionNumbers((prev) => {
      if (prev.includes(num)) return prev.filter((n) => n !== num);
      if (prev.length >= 6) return prev;
      return [...prev, num].sort((a, b) => a - b);
    });
  };

  const resetSelectionNumbers = () => setSelectionNumbers([]);

  const handleDeleteAccount = async () => {
    if (deleteLoading) return;
    const confirmed = window.confirm(
      "계정과 분석 기록이 모두 삭제되며 복구할 수 없습니다. 계속할까요?",
    );
    if (!confirmed) return;

    setError(null);
    setSuccess(null);
    setDeleteLoading(true);
    try {
      const res = await fetch(`${apiUrl}/auth/me`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.status === 204) {
        setSuccess("계정이 삭제되었습니다.");
        try {
          await logout();
        } catch {}
        router.push("/");
        return;
      }

      if (res.status === 401) {
        throw new Error("로그인이 필요합니다.");
      }
      if (res.status === 404) {
        throw new Error("계정을 찾을 수 없습니다.");
      }

      let message = "계정 삭제에 실패했습니다.";
      try {
        const data = await res.json();
        if (data?.message) message = data.message;
      } catch {}
      throw new Error(message);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "계정 삭제에 실패했습니다.",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const renderNumberGrid = (
    selected: number[],
    other: number[],
    onToggle: (num: number) => void,
    variant: "favorite" | "avoid",
  ) => {
    const activeClass =
      variant === "favorite"
        ? "bg-rose-600 text-white border-rose-600"
        : "bg-blue-600 text-white border-blue-600";
    const inactiveClass =
      variant === "favorite"
        ? "border-rose-200 text-rose-700 hover:bg-rose-50"
        : "border-blue-200 text-blue-700 hover:bg-blue-50";
    return (
      <div className="grid grid-cols-9 sm:grid-cols-10 md:grid-cols-12 gap-2">
        {NUMBER_POOL.map((num) => {
          const isSelected = selected.includes(num);
          const isBlocked = other.includes(num);
          return (
            <button
              key={num}
              type="button"
              onClick={() => onToggle(num)}
              disabled={isBlocked}
              className={`h-8 w-8 rounded-full border text-xs font-semibold transition ${
                isSelected ? activeClass : inactiveClass
              } ${isBlocked ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              {num}
            </button>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 text-gray-600">
        내 정보를 불러오는 중...
      </div>
    );
  }

  return (
    <main className={`${componentBodyDivStyle()} from-pink-50 to-indigo-100`}>
      <ComponentHeader
        title="🙋 내 정보 관리"
        content="닉네임, 선호/회피 번호, 선택 기록을 한 곳에서 관리하세요."
      />
      <div className="py-10 text-gray-900">
        <div className="mb-6 text-sm text-gray-500">
          마지막 저장: {formattedUpdatedAt}
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        <div className="space-y-3">
          <Accordion
            title="프로필"
            chartKey="profile"
            openKey={openKey}
            setOpenKey={setOpenKey}
          >
            <div className="grid gap-4">
              <label className="grid gap-2 text-sm">
                <span className="font-semibold text-gray-700">닉네임</span>
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="rounded-lg border border-gray-200 px-3 py-2"
                  placeholder="2~20자"
                />
                <span className="text-xs text-gray-500">
                  게시판과 로그인 정보에 표시됩니다.
                </span>
              </label>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={saveProfile}
                  disabled={saving}
                  className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving ? "저장 중..." : "저장"}
                </button>
              </div>
            </div>
          </Accordion>

          <Accordion
            title="선호/회피 번호"
            chartKey="preferences"
            openKey={openKey}
            setOpenKey={setOpenKey}
          >
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-rose-700">
                    선호 번호 ({favoriteNumbers.length}/10) ⭐
                  </span>
                  <button
                    type="button"
                    className="text-xs text-rose-600 hover:text-rose-800"
                    onClick={() => setFavoriteNumbers([])}
                  >
                    초기화
                  </button>
                </div>
                {renderNumberGrid(
                  favoriteNumbers,
                  avoidNumbers,
                  (num) =>
                    handleToggleNumber(
                      num,
                      favoriteNumbers,
                      avoidNumbers,
                      setFavoriteNumbers,
                    ),
                  "favorite",
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-blue-700">
                    회피 번호 ({avoidNumbers.length}/10) 🚫
                  </span>
                  <button
                    type="button"
                    className="text-xs text-blue-600 hover:text-blue-800"
                    onClick={() => setAvoidNumbers([])}
                  >
                    초기화
                  </button>
                </div>
                {renderNumberGrid(
                  avoidNumbers,
                  favoriteNumbers,
                  (num) =>
                    handleToggleNumber(
                      num,
                      avoidNumbers,
                      favoriteNumbers,
                      setAvoidNumbers,
                    ),
                  "avoid",
                )}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={saveProfile}
                  disabled={saving}
                  className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving ? "저장 중..." : "저장"}
                </button>
              </div>
            </div>
          </Accordion>

          <Accordion
            title="조건 기반 분석 기본 옵션"
            chartKey="conditions"
            openKey={openKey}
            setOpenKey={setOpenKey}
          >
            <div className="space-y-4">
              <div className="grid gap-4 text-sm">
                <label className="grid gap-2">
                  <span className="font-semibold text-gray-700">구간 단위</span>
                  <select
                    value={defaultOptions.rangeUnit}
                    onChange={(e) =>
                      setDefaultOptions((prev) => ({
                        ...prev,
                        rangeUnit: Number(e.target.value) as 5 | 7 | 10,
                      }))
                    }
                    className="rounded-lg border border-gray-200 px-3 py-2"
                  >
                    <option value={5}>5구간</option>
                    <option value={7}>7구간</option>
                    <option value={10}>10구간</option>
                  </select>
                </label>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white/70 p-3">
                <div className="mb-2 font-black">구간 조건</div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  {defaultOptions.rangeConditions.map((cond) => (
                    <div
                      key={cond.key}
                      className="rounded-xl border border-gray-200 bg-white p-3"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="flex min-w-[120px] items-center gap-2">
                          <input
                            type="checkbox"
                            checked={cond.enabled}
                            onChange={(e) =>
                              setDefaultOptions((prev) => ({
                                ...prev,
                                rangeConditions: prev.rangeConditions.map(
                                  (item) =>
                                    item.key === cond.key
                                      ? { ...item, enabled: e.target.checked }
                                      : item,
                                ),
                              }))
                            }
                          />
                          <b>{cond.key}</b>
                        </label>
                        <select
                          className="min-w-[88px] rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm"
                          value={cond.op}
                          disabled={!cond.enabled}
                          onChange={(e) =>
                            setDefaultOptions((prev) => ({
                              ...prev,
                              rangeConditions: prev.rangeConditions.map(
                                (item) =>
                                  item.key === cond.key
                                    ? {
                                        ...item,
                                        op: e.target.value as
                                          | "eq"
                                          | "gte"
                                          | "lte",
                                      }
                                    : item,
                              ),
                            }))
                          }
                        >
                          <option value="eq">=</option>
                          <option value="gte">≥</option>
                          <option value="lte">≤</option>
                        </select>
                        <input
                          className="w-20 rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm"
                          type="number"
                          min={0}
                          max={6}
                          disabled={!cond.enabled}
                          value={cond.value}
                          onChange={(e) =>
                            setDefaultOptions((prev) => ({
                              ...prev,
                              rangeConditions: prev.rangeConditions.map(
                                (item) =>
                                  item.key === cond.key
                                    ? {
                                        ...item,
                                        value: Math.max(
                                          0,
                                          Math.min(6, Number(e.target.value)),
                                        ),
                                      }
                                    : item,
                              ),
                            }))
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
                    {parseNumberList(includeRaw).length
                      ? parseNumberList(includeRaw).join(", ")
                      : "(없음)"}
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
                    {parseNumberList(excludeRaw).length
                      ? parseNumberList(excludeRaw).join(", ")
                      : "(없음)"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <CountConditionEditor
                  title="홀수 개수(oddCount)"
                  value={defaultOptions.oddCount}
                  onChange={(next) =>
                    setDefaultOptions((prev) => ({ ...prev, oddCount: next }))
                  }
                  minHint={0}
                  maxHint={6}
                />
                <CountConditionEditor
                  title="번호 합(sum)"
                  value={defaultOptions.sum}
                  onChange={(next) =>
                    setDefaultOptions((prev) => ({ ...prev, sum: next }))
                  }
                  minHint={21}
                  maxHint={255}
                />
                <CountConditionEditor
                  title="최소값(minNumber)"
                  value={defaultOptions.minNumber}
                  onChange={(next) =>
                    setDefaultOptions((prev) => ({ ...prev, minNumber: next }))
                  }
                  minHint={1}
                  maxHint={45}
                />
                <CountConditionEditor
                  title="최대값(maxNumber)"
                  value={defaultOptions.maxNumber}
                  onChange={(next) =>
                    setDefaultOptions((prev) => ({ ...prev, maxNumber: next }))
                  }
                  minHint={1}
                  maxHint={45}
                />
              </div>

              <div className="rounded-xl border border-gray-200 bg-white/70 p-3">
                <div className="mb-2 font-black">연번(연속번호) 조건</div>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="consecutive"
                      checked={defaultOptions.consecutiveMode === "any"}
                      onChange={() =>
                        setDefaultOptions((prev) => ({
                          ...prev,
                          consecutiveMode: "any",
                        }))
                      }
                    />
                    상관없음
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="consecutive"
                      checked={defaultOptions.consecutiveMode === "yes"}
                      onChange={() =>
                        setDefaultOptions((prev) => ({
                          ...prev,
                          consecutiveMode: "yes",
                        }))
                      }
                    />
                    연번이 있어야 함
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="consecutive"
                      checked={defaultOptions.consecutiveMode === "no"}
                      onChange={() =>
                        setDefaultOptions((prev) => ({
                          ...prev,
                          consecutiveMode: "no",
                        }))
                      }
                    />
                    연번이 없어야 함
                  </label>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={saveProfile}
                  disabled={saving}
                  className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving ? "저장 중..." : "저장"}
                </button>
              </div>
            </div>
          </Accordion>
        </div>

        <div className="mt-4">
          <Accordion
            title="선택 기록"
            chartKey="selection-log"
            openKey={openKey}
            setOpenKey={setOpenKey}
            containerClassName="overflow-visible"
          >
            <div className="space-y-5">
              {!isPremium ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  FREE는 선택 기록을 3개까지 저장할 수 있습니다.
                </div>
              ) : (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
                  프리미엄은 하루 20개까지 선택 기록을 저장할 수 있습니다.
                </div>
              )}
              {selectionQuickReport && (
                <div className="rounded-xl border border-slate-200 bg-white/70 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm font-semibold text-slate-800">
                      선택 기록 요약
                      <span className="ml-2 text-xs text-slate-400">
                        (최근 {selectionQuickReport.totalCount}건 기준)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <span>요약 범위</span>
                      <select
                        value={selectionReportWindow}
                        onChange={(e) =>
                          setSelectionReportWindow(Number(e.target.value))
                        }
                        className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs"
                      >
                        {[3, 5, 10, 20].map((count) => (
                          <option key={count} value={count}>
                            최근 {count}건
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mt-3 grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
                    <div>결과 확인: {selectionQuickReport.resolvedCount}건</div>
                    <div>결과 대기: {selectionQuickReport.pendingCount}건</div>
                    <div>
                      평균 일치:{" "}
                      {selectionQuickReport.resolvedCount
                        ? selectionQuickReport.avgMatch.toFixed(1)
                        : "-"}
                      개
                    </div>
                    <div>최고 일치: {selectionQuickReport.bestMatch}개</div>
                    <div>
                      3개 이상 적중: {selectionQuickReport.hit3plusRate}%
                    </div>
                    <div>
                      보너스 적중: {selectionQuickReport.bonusHitCount}회
                    </div>
                    <div>
                      최근 결과:{" "}
                      {selectionQuickReport.latestResolvedRound
                        ? `${selectionQuickReport.latestResolvedRound}회`
                        : "대기 중"}
                    </div>
                    {isPremium && (
                      <>
                        <div>
                          전체 평균:{" "}
                          {selectionQuickReport.allAvgMatch
                            ? selectionQuickReport.allAvgMatch.toFixed(1)
                            : "-"}
                          개
                        </div>
                        <div>
                          최근 {selectionReportWindow}건 평균:{" "}
                          {selectionQuickReport.recentAvgMatch
                            ? selectionQuickReport.recentAvgMatch.toFixed(1)
                            : "-"}
                          개
                          <span className="ml-1 text-[11px] text-slate-400">
                            {selectionQuickReport.recentDelta > 0
                              ? `(+${selectionQuickReport.recentDelta.toFixed(
                                  1,
                                )})`
                              : selectionQuickReport.recentDelta < 0
                                ? `(${selectionQuickReport.recentDelta.toFixed(
                                    1,
                                  )})`
                                : "(0.0)"}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
              {selectionKeywordReport && (
                <div className="rounded-xl border border-slate-200 bg-white/70 p-4">
                  <div className="text-sm font-semibold text-slate-800">
                    자주 쓰는 전략 키워드
                    <span className="ml-2 text-xs text-slate-400">
                      (최근 {selectionReportWindow}건 기준)
                    </span>
                  </div>
                  <div className="mt-3 grid gap-3 text-xs text-slate-600 sm:grid-cols-2">
                    <div>
                      <div className="text-xs font-semibold text-slate-500">
                        선택 이유
                      </div>
                      {selectionKeywordReport.topReasons.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {selectionKeywordReport.topReasons.map((item) => (
                            <span
                              key={item.label}
                              className="rounded-full bg-slate-100 px-2 py-1 text-slate-600"
                            >
                              {item.label} · {item.count}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-2 text-xs text-slate-400">
                          선택 이유가 없습니다.
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-500">
                        메모 키워드
                      </div>
                      {selectionKeywordReport.topKeywords.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {selectionKeywordReport.topKeywords.map((item) => (
                            <span
                              key={item.label}
                              className="rounded-full bg-amber-50 px-2 py-1 text-amber-700"
                            >
                              {item.label} · {item.count}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-2 text-xs text-slate-400">
                          메모 키워드가 없습니다.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm font-semibold text-slate-700">
                    선택 번호 ({selectionNumbers.length}/6)
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setSelectionPickerOpen(true)}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        번호 고르기
                      </button>
                      {selectionPickerOpen && (
                        <div
                          className="
                          absolute top-full right-0 z-50 mt-2
                          rounded-2xl bg-white p-4 shadow-xl
                          w-[320px] max-w-[90vw]
                          max-h-[70vh] overflow-y-auto
                        "
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="mb-3 flex items-center justify-between">
                            <h3 className="font-bold">
                              선택 번호
                              <span className="ml-2 text-xs text-gray-500">
                                {selectionNumbers.length}/6
                              </span>
                            </h3>
                            <button
                              onClick={() => setSelectionPickerOpen(false)}
                              className="rounded p-1 hover:bg-gray-100"
                            >
                              <X size={16} />
                            </button>
                          </div>
                          <PickNumberGrid
                            selectedNumbers={selectionNumbers}
                            onToggle={toggleSelectionNumber}
                            max={6}
                          />
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={resetSelectionNumbers}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100"
                    >
                      초기화
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectionNumbers.length > 0 ? (
                    selectionNumbers.map((num) => (
                      <LottoBall key={num} number={num} size="sm" />
                    ))
                  ) : (
                    <span className="text-xs text-slate-500">
                      번호를 선택해 주세요.
                    </span>
                  )}
                </div>
              </div>

              {selectionPickerOpen && (
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setSelectionPickerOpen(false)}
                />
              )}

              <div className="grid gap-3 md:grid-cols-2">
                <label className="grid gap-2 text-sm">
                  <span className="font-semibold text-slate-700">
                    목표 회차
                  </span>
                  <input
                    type="number"
                    value={targetRound}
                    min={1}
                    onChange={(e) => setTargetRound(Number(e.target.value))}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                  />
                  <span className="text-xs text-slate-500">
                    기본값은 다음 회차({latestRound + 1}회)입니다.
                  </span>
                </label>
                <div className="grid gap-2 text-sm">
                  <span className="font-semibold text-slate-700">
                    선택 이유
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {SELECTION_REASONS.map((reason) => (
                      <label
                        key={reason}
                        className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600"
                      >
                        <input
                          type="checkbox"
                          checked={selectionReasons.includes(reason)}
                          onChange={() => toggleSelectionReason(reason)}
                        />
                        {reason}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <label className="grid gap-2 text-sm">
                <span className="font-semibold text-slate-700">전략 메모</span>
                <textarea
                  value={selectionMemo}
                  onChange={(e) => setSelectionMemo(e.target.value)}
                  rows={3}
                  placeholder="이번 선택의 전략/근거를 간단히 기록해 보세요."
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                />
              </label>

              {selectionError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                  {selectionError}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={saveSelectionLog}
                  disabled={selectionSaving || selectionAtLimit}
                  className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-60"
                >
                  {selectionSaving ? "저장 중..." : "선택 기록 저장"}
                </button>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm font-semibold text-slate-700">
                  <span>최근 기록{isPremium ? "" : " (최대 3개)"}</span>
                  <button
                    type="button"
                    onClick={deleteSelectedLogs}
                    disabled={
                      bulkDeleteLoading ||
                      selectionLoading ||
                      selectedLogIds.length === 0
                    }
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
                  >
                    {bulkDeleteLoading
                      ? "삭제 중..."
                      : `선택 삭제${
                          selectedLogIds.length
                            ? ` (${selectedLogIds.length})`
                            : ""
                        }`}
                  </button>
                </div>
                {selectionLoading && (
                  <div className="text-xs text-slate-500">
                    기록을 불러오는 중...
                  </div>
                )}
                {!selectionLoading && selectionLogs.length === 0 && (
                  <div className="text-xs text-slate-500">
                    저장된 기록이 없습니다.
                  </div>
                )}
                <div className="grid gap-3 md:grid-cols-2">
                  {selectionLogs.map((log) => {
                    const rankMeta = getMatchRankMeta(log.match);
                    return (
                      <div
                        key={log.id}
                        className="rounded-xl border border-slate-200 bg-white p-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="text-sm font-semibold text-slate-800">
                            목표 {log.targetRound}회
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <label className="inline-flex items-center gap-1">
                              <input
                                type="checkbox"
                                checked={selectedLogIds.includes(log.id)}
                                onChange={() => toggleSelectedLog(log.id)}
                              />
                              선택
                            </label>
                            <span
                              className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${rankMeta.className}`}
                            >
                              {rankMeta.label}
                            </span>
                            <span>
                              {new Date(log.createdAt).toLocaleDateString(
                                "ko-KR",
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {log.numbers.map((num) => (
                            <LottoBall
                              key={`${log.id}-${num}`}
                              number={num}
                              size="sm"
                              isSelected={log.match.matchedNumbers.includes(
                                num,
                              )}
                            />
                          ))}
                        </div>
                        {log.match.isResolved && (
                          <div className="mt-2 grid gap-2 text-xs text-slate-600">
                            <div className="font-semibold text-slate-700">
                              당첨 번호
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              {log.match.resultNumbers.map((num) => (
                                <LottoBall
                                  key={`${log.id}-result-${num}`}
                                  number={num}
                                  size="xs"
                                />
                              ))}
                              {log.match.bonusNumber != null && (
                                <div className="flex items-center gap-1">
                                  <span className="text-xs font-semibold text-slate-500">
                                    +
                                  </span>
                                  <LottoBall
                                    number={log.match.bonusNumber}
                                    size="xs"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        {log.reasons.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1 text-xs text-slate-500">
                            {log.reasons.map((reason) => (
                              <span key={`${log.id}-${reason}`}>#{reason}</span>
                            ))}
                          </div>
                        )}
                        {log.memo && (
                          <div className="mt-2 text-xs text-slate-600">
                            {log.memo}
                          </div>
                        )}
                        <div className="mt-2 text-xs text-slate-600">
                          {log.match.isResolved
                            ? `결과: ${log.match.matchCount}개 일치${
                                log.match.bonusMatch ? " · 보너스 포함" : ""
                              }`
                            : "추첨 대기 · 목표 회차 발표 후 자동 업데이트"}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {isPremium && (
                  <div className="mt-3 flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        fetchSelectionLogs(Math.max(1, selectionPage - 1))
                      }
                      disabled={selectionLoading || selectionPage <= 1}
                      className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
                    >
                      이전
                    </button>
                    <span className="self-center text-xs text-slate-500">
                      {selectionPage} 페이지
                    </span>
                    <button
                      type="button"
                      onClick={() => fetchSelectionLogs(selectionPage + 1)}
                      disabled={
                        selectionLoading ||
                        selectionLogs.length < selectionLimit
                      }
                      className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
                    >
                      다음
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Accordion>
        </div>

        <div className="mt-4">
          <Accordion
            title="계정 삭제"
            chartKey="delete-account"
            openKey={openKey}
            setOpenKey={setOpenKey}
          >
            <div className="rounded-2xl border border-red-200 bg-red-50/60 p-5">
              <p className="text-sm text-red-700/80">
                계정 삭제 시 본 서비스에 저장된 사용자 정보와 분석 기록이 모두
                삭제되며, 해당 데이터는 복구할 수 없습니다. 소셜 계정 자체에는
                영향을 미치지 않습니다.
              </p>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="mt-4 rounded-xl border border-red-300 bg-white px-5 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
              >
                {deleteLoading
                  ? "삭제 중..."
                  : "계정 삭제 (모든 데이터 즉시 삭제)"}
              </button>
            </div>
          </Accordion>
        </div>
      </div>
    </main>
  );
}
