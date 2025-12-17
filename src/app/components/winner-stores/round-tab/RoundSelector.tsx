"use client";

interface Props {
  selectedRound: number;
  setSelectedRound: (round: number) => void;
  latestRound: number;
}

export default function RoundSelector({
  selectedRound,
  setSelectedRound,
  latestRound,
}: Props) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => selectedRound > 1 && setSelectedRound(selectedRound - 1)}
        disabled={selectedRound <= 1}
        className="w-10 h-10 rounded-xl border flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        ←
      </button>

      <input
        type="number"
        min={1}
        max={latestRound}
        value={selectedRound ?? ""}
        onChange={(e) => {
          const v = e.target.value;
          if (!v) return setSelectedRound(latestRound);
          const n = Number(v);
          if (n < 1 || n > latestRound) return;
          setSelectedRound(n);
        }}
        className="w-24 text-center px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={() =>
          selectedRound < latestRound && setSelectedRound(selectedRound + 1)
        }
        disabled={selectedRound >= latestRound}
        className="w-10 h-10 rounded-xl border flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        →
      </button>

      <span className="ml-2 text-xs text-gray-400">최신 {latestRound}회</span>
    </div>
  );
}
