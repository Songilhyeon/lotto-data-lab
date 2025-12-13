interface TopStoreItemProps {
  rank: number;
  store: string;
  address: string;
  appearanceCount: number;
  autoWin?: number;
  semiAutoWin?: number;
  manualWin?: number;
}

export default function TopStoreItem({
  rank,
  store,
  address,
  appearanceCount,
  autoWin = 0,
  semiAutoWin = 0,
  manualWin = 0,
}: TopStoreItemProps) {
  return (
    <div className="flex items-center justify-between bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition">
      <div className="flex-1">
        <p className="font-semibold text-gray-900 text-sm sm:text-base flex items-center gap-2">
          <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md text-xs font-bold">
            {rank}위
          </span>
          {store}
        </p>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">{address}</p>
      </div>
      <div className="text-right">
        <span className="text-yellow-600 font-bold text-lg sm:text-xl">
          {appearanceCount}회
        </span>
        <div className="text-gray-500 text-xs mt-1">
          자동: {autoWin} | 반자동: {semiAutoWin} | 수동: {manualWin}
        </div>
      </div>
    </div>
  );
}
