"use client";

import { useState, useEffect } from "react";
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

// 모든 탭 정의
const allTabs = [
  { id: "oneRound", label: "회차 정보", premiumOnly: false },
  { id: "multiRound", label: "기간별 정보", premiumOnly: false },
  { id: "basicSummary", label: "기본 분석", premiumOnly: false },
  { id: "numberFrequency", label: "번호별 빈도수", premiumOnly: false },
  { id: "numberRange", label: "번호 구간", premiumOnly: false },
  { id: "next", label: "일치 개수", premiumOnly: false },
  { id: "intervalPattern", label: "출현 간격", premiumOnly: false },
  { id: "roundDistPattern", label: "번호 간격", premiumOnly: false },
  { id: "numberLab", label: "번호 실험실", premiumOnly: false },
  { id: "premiumAnalysis", label: "통합 정보", premiumOnly: false },
];

export default function AnalyzeClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const availableTabs = allTabs.filter(
    // (tab) => !tab.premiumOnly || user?.role === "PREMIUM"
    (tab) => !tab.premiumOnly
  );

  // 🔥 URL 쿼리 기반 초기 탭
  const initialTab =
    searchParams.get("tab") &&
    availableTabs.some((t) => t.id === searchParams.get("tab"))
      ? searchParams.get("tab")!
      : "oneRound";

  const [activeTab, setActiveTab] = useState(initialTab);

  // GA 이벤트
  useEffect(() => {
    gaEvent("tab_change", { tab_id: activeTab });
  }, [activeTab]);

  // 탭 클릭 시 URL 동기화
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    router.replace(`/analyze?tab=${tabId}`, { scroll: false });
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
      case "intervalPattern":
        return <IntervalPatternTab />;
      case "roundDistPattern":
        return <RoundDistPatternTab />;
      case "numberLab":
        return <NumberLab />;
      case "premiumAnalysis":
        return (
          <RequireAuth>
            <PremiumAnalysis />;
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
          {availableTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-3 py-2 text-sm sm:text-base rounded-t-lg whitespace-nowrap transition-all
                ${
                  activeTab === tab.id
                    ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                    : "text-gray-500 hover:text-gray-700"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="mt-2">{renderContent()}</div>
    </>
  );
}
