"use client";

import { createContext, useContext, useEffect, useState } from "react";

type PickNumberContextType = {
  picked: number[];
  toggleNumber: (n: number) => void;
  resetPicked: () => void;

  isOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
};

const PickNumberContext = createContext<PickNumberContextType>({
  picked: [],
  toggleNumber: () => {},
  resetPicked: () => {},
  isOpen: false,
  openPanel: () => {},
  closePanel: () => {},
});

export const maxSelect = 45;
const STORAGE_KEY = "lotto_pick_numbers_v1";

/* ----------------------------------
 * localStorage 안전 로더
 * ---------------------------------- */
function loadInitialPicked(): number[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((n) => typeof n === "number");
  } catch {
    return [];
  }
}

export function PickNumberProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  /* ✅ lazy initializer */
  const [picked, setPicked] = useState<number[]>(loadInitialPicked);
  const [isOpen, setIsOpen] = useState(false);

  /* ----------------------------------
   * picked 변경 시 자동 저장
   * ---------------------------------- */
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(picked));
    } catch {}
  }, [picked]);

  const toggleNumber = (n: number) => {
    setPicked((prev) => {
      if (prev.includes(n)) return prev.filter((v) => v !== n);
      if (prev.length >= maxSelect) return prev;
      return [...prev, n].sort((a, b) => a - b);
    });
  };

  const resetPicked = () => {
    setPicked([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const openPanel = () => setIsOpen(true);
  const closePanel = () => setIsOpen(false);

  return (
    <PickNumberContext.Provider
      value={{
        picked,
        toggleNumber,
        resetPicked,
        isOpen,
        openPanel,
        closePanel,
      }}
    >
      {children}
    </PickNumberContext.Provider>
  );
}

export const usePickNumber = () => useContext(PickNumberContext);
