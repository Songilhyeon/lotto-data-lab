import ChartPreview from "./ChartPreview";

async function getChartPreviewData() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/lotto/preview?recent=10`,
    {
      next: { revalidate: 60 * 60 },
    }
  );

  if (!res.ok) return null;
  return res.json();
}

export default async function ChartPreviewWrapper() {
  const data = await getChartPreviewData();

  return <ChartPreview data={data} />;
}
