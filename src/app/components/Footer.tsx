import Link from "next/link";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeMap: Record<string, string> = {
    sm: "w-8 h-8",
    md: "w-10 h-10 sm:w-12 sm:h-12",
    lg: "w-14 h-14 sm:w-16 sm:h-16",
  };

  return (
    <div className="flex items-center space-x-1">
      {/* SVG 로고 */}
      <svg
        className={sizeMap[size]}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="32" cy="32" r="32" fill="#FCD34D" />
        <circle cx="32" cy="32" r="20" fill="#3B82F6" />
        <text
          x="32"
          y="38"
          textAnchor="middle"
          fontSize="18"
          fontWeight="bold"
          fill="white"
          fontFamily="sans-serif"
        >
          LDL
        </text>
      </svg>

      {/* 텍스트 */}
      {size !== "sm" && (
        <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 select-none">
          Lotto Data Lab
        </span>
      )}
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-white bg-opacity-95 backdrop-blur-sm shadow-inner mt-12">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-row justify-center items-center gap-2">
        <Logo size="sm" />
        <div className="text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} 로또 데이터 연구소. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
