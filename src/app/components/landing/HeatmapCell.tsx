"use client";

import { Tooltip } from "react-tooltip";

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

  return (
    <div
      data-tooltip-id={`tooltip-${number}`}
      data-tooltip-content={`번호 ${number}\n등장: ${count}회\n회차: ${rounds.join(
        ", "
      )}`}
      className="h-10 flex items-center justify-center text-white font-bold rounded cursor-pointer"
      style={{ backgroundColor: bgColor }}
    >
      {number}
    </div>
  );
}
