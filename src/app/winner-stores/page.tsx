"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/app/components/winner-stores/Card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { apiUrl } from "@/app/utils/getUtils";

interface Method {
  auto: number | null;
  semiAuto: number | null;
  manual: number | null;
}

interface Region {
  count: number;
  store: string;
  address: string;
}

export default function WinnerStoresPage() {
  const [topStores, setTopStores] = useState<Region[]>([]);
  const [regionStats, setRegionStats] = useState([]);
  const [methodStats, setMethodStats] = useState<Method>({
    auto: null,
    semiAuto: null,
    manual: null,
  });

  useEffect(() => {
    async function load() {
      const data = await fetch(`${apiUrl}/lotto/stores`).then((r) => r.json());
      console.log(data);
      setTopStores(data.tops);
      setRegionStats(data.region);
      setMethodStats(data.method);
    }
    load();
  }, []);

  console.log(methodStats);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-4xl mx-auto space-y-8">
      {/* HEADER */}
      <header className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          1등 당첨 지역 분석
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          회차 누적 기반의 판매점/지역 분석 데이터
        </p>
      </header>

      {/* METHOD STATS */}
      {methodStats && (
        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              전체 1등 당첨 방식 비율
            </h2>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-white border rounded-xl p-3 shadow-sm">
                <p className="text-xs text-gray-500">자동</p>
                <p className="font-bold text-lg">{methodStats.auto}</p>
              </div>
              <div className="bg-white border rounded-xl p-3 shadow-sm">
                <p className="text-xs text-gray-500">반자동</p>
                <p className="font-bold text-lg">{methodStats.semiAuto}</p>
              </div>
              <div className="bg-white border rounded-xl p-3 shadow-sm">
                <p className="text-xs text-gray-500">수동</p>
                <p className="font-bold text-lg">{methodStats.manual}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TOP STORES */}
      <Card className="rounded-2xl shadow-md">
        <CardContent className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            1등 최다 배출 판매점 TOP 10
          </h2>
          <div className="space-y-3">
            {topStores.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-white border rounded-xl p-3 shadow-sm"
              >
                <div>
                  <p className="font-semibold text-gray-800 text-sm sm:text-base">
                    {idx + 1}. {item.store}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {item.address}
                  </p>
                </div>
                <span className="text-yellow-600 font-bold text-sm sm:text-base">
                  {item.count}회
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* REGION CHART */}
      <Card className="rounded-2xl shadow-md">
        <CardContent className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            지역별 1등 배출 통계
          </h2>
          <div className="w-full h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionStats}>
                <XAxis dataKey="region" fontSize={12} tickLine={false} />
                <YAxis fontSize={12} tickLine={false} />
                <Tooltip />
                <Bar dataKey="count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
