"use client";

import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { gaEvent } from "@/app/lib/gtag";

import AiRecommend from "@/app/components/ai-recommend/AiRecommend";
import AiNextRecommend from "@/app/components/ai-recommend/AiNextRecommend";
import AiAdvancedRecommend from "@/app/components/ai-recommend/AiAdvancedRecommend";
import AiVariantRecommend from "@/app/components/ai-recommend/AiVariantRecommend";

const allTabs = [
  { id: "AiRecommend", label: "기본 점수 분석", premiumOnly: false },
  { id: "AiNextRecommend", label: "다음 회차 분석", premiumOnly: false },
  { id: "AiVariantRecommend", label: "전략 시뮬레이션", premiumOnly: false },
  { id: "AiAdvancedRecommend", label: "심층 점수 모델", premiumOnly: false },
];

type TabId = (typeof allTabs)[number]["id"];

export default function AiRecommendClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabFromUrl = useMemo(() => searchParams.get("tab"), [searchParams]);
  const activeTab: TabId = allTabs.some((tab) => tab.id === tabFromUrl)
    ? (tabFromUrl as TabId)
    : "AiRecommend";

  useEffect(() => {
    gaEvent("tab_change", { tab_id: activeTab });

    const tab = allTabs.find((t) => t.id === activeTab);
    if (tab?.premiumOnly) {
      gaEvent("premium_tab_viewed_free", { tab_id: activeTab });
    }
  }, [activeTab]);

  // ✅ 프리미엄 탭도 전부 노출
  const availableTabs = allTabs;
  const handleTabChange = (tabId: TabId) => {
    router.replace(`/ai-recommend?tab=${tabId}`, { scroll: false });
  };

  return (
    <div className="px-4 sm:px-6 pt-4 pb-10">
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

                {/* ⭐ 프리미엄 표시 (차단 없음) */}
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
      <div className="mt-2">
        {activeTab === "AiRecommend" && <AiRecommend />}
        {activeTab === "AiNextRecommend" && <AiNextRecommend />}
        {activeTab === "AiVariantRecommend" && <AiVariantRecommend />}
        {activeTab === "AiAdvancedRecommend" && <AiAdvancedRecommend />}
      </div>
    </div>
  );
}
