// ---------------- SimpleBarChart 컴포넌트 ----------------
interface SimpleBarChartProps {
  title: string;
  data: { label: string; count: number }[];
  maxWidth?: number;
}

export default function SimpleBarChart({
  title,
  data,
  maxWidth = 300,
}: SimpleBarChartProps) {
  const maxCount = Math.max(...data.map((d) => d.count));

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="space-y-2">
        {data.map((item) => {
          const width = maxCount > 0 ? (item.count / maxCount) * maxWidth : 0;
          return (
            <div key={item.label} className="flex items-center gap-2">
              <span className="w-10 text-sm text-gray-700 whitespace-nowrap">
                {item.label}
              </span>
              <div className="flex-1 bg-gray-200 rounded-full h-4">
                <div
                  className="bg-linear-to-r from-purple-500 to-pink-500 h-4 rounded-full"
                  style={{ width }}
                ></div>
              </div>
              <span className="w-8 text-sm text-gray-700 text-right">
                {item.count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
