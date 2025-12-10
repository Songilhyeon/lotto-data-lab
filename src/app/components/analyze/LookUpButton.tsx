export default function LookUpButton({
  onClick,
  loading,
}: {
  onClick: () => void;
  loading: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`
        w-full sm:w-auto
        px-5 py-3
        bg-blue-600 text-white
        rounded-xl
        font-semibold
        shadow-md
        hover:bg-blue-700
        active:scale-95
        transition
        disabled:opacity-60 disabled:cursor-not-allowed
        text-base sm:text-sm
      `}
    >
      {loading ? "⏳ 조회 중..." : "🔍 조회하기"}
    </button>
  );
}
