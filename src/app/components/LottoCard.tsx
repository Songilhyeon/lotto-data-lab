"use client";

import { useEffect, useState } from "react";
import { ApiResponse } from "@/app/types/api";
import { LottoNumber } from "@/app/types/lotto";
import LottoBall from "./LottoBall";

interface LottoCardProps {
  round: number;
}
export default function LottoCard({ round }: LottoCardProps) {
  const [data, setData] = useState<LottoNumber | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!round) return;

    async function load() {
      setLoading(true);
      try {
        const port = process.env.NEXT_PUBLIC_BACKEND_URL;
        const res = await fetch(`${port}/api/lotto/${round}`);
        const json: ApiResponse<LottoNumber> = await res.json();

        if (json.success) {
          setData(json.data!);
          setError(null);
        } else {
          setError(json.message || "에러 발생");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [round]);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!data || loading) return <div>Loading...</div>;

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2">회차 {data.drwNo}</h2>
      <p className="mb-2">
        추첨일: {new Date(data.drwNoDate).toLocaleDateString()}
      </p>
      <div className="flex space-x-2 mb-2">
        {[
          data.drwtNo1,
          data.drwtNo2,
          data.drwtNo3,
          data.drwtNo4,
          data.drwtNo5,
          data.drwtNo6,
        ].map((n) => (
          <LottoBall key={n} number={n} />
        ))}
        <LottoBall key={data.bnusNo} number={data.bnusNo} />
      </div>
      <p>총 판매액: {Number(data.totSellamnt).toLocaleString()}원</p>
      <p>1등 총 당첨금: {Number(data.firstAccumamnt).toLocaleString()}원</p>
      <p>1등 당첨금: {Number(data.firstWinamnt).toLocaleString()}원</p>
      <p>1등 인원: {data.firstPrzwnerCo}명</p>
    </div>
  );
}
