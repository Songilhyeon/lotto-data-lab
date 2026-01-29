"use client";

import { useState, useEffect, useMemo } from "react";
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
  { id: "roundDistPattern", label: "번호 간격", premiumOnly: false },
  { id: "numberLab", label: "번호 실험실", premiumOnly: false },
  { id: "premiumAnalysis", label: "통합 분석", premiumOnly: true },
  { id: "intervalPattern", label: "출현 간격", premiumOnly: true },
  { id: "premiumNextFreq", label: "조건 기반 분석", premiumOnly: true },
];

type TabId = (typeof allTabs)[number]["id"];

export default function AnalyzeClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // ✅ 지금은 제한 없이 전부 이용 가능 (차단/모달 없음)
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
      case "roundDistPattern":
        return <RoundDistPatternTab />;
      case "numberLab":
        return <NumberLab />;
      case "premiumAnalysis":
        return (
          // sih 20260129 임시주석
          // <RequireAuth requirePremium>
          <RequireAuth>
            <PremiumAnalysis />
          </RequireAuth>
        );
      case "intervalPattern":
        return (
          // <RequireAuth requirePremium>
          <RequireAuth>
            <IntervalPatternTab />
          </RequireAuth>
        );
      case "premiumNextFreq":
        return (
          // <RequireAuth requirePremium>
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
                    title="프리미엄 전용 기능입니다"
                  >
                    ★
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 콘텐츠 (비활성 탭 언마운트) */}
      <div className="mt-2">{renderContent()}</div>
    </>
  );
}
