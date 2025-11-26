"use client";

interface Props {
  number: number;
  count: number;
  minCount: number;
  maxCount: number;
  rounds: number[];
}

function getRgbGradientColor(count: number, min: number, max: number) {
  const ratio = max === min ? 0 : (count - min) / (max - min);

  const r = Math.round(239 * ratio + 59 * (1 - ratio));
  const g = Math.round(68 * ratio + 130 * (1 - ratio));
  const b = Math.round(68 * ratio + 246 * (1 - ratio));

  return `rgb(${r}, ${g}, ${b})`;
}

export default function HeatmapCell({
  number,
  count,
  minCount,
  maxCount,
  rounds,
}: Props) {
  const cellColor = getRgbGradientColor(count, minCount, maxCount);
  const tooltipColor = cellColor; // 동일한 색상 적용

  const tooltipHtml = `
    <div class="px-3 py-2 rounded-lg shadow-lg text-white text-sm leading-relaxed max-w-xs"
      style="background: ${tooltipColor};">
      <div class="font-semibold mb-1">번호 ${number}</div>
      <div>등장: <span class="font-semibold">${count}회</span></div>
      <div class="mt-1 text-gray-200">회차: ${rounds.join(", ")}</div>
    </div>
  `;

  return (
    <div
      data-tooltip-id="lotto-tooltip"
      data-tooltip-html={tooltipHtml}
      className="h-10 flex items-center justify-center text-white font-bold rounded cursor-pointer"
      style={{ backgroundColor: cellColor }}
    >
      {number}
    </div>
  );
}
