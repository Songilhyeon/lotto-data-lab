import TopStoreItem from "./TopStoreItem";
import { Card, CardContent } from "@/app/components/winner-stores/Card";

interface TopStore {
  store: string;
  address: string;
  appearanceCount: number;
  autoWin?: number;
  semiAutoWin?: number;
  manualWin?: number;
}

interface TopStoresCardProps {
  stores: TopStore[];
  rank: number;
  region: string;
}

export default function TopStoresCard({
  stores,
  rank,
  region,
}: TopStoresCardProps) {
  return (
    <Card className="rounded-2xl shadow-lg bg-linear-to-br from-white to-slate-50 border border-gray-200 mt-6">
      <CardContent className="p-6 sm:p-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-5 text-gray-800">
          {rank}등 최다 배출 판매점 TOP 10 ({region})
        </h2>
        <div className="space-y-4">
          {stores.map((item, idx) => (
            <TopStoreItem
              key={idx}
              index={idx + 1}
              rank={rank}
              store={item.store}
              address={item.address}
              appearanceCount={item.appearanceCount}
              autoWin={item.autoWin}
              semiAutoWin={item.semiAutoWin}
              manualWin={item.manualWin}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
