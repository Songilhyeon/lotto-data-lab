"use client";

import { useState } from "react";
import { useAuth } from "@/app/context/authContext";

import OneRoundInfo from "@/app/components/analyze/OneRoundInfo";
import MultiRoundInfo from "@/app/components/analyze/MultiRoundInfo";
import NumberFrequency from "@/app/components/analyze/NumberFrequency";
import SimilarRounds from "@/app/components/analyze/SimilarPatterns";
import NumberLab from "@/app/components/analyze/NumberLab";
import LottoPatterns from "../components/analyze/LottoPatterns";

// 모든 탭 정의
const allTabs = [
  { id: "oneRound", label: "회차 정보", premiumOnly: false },
  { id: "multiRound", label: "기간별 정보", premiumOnly: false },
  { id: "numberFrequency", label: "번호별 빈도수", premiumOnly: false },
  { id: "similar", label: "유사 회차", premiumOnly: true }, // PREMIUM만 보기
  { id: "numberLab", label: "번호 실험실", premiumOnly: true }, // PREMIUM만 보기
  { id: "test", label: "테스트", primiumOnly: false },
];

export default function LottoAnalysisPage() {
  const [activeTab, setActiveTab] = useState("oneRound");
  const { user } = useAuth();

  // 로그인/결제 상태에 따른 필터링
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
      case "similar":
        return <SimilarRounds />;
      case "numberLab":
        return <NumberLab />;
      case "test":
        return <LottoPatterns />;
      default:
        return null;
    }
  };

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
