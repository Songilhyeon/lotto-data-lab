import { Card, CardContent } from "@/app/components/winner-stores/Card";

interface MethodStatsCardProps {
  method: { auto: number; semi: number; manual: number };
  title: string;
}

export default function MethodStatsCard({
  method,
  title,
}: MethodStatsCardProps) {
  return (
    <Card className="rounded-2xl shadow-lg bg-linear-to-br from-slate-50 to-white border border-gray-200">
      <CardContent className="p-6 sm:p-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
          {title}
        </h2>
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { label: "자동", value: method.auto, icon: "🎰" },
            { label: "반자동", value: method.semi, icon: "⚙️" },
            { label: "수동", value: method.manual, icon: "✍️" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white border rounded-xl p-4 shadow hover:shadow-md transition cursor-default"
            >
              <div className="text-xl">{item.icon}</div>
              <p className="text-xs text-gray-500 mt-1">{item.label}</p>
              <p className="font-bold text-xl text-gray-900 mt-1">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
