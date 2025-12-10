"use client";

import { useState } from "react";
import { useAuth } from "../context/authContext";
import AiRecommend from "@/app/components/ai-recommend/AiRecommend";
import AiNextRecommend from "@/app/components/ai-recommend/AiNextRecommend";
import AiAdvancedRecommend from "@/app/components/ai-recommend/AiAdvancedRecommend";

// 모든 탭 정의 (사행성 제거, 분석/점수 기반으로 변경)
const allTabs = [
  { id: "AiRecommend", label: "기본 분석", premiumOnly: false },
  {
    id: "AiNextRecommend",
    label: "다음 회차 기반 분석",
    premiumOnly: false,
  },
  { id: "AiAdvancedRecommend", label: "심층 분석", premiumOnly: false },
];

export default function AiRecommendPage() {
  const [activeTab, setActiveTab] = useState<string>("AiRecommend");
  const { user } = useAuth();

  // 로그인/결제 상태에 따른 필터링
  const availableTabs = allTabs.filter(
    (tab) => !tab.premiumOnly || user?.role === "PREMIUM"
  );

  // 탭 콘텐츠 렌더링
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
      <div className="w-full flex justify-center mt-10">
        <div className="border border-gray-200 bg-gray-50 rounded-xl px-6 py-6 text-center shadow-sm">
          <p className="text-xl font-semibold text-gray-800">
            로그인이 필요합니다
          </p>
          <p className="text-gray-500 text-sm mt-2">
            로그인 후 더 많은 기능을 이용해보세요.
          </p>
        </div>
      </div>
    );

  return (
    <div className="p-4">
      {/* 탭 UI */}
      <div className="flex border-b border-gray-300 mb-4">
        {availableTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 -mb-px font-medium border-b-2 ${
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
