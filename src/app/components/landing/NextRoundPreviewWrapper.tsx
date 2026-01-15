import NextRoundPreview from "./NextRoundPreview";
import { getLatestRound } from "@/app/utils/getUtils";

async function getNextRoundPreviewData() {
  const latestRound = getLatestRound();
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_URL
    }/lotto/next?start=1&end=${latestRound}&minMatch=${3}&preview=true`,
    {
      // 홈 요약이므로 캐시 가능
      next: { revalidate: 60 * 60 }, // 1시간
    }
  );

  if (!res.ok) return null;
  return res.json();
}

export default async function NextRoundPreviewWrapper() {
  const data = await getNextRoundPreviewData();

  return (
    <>
      <NextRoundPreview data={data.data} />
    </>
  );
}
