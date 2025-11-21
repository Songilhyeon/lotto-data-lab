// components/Logo.tsx
import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex items-center">
      <Image
        src="/logo.png" // public 폴더에 있는 로고 이미지
        alt="Lotto Data Lab"
        width={80} // 기본 너비
        height={80} // 기본 높이
        priority // LCP 최적화
        className="
          object-contain
          w-12 h-12           // 모바일 기본
          md:w-16 md:h-16     // md 이상 화면
          lg:w-24 lg:h-24     // lg 이상 화면
          rounded-full
        "
      />
      <span className="ml-3 text-xl sm:text-2xl md:text-3xl font-bold text-yellow-500">
        Lotto Data Lab
      </span>
    </div>
  );
}
