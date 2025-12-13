"use client";

interface RegionTabsProps {
  regions: string[];
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
}

export default function RegionTabs({
  regions,
  selectedRegion,
  setSelectedRegion,
}: RegionTabsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 my-6">
      {/* 전국 */}
      <button
        onClick={() => setSelectedRegion("전국")}
        className={`px-4 py-1 rounded-lg font-medium border transition-all duration-150
          ${
            selectedRegion === "전국"
              ? "bg-white border-blue-500 text-blue-600 shadow-sm"
              : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
          }
        `}
      >
        전국
      </button>

      {/* 지역 목록 */}
      {regions.map((region) => (
        <button
          key={region}
          onClick={() => setSelectedRegion(region)}
          className={`px-4 py-1 rounded-lg font-medium border transition-all duration-150
            ${
              selectedRegion === region
                ? "bg-white border-blue-500 text-blue-600 shadow-sm"
                : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
            }
          `}
        >
          {region}
        </button>
      ))}
    </div>
  );
}
