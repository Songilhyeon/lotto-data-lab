"use client";

interface Props {
  number: number;
  count: number;
  minCount: number;
  maxCount: number;
  rounds: number[];
}

/** 색깔 대비 자동 판단 */
function getContrastTextColor(r: number, g: number, b: number) {
  // YIQ 계산 — 밝기 판단
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#000" : "#fff"; // 배경 밝으면 검정, 어두우면 흰색
}

/** 부드러운 그라데이션 생성 + 예외처리 강화 */
function getRgbGradientColor(count: number, min: number, max: number) {
  let ratio = 0;
  if (max > min) ratio = (count - min) / (max - min);
  ratio = Math.max(0, Math.min(1, ratio)); // 0~1 범위 강제

  const r = Math.round(239 * ratio + 59 * (1 - ratio));
  const g = Math.round(68 * ratio + 130 * (1 - ratio));
  const b = Math.round(68 * ratio + 246 * (1 - ratio));

  return { rgb: `rgb(${r}, ${g}, ${b})`, r, g, b };
}

export default function HeatmapCell({
  number,
  count,
  minCount,
  maxCount,
  rounds,
}: Props) {
  const { rgb, r, g, b } = getRgbGradientColor(count, minCount, maxCount);
  const textColor = getContrastTextColor(r, g, b);

  /** 모바일 UI에서 더 읽기 쉽게 툴팁 개선 */
  const tooltipHtml = `
    <div class="px-3 py-2 rounded-lg shadow-xl text-sm leading-relaxed max-w-xs"
      style="background:${rgb}; color:${textColor}">
      <div class="font-bold mb-1">번호 ${number}</div>
      <div>등장: <span class="font-bold">${count}회</span></div>
      <div class="mt-1 opacity-90">회차: ${rounds.join(", ")}</div>
    </div>
  `;

  return (
    <div
      data-tooltip-id="lotto-tooltip"
      data-tooltip-html={tooltipHtml}
      className="
        flex items-center justify-center font-bold rounded-md cursor-pointer
        transition-transform active:scale-95
        h-9 text-sm sm:h-10 sm:text-base
      "
      style={{
        backgroundColor: rgb,
        color: textColor,
      }}
    >
      {number}
    </div>
  );
}
