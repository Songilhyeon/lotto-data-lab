"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { gaEvent } from "@/app/lib/gtag";

import OneRoundInfo from "@/app/components/analyze/TabOneRoundInfo";
import MultiRoundInfo from "@/app/components/analyze/TabMultiRoundInfo";
import NumberFrequency from "@/app/components/analyze/TabNumberFrequency";
import NextPatterns from "@/app/components/analyze/TabNextPatterns";
import NumberLab from "@/app/components/analyze/TabNumberLab";
import NumberRangeMatch from "@/app/components/analyze/TabNumberRange";
import PremiumAnalysis from "@/app/components/analyze/TabPremiumAnalysis";
import RequireAuth from "../components/RequireAuth";
import BasicSummary from "@/app/components/analyze/TabBasicSummary";
import IntervalPatternTab from "@/app/components/analyze/TabIntervalPattern";
import RoundDistPatternTab from "@/app/components/analyze/TabRoundDistPattern";
import PremiumNextFreqBuilder from "@/app/components/analyze/TabPremiumNextFreqBuilder";

// 모든 탭 정의
const allTabs = [
  { id: "oneRound", label: "회차 정보", premiumOnly: false },
  { id: "multiRound", label: "기간별 정보", premiumOnly: false },
  { id: "basicSummary", label: "기본 분석", premiumOnly: false },
  { id: "numberFrequency", label: "번호별 빈도수", premiumOnly: false },
  { id: "numberRange", label: "번호 구간", premiumOnly: false },
  { id: "next", label: "일치 개수", premiumOnly: false },
  { id: "numberLab", label: "번호 실험실", premiumOnly: false },
  { id: "intervalPattern", label: "출현 간격", premiumOnly: true },
  { id: "roundDistPattern", label: "번호 간격", premiumOnly: true },
  { id: "premiumAnalysis", label: "통합 분석", premiumOnly: true },
  { id: "premiumNextFreq", label: "조건 기반 분석", premiumOnly: true },
];

type TabId = (typeof allTabs)[number]["id"];

function PremiumGateModal({
  open,
  onClose,
  onUpgrade,
  tabLabel,
}: {
  open: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  tabLabel?: string;
}) {
  // ESC로 닫기
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-gray-200">
          <div className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                  🔒 Premium
                </div>
                <h3 className="mt-3 text-lg sm:text-xl font-bold text-gray-900">
                  {tabLabel
                    ? `“${tabLabel}”는 프리미엄 전용 기능입니다`
                    : "이 기능은 프리미엄 전용 기능입니다"}
                </h3>

                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  프리미엄으로 업그레이드하시면 보다 정교한 분석과 실험 기능을
                  모두 이용하실 수 있습니다.
                </p>
              </div>

              <button
                onClick={onClose}
                className="rounded-lg px-2 py-1 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition"
                aria-label="닫기"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm font-semibold text-gray-800">
                프리미엄 이용 시 제공되는 기능
              </p>

              <ul className="mt-2 space-y-1 text-sm text-gray-600">
                <li className="flex gap-2">
                  <span className="text-gray-500">•</span>
                  패턴·빈도·일치·간격을 종합한 통합 분석
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-500">•</span>
                  번호 실험 및 가중치 기반 분석 흐름
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-500">•</span>
                  추가 필터, 정렬 옵션 및 고급 통계 기능
                </li>
              </ul>
            </div>

            <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
              <button
                onClick={onClose}
                className="w-full sm:w-auto rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                닫기
              </button>

              <button
                onClick={onUpgrade}
                className="w-full sm:w-auto rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
              >
                프리미엄으로 업그레이드 →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AnalyzeClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // ✅ 지금은 제한 없이 전부 사용 가능 (차단/모달 없음)
  // const isPremiumUser = false;

  const availableTabs = allTabs;

  const tabFromUrl = searchParams.get("tab");

  const isValidTab = useMemo(() => {
    return !!tabFromUrl && availableTabs.some((t) => t.id === tabFromUrl);
  }, [tabFromUrl, availableTabs]);

  // 🔥 URL 쿼리 기반 초기 탭 (프리미엄이든 뭐든 허용)
  const initialTab: TabId = isValidTab ? (tabFromUrl as TabId) : "oneRound";

  const [activeTab, setActiveTab] = useState<TabId>(initialTab);

  // GA 이벤트
  useEffect(() => {
    gaEvent("tab_change", { tab_id: activeTab });
  }, [activeTab]);

  // 탭 클릭 시 URL 동기화 (항상 허용)
  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
    router.replace(`/analyze?tab=${tabId}`, { scroll: false });

    const tab = availableTabs.find((t) => t.id === tabId);
    if (tab?.premiumOnly) {
      // ✅ "프리미엄 기능임"을 추적만 (차단 없음)
      gaEvent("premium_tab_viewed_free", { tab_id: tabId });
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "oneRound":
        return <OneRoundInfo />;
      case "multiRound":
        return <MultiRoundInfo />;
      case "basicSummary":
        return <BasicSummary />;
      case "numberFrequency":
        return <NumberFrequency />;
      case "numberRange":
        return <NumberRangeMatch />;
      case "next":
        return <NextPatterns />;
      case "numberLab":
        return <NumberLab />;
      case "intervalPattern":
        return (
          <RequireAuth>
            <IntervalPatternTab />
          </RequireAuth>
        );
      case "roundDistPattern":
        return (
          <RequireAuth>
            <RoundDistPatternTab />
          </RequireAuth>
        );
      case "premiumAnalysis":
        return (
          <RequireAuth>
            <PremiumAnalysis />
          </RequireAuth>
        );
      case "premiumNextFreq":
        return (
          <RequireAuth>
            <PremiumNextFreqBuilder />
          </RequireAuth>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* 탭 UI */}
      <div className="overflow-x-auto scrollbar-hide mb-4">
        <div className="flex space-x-4 border-b border-gray-200 min-w-max pb-1">
          {availableTabs.map((tab) => {
            const isPremium = tab.premiumOnly;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-3 py-2 text-sm sm:text-base rounded-t-lg whitespace-nowrap transition-all flex items-center gap-2
                  ${
                    activeTab === tab.id
                      ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                      : "text-gray-500 hover:text-gray-700"
                  }
                `}
              >
                <span>{tab.label}</span>

                {isPremium && (
                  <span
                    className={`text-[11px] leading-none ${
                      activeTab === tab.id ? "text-amber-600" : "text-amber-400"
                    }`}
                    title="프리미엄 기능 (현재는 무료로 제공 중입니다)"
                  >
                    ★
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="mt-2">{renderContent()}</div>
    </>
  );
}
