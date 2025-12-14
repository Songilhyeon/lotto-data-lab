"use client";
import { Card, CardContent } from "@/app/components/winner-stores/Card";
import { MdLockOutline } from "react-icons/md";

interface Props {
  stores: {
    store: string;
    address?: string;
    count: number;
  }[];
  isPremium: boolean;
}

export default function PreviewTopStoresCard({ stores, isPremium }: Props) {
  const previewCount = 3;
  const visibleStores = isPremium ? stores : stores.slice(0, previewCount);
  console.log("PreviewTopStoresCard - isPremium:", visibleStores);
  return (
    <Card className="relative mt-6 overflow-hidden">
      <CardContent className="relative z-10 p-4 sm:p-6">
        {/* 헤더 */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            👀 당첨 판매점 일부 미리보기
          </h2>
          <p className="text-sm text-gray-500">
            실제 데이터 중 일부만 표시됩니다
          </p>
        </div>

        {/* 리스트 */}
        <ul className="space-y-3">
          {visibleStores.map((store, idx) => (
            <li key={idx} className="flex justify-between text-sm">
              <span className="font-medium text-gray-800">{store.store}</span>
              <span className="text-gray-500">{store.count}회</span>
            </li>
          ))}
        </ul>
      </CardContent>

      {!isPremium && (
        <div
          className="absolute bottom-0 left-0 right-0 h-12 z-20
                  bg-linear-to-t from-white via-white/80 to-transparent
                  backdrop-blur-sm"
        >
          <div className="h-full flex items-center justify-center">
            <span className="px-3 py-1 bg-white rounded-full shadow text-xs">
              🔒 프리미엄에서 전체 보기
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}
