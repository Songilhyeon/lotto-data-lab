// ---------------- SimpleBarChart (완전 반응형 버전) ----------------
interface SimpleBarChartProps {
  title: string;
  data: { label: string; count: number }[];
}

export default function SimpleBarChart({ title, data }: SimpleBarChartProps) {
  const maxCount = Math.max(...data.map((d) => d.count));

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 mb-6 w-full min-w-0">
      <h2 className="text-xl font-bold mb-4">{title}</h2>

      <div className="space-y-3">
        {data.map((item) => {
          const widthPercent = maxCount > 0 ? (item.count / maxCount) * 100 : 0;

          return (
            <div
              key={item.label}
              className="flex items-center gap-2 w-full min-w-0"
            >
              <span className="w-10 text-sm text-gray-700 whitespace-nowrap">
                {item.label}
              </span>

              {/* 그래프 바 */}
              <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden min-w-0">
                <div
                  className="h-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                  style={{ width: `${widthPercent}%` }}
                />
              </div>

              <span className="w-8 text-sm text-right text-gray-700">
                {item.count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
