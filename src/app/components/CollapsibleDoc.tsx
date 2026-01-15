import type { ReactNode } from "react";

export default function CollapsibleDoc({
  title,
  subtitle,
  children,
  defaultOpen = false,
  variant = "default",
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  variant?: "default" | "home" | "analyze" | "ai" | "winner" | "history" | "board";
}) {
  const variantClasses = {
    default: {
      wrapper: "border-gray-200 bg-white/70",
      badge: "border-gray-200 bg-white text-gray-700",
    },
    home: {
      wrapper: "border-indigo-200 bg-gradient-to-br from-indigo-50/80 to-white",
      badge: "border-indigo-200 bg-indigo-50 text-indigo-700",
    },
    analyze: {
      wrapper: "border-blue-200 bg-gradient-to-br from-blue-50/80 to-white",
      badge: "border-blue-200 bg-blue-50 text-blue-700",
    },
    ai: {
      wrapper: "border-fuchsia-200 bg-gradient-to-br from-fuchsia-50/80 to-white",
      badge: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
    },
    winner: {
      wrapper: "border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-white",
      badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    },
    history: {
      wrapper: "border-amber-200 bg-gradient-to-br from-amber-50/80 to-white",
      badge: "border-amber-200 bg-amber-50 text-amber-700",
    },
    board: {
      wrapper: "border-slate-200 bg-gradient-to-br from-slate-50/80 to-white",
      badge: "border-slate-200 bg-slate-50 text-slate-700",
    },
  };
  const selected = variantClasses[variant] ?? variantClasses.default;

  return (
    <section className="mx-auto mt-8 max-w-4xl px-4 pb-6">
      <details
        open={defaultOpen}
        className={`group rounded-xl border p-3 ${selected.wrapper}`}
      >
        <summary className="cursor-pointer list-none select-none">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-black text-gray-900">{title}</div>
              {!!subtitle && (
                <div className="mt-1 text-xs text-gray-500">{subtitle}</div>
              )}
            </div>
            <span
              className={`rounded-lg border px-2 py-1 text-xs font-bold ${selected.badge}`}
            >
              <span className="group-open:hidden">펼치기</span>
              <span className="hidden group-open:inline">접기</span>
            </span>
          </div>
        </summary>

        <div className="mt-3 border-t border-gray-200 pt-3">
          <div className="space-y-4 text-sm leading-6 text-gray-700">
            {children}
          </div>
          <div className="mt-3 text-xs text-gray-500">
            * 이 섹션은 기본적으로 접혀 있고, 필요할 때만 펼쳐서 확인할 수
            있습니다.
          </div>
        </div>
      </details>
    </section>
  );
}
