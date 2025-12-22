"use client";

import dynamic from "next/dynamic";

const ChartPreview = dynamic(() => import("./ChartPreview"), { ssr: false });

interface Props {
  data: {
    topNumbers: { number: number; count: number }[];
    rangeStats: { range: string; count: number }[];
  };
}

export default function ChartPreviewClientWrapper({ data }: Props) {
  return <ChartPreview data={data} />;
}
