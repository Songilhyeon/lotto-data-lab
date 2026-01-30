"use client";

/* -------------------------------
      Single-Open Accordion
--------------------------------*/
export default function Accordion({
  title,
  chartKey,
  openKey,
  setOpenKey,
  defaultOpen = false,
  containerClassName = "",
  children,
}: {
  title: React.ReactNode;
  chartKey: string;
  openKey: string | null;
  setOpenKey: (key: string | null) => void;
  defaultOpen?: boolean;
  containerClassName?: string;
  children: React.ReactNode;
}) {
  const isOpen = openKey === chartKey;

  const handleToggle = () => {
    if (isOpen) setOpenKey(null);
    else setOpenKey(chartKey);
  };

  return (
    <div
      className={`border border-gray-200 rounded-xl mb-3 overflow-hidden shadow-sm ${containerClassName}`}
    >
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between gap-3 p-3 bg-gray-50 hover:bg-gray-100 text-left sm:p-4"
      >
        <span className="font-semibold text-gray-800 text-sm sm:text-base">
          {title}
        </span>
        <span className="text-lg sm:text-xl">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="p-3 sm:p-4 bg-white overflow-x-auto">{children}</div>
      )}
    </div>
  );
}
