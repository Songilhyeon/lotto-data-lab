"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { gaEvent } from "@/app/lib/gtag";
import AiRecommend from "@/app/components/ai-recommend/AiRecommend";
import AiNextRecommend from "@/app/components/ai-recommend/AiNextRecommend";
import AiAdvancedRecommend from "@/app/components/ai-recommend/AiAdvancedRecommend";

const allTabs = [
  { id: "AiRecommend", label: "기본 분석", premiumOnly: false },
  { id: "AiNextRecommend", label: "다음 회차 기반 분석", premiumOnly: false },
  { id: "AiAdvancedRecommend", label: "심층 분석", premiumOnly: false },
];

export default function AiRecommendPage() {
  const [activeTab, setActiveTab] = useState<string>("AiRecommend");
  const { user } = useAuth();

  useEffect(() => {
    gaEvent("tab_change", { tab_id: activeTab });
  }, [activeTab]);

  const availableTabs = allTabs.filter(
    (tab) => !tab.premiumOnly || user?.role === "PREMIUM"
  );

  const renderContent = () => {
    switch (activeTab) {
      case "AiRecommend":
        return <AiRecommend />;
      case "AiNextRecommend":
        return <AiNextRecommend />;
      case "AiAdvancedRecommend":
        return <AiAdvancedRecommend />;
      default:
        return null;
    }
  };

  if (!user)
    return (
      <div className="w-full flex justify-center mt-10 px-4">
        <div className="bg-white shadow-md rounded-xl px-4 py-5 text-center sm:px-6 sm:py-6">
          <p className="text-lg font-semibold text-gray-700 mb-2">
            로그인이 필요해요 😊
          </p>
          <p className="text-gray-500 text-sm">
            이 기능은 로그인 사용자만 이용할 수 있어요. 로그인 후 다시
            이용해주세요!
          </p>
        </div>
      </div>
    );

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      {/* 탭 UI: 모바일에서 스크롤 가능 */}
      <div className="flex overflow-x-auto border-b border-gray-300 mb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
        {availableTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 px-4 py-2 sm:px-6 sm:py-3 font-medium border-b-2 ${
              activeTab === tab.id
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 선택된 분석 모드 콘텐츠 */}
      <div>{renderContent()}</div>
    </div>
  );
}
