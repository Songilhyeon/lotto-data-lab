"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/authContext";
import { gaEvent } from "@/app/lib/gtag";

import OneRoundInfo from "@/app/components/analyze/OneRoundInfo";
import MultiRoundInfo from "@/app/components/analyze/MultiRoundInfo";
import NumberFrequency from "@/app/components/analyze/NumberFrequency";
import NextPatterns from "@/app/components/analyze/NextPatterns";
import NumberLab from "@/app/components/analyze/NumberLab";
import NumberRangeMatch from "@/app/components/analyze/NumberRange";
import PremiumAnalysis from "@/app/components/analyze/PremiumAnalysis";

// 모든 탭 정의
const allTabs = [
  { id: "oneRound", label: "회차 정보", premiumOnly: false },
  { id: "multiRound", label: "기간별 정보", premiumOnly: false },
  { id: "numberFrequency", label: "번호별 빈도수", premiumOnly: false },
  { id: "numberRange", label: "번호 구간", premiumOnly: false },
  { id: "next", label: "다음 회차", premiumOnly: false },
  { id: "numberLab", label: "번호 실험실", premiumOnly: false },
  { id: "premiumAnalysis", label: "통합 정보", premiumOnly: false },
];

export default function AnalyzeClient() {
  const [activeTab, setActiveTab] = useState("oneRound");
  const { user } = useAuth();

  useEffect(() => {
    gaEvent("tab_change", { tab_id: activeTab });
  }, [activeTab]);

  const availableTabs = allTabs.filter(
    (tab) => !tab.premiumOnly || user?.role === "PREMIUM"
  );

  const renderContent = () => {
    switch (activeTab) {
      case "oneRound":
        return <OneRoundInfo />;
      case "multiRound":
        return <MultiRoundInfo />;
      case "numberFrequency":
        return <NumberFrequency />;
      case "numberRange":
        return <NumberRangeMatch />;
      case "premiumAnalysis":
        return <PremiumAnalysis />;
      case "next":
        return <NextPatterns />;
      case "numberLab":
        return <NumberLab />;
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
              onClick={() => setActiveTab(tab.id)}
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
