"use client";

interface Props {
  number: number;
  count: number;
  maxCount: number;
  rounds: number[];
}

export default function HeatmapCell({
  number,
  count,
  maxCount,
  rounds,
}: Props) {
  const intensity = Math.min(count / maxCount, 1);
  const bgColor = `rgba(59, 130, 246, ${intensity})`;

  const tooltipHtml = `
    <div class="px-3 py-2 rounded-lg shadow-lg bg-gray-900 text-white text-sm leading-relaxed max-w-xs">
      <div class="font-semibold text-blue-400 mb-1">번호 ${number}</div>
      <div>등장: <span class="font-semibold">${count}회</span></div>
      <div class="mt-1 text-gray-300">회차: ${rounds.join(", ")}</div>
    </div>
  `;

  return (
    <div
      data-tooltip-id="lotto-tooltip"
      data-tooltip-html={tooltipHtml}
      className="h-10 flex items-center justify-center text-white font-bold rounded cursor-pointer"
      style={{ backgroundColor: bgColor }}
    >
      {number}
    </div>
  );
}
