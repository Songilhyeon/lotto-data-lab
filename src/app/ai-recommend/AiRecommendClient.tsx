"use client";

import { useState, useEffect } from "react";
import { gaEvent } from "@/app/lib/gtag";
import AiRecommend from "@/app/components/ai-recommend/AiRecommend";
import AiNextRecommend from "@/app/components/ai-recommend/AiNextRecommend";
import AiAdvancedRecommend from "@/app/components/ai-recommend/AiAdvancedRecommend";

const allTabs = [
  { id: "AiRecommend", label: "기본 분석", premiumOnly: false },
  { id: "AiNextRecommend", label: "다음 회차 기반 분석", premiumOnly: false },
  { id: "AiAdvancedRecommend", label: "심층 분석", premiumOnly: false },
];

export default function AiRecommendClient() {
  const [activeTab, setActiveTab] = useState("AiRecommend");

  useEffect(() => {
    gaEvent("tab_change", { tab_id: activeTab });
  }, [activeTab]);

  const availableTabs = allTabs.filter(
    // (tab) => !tab.premiumOnly || user?.role === "PREMIUM"
    (tab) => !tab.premiumOnly
  );

  return (
    <div className="px-4 sm:px-6 pt-4 pb-10">
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
      <div className="mt-2">
        <div
          style={{ display: activeTab === "AiRecommend" ? "block" : "none" }}
        >
          <AiRecommend />
        </div>

        <div
          style={{
            display: activeTab === "AiNextRecommend" ? "block" : "none",
          }}
        >
          <AiNextRecommend />
        </div>

        <div
          style={{
            display: activeTab === "AiAdvancedRecommend" ? "block" : "none",
          }}
        >
          <AiAdvancedRecommend />
        </div>
      </div>
    </div>
  );
}
