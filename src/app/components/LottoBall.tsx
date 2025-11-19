function getLottoBallColor(number: number): string {
  if (number >= 1 && number <= 10) return "bg-yellow-400";
  if (number >= 11 && number <= 20) return "bg-blue-500";
  if (number >= 21 && number <= 30) return "bg-red-500";
  if (number >= 31 && number <= 40) return "bg-gray-400";
  if (number >= 41 && number <= 45) return "bg-green-500";
  return "bg-black";
}

interface LottoBallProps {
  number: number;
}

const LottoBall: React.FC<LottoBallProps> = ({ number }) => {
  const bgColor = getLottoBallColor(number);

  return (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${bgColor}`}
    >
      {number}
    </div>
  );
};

export default LottoBall;
