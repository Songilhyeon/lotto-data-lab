import { MdLocationOn } from "react-icons/md";
import { getAddressInfo } from "@/app/utils/getUtils";

interface TopStoreItemProps {
  index: number;
  rank: number;
  store: string;
  address: string;
  appearanceCount: number;
  autoWin?: number;
  semiAutoWin?: number;
  manualWin?: number;
}

export default function TopStoreItem({
  index,
  rank,
  store,
  address,
  appearanceCount,
  autoWin = 0,
  semiAutoWin = 0,
  manualWin = 0,
}: TopStoreItemProps) {
  const addressInfo = getAddressInfo(address);

  return (
    <div className="flex items-center justify-between bg-white border rounded-xl p-4 shadow-sm hover:shadow-xl transition">
      <div className="flex-1">
        <p className="font-semibold text-gray-900 text-sm sm:text-base flex items-center gap-2">
          <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md text-xs font-bold">
            {index === 0 ? "-" : `${index}`}위
          </span>
          {store}
        </p>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          {addressInfo.type !== "NORMAL" || index === 0 ? (
            <span className="text-gray-400">{address}</span>
          ) : (
            <a
              href={`https://m.map.naver.com/search2/search.nhn?query=${encodeURIComponent(
                address
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-blue-600 inline-flex items-center gap-1"
            >
              {address}
              <MdLocationOn size={16} />
            </a>
          )}

          {addressInfo.type === "ONLINE" && (
            <span className="inline-flex items-center gap-1 text-gray-500">
              동행복권 온라인 판매
            </span>
          )}

          {addressInfo.type === "EMPTY" && (
            <span className="text-gray-400">주소 정보 없음</span>
          )}
        </p>
      </div>
      <div className="text-right">
        <span className="text-yellow-600 font-bold text-lg sm:text-xl">
          {index !== 0 ? appearanceCount : "-"}회
        </span>
        {rank === 1 && index !== 0 && (
          <div className="text-gray-500 text-xs mt-1">
            자동: {autoWin} | 반자동: {semiAutoWin} | 수동: {manualWin}
          </div>
        )}
      </div>
    </div>
  );
}
