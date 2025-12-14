interface PremiumLockProps {
  isPremium: boolean;
  children: React.ReactNode;
  height?: number;
}

export function PremiumLock({
  isPremium,
  children,
  height = 240,
}: PremiumLockProps) {
  if (isPremium) return <>{children}</>;

  return (
    <div className="relative">
      <div
        className="blur-sm pointer-events-none select-none"
        style={{ minHeight: height }}
      >
        {children}
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur rounded-xl px-5 py-4 text-center shadow-lg">
          <p className="text-sm font-semibold text-gray-800 mb-1">
            🔒 프리미엄 전용 분석
          </p>
          <p className="text-xs text-gray-500">
            업그레이드하면 전체 데이터를 볼 수 있어요
          </p>
        </div>
      </div>
    </div>
  );
}
