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
  children,
}: {
  title: React.ReactNode;
  chartKey: string;
  openKey: string | null;
  setOpenKey: (key: string | null) => void;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const isOpen = openKey === chartKey;

  const handleToggle = () => {
    if (isOpen) setOpenKey(null);
    else setOpenKey(chartKey);
  };

  return (
    <div className="border border-gray-200 rounded-xl mb-3 overflow-hidden shadow-sm">
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 text-left"
      >
        <span className="font-semibold text-gray-800">{title}</span>
        <span className="text-lg">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && <div className="p-3 bg-white">{children}</div>}
    </div>
  );
}
