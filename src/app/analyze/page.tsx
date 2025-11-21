"use client";

import React, { useState } from "react";
import OneRoundAnalyze from "@/app/components/analyze/OneRoundAnalyze";
import MultiRoundAnalyze from "@/app/components/analyze/MultiRoundAnalyze";
import SimilarRounds from "@/app/components/analyze/SimilarPatterns";

function SumAnalysis() {
  return <div>합계 분석 모드</div>;
}

const tabs = [
  { id: "oneRound", label: "회차정보" },
  { id: "multiRound", label: "번호별 빈도수" },
  { id: "similar", label: "유사 회차" },
];

export default function LottoAnalysisPage() {
  const [activeTab, setActiveTab] = useState("oneRound");

  const renderContent = () => {
    switch (activeTab) {
      case "oneRound":
        return <OneRoundAnalyze />;
      case "multiRound":
        return <MultiRoundAnalyze />;
      case "similar":
        return <SimilarRounds />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      {/* 탭 UI */}
      <div className="flex border-b border-gray-300 mb-4">
        {tabs.map((tab) => (
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
