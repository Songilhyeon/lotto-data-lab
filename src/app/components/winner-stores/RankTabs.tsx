"use client";

interface RankTabsProps {
  selectedRank: 1 | 2;
  setSelectedRank: (rank: 1 | 2) => void;
}

export default function RankTabs({
  selectedRank,
  setSelectedRank,
}: RankTabsProps) {
  return (
    <div className="flex justify-center gap-4 my-6">
      {[1, 2].map((rank) => (
        <button
          key={rank}
          onClick={() => setSelectedRank(rank as 1 | 2)}
          className={`px-5 py-2 rounded-full font-semibold transition-all duration-200
            ${
              selectedRank === rank
                ? "bg-blue-600 text-white shadow-lg scale-105"
                : "bg-blue-100 text-blue-800 hover:bg-blue-200"
            }
          `}
        >
          {rank}등
        </button>
      ))}
    </div>
  );
}
