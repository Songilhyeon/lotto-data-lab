export default function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeMap: Record<string, string> = {
    sm: "w-8 h-8",
    md: "w-10 h-10 sm:w-12 sm:h-12",
    lg: "w-14 h-14 sm:w-16 sm:h-16",
  };

  return (
    <div className="flex items-center space-x-1">
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

      {/* {size !== "sm" && (
        <span className="text-sm md:text-lg font-bold text-gray-900 select-none">
          Lotto Data Lab
        </span>
      )} */}
    </div>
  );
}
