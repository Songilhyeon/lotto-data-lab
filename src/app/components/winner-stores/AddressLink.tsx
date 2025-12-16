"use client";
import { MdLocationOn } from "react-icons/md";
import { getAddressInfo } from "@/app/utils/getUtils";

interface Props {
  address?: string;
}

export default function AddressLink({ address }: Props) {
  const info = getAddressInfo(address);

  if (info.type === "NORMAL") {
    return (
      <a
        href={`https://m.map.naver.com/search2/search.nhn?query=${encodeURIComponent(
          address!
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline text-blue-600 inline-flex items-center gap-1"
      >
        {address}
        <MdLocationOn size={16} />
      </a>
    );
  }

  if (info.type === "ONLINE") {
    return (
      <span className="inline-flex items-center gap-1 text-gray-500">
        동행복권 온라인 판매
      </span>
    );
  }

  return <span className="text-gray-400">주소 정보 없음</span>;
}
