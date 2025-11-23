import { LottoNumber } from "@/app/types/lotto";

export default function LottoPaper({ data }: { data: LottoNumber | null }) {
  if (!data) return null;

  const numbers = [
    data.drwtNo1,
    data.drwtNo2,
    data.drwtNo3,
    data.drwtNo4,
    data.drwtNo5,
    data.drwtNo6,
    data.bnusNo,
  ];
  return (
    <div className="p-4 rounded-xl shadow-md bg-[#f9f9f4] w-full max-w-md mx-auto">
      <h2 className="text-lg sm:text-xl font-bold mb-2">{data.drwNo} 회</h2>
      <div className="grid grid-cols-7 gap-0.5 text-center">
        {[...Array(45)].map((_, i) => {
          const num = i + 1;
          const isHit = numbers.includes(num) && data.bnusNo !== num;
          const isBonus = data.bnusNo === num;
          return (
            <div
              key={num}
              className={`
            w-8 h-8 flex items-center justify-center border border-gray-300 rounded-sm
            text-sm font-semibold
            ${
              isHit
                ? "bg-yellow-300 text-black"
                : isBonus
                ? "bg-green-300 text-black"
                : "bg-white text-gray-400"
            }
          `}
            >
              {num}
            </div>
          );
        })}
      </div>
    </div>
  );
}
