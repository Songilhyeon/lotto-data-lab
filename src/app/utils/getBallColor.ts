export const getBallColor = (n: number) => {
    if (n <= 10) return "bg-yellow-400";
    if (n <= 20) return "bg-blue-500";
    if (n <= 30) return "bg-red-500";
    if (n <= 40) return "bg-gray-400";
    return "bg-green-500";
};