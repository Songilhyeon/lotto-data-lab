"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "@/app/context/authContext";
import { useProfile } from "@/app/context/profileContext";
import { apiUrl } from "@/app/utils/getUtils";

type PickNumberContextType = {
  picked: number[];
  toggleNumber: (n: number) => void;
  resetPicked: () => void;
  savePicked: () => Promise<void>;
  hasUnsavedChanges: boolean;

  isOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
};

const PickNumberContext = createContext<PickNumberContextType>({
  picked: [],
  toggleNumber: () => {},
  resetPicked: () => {},
  savePicked: async () => {},
  hasUnsavedChanges: false,
  isOpen: false,
  openPanel: () => {},
  closePanel: () => {},
});

export const maxSelect = 45;
function arraysEqual(a: number[], b: number[]) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function scheduleSetPicked(next: number[], setPicked: (v: number[]) => void) {
  if (typeof queueMicrotask === "function") {
    queueMicrotask(() => setPicked(next));
  } else {
    setTimeout(() => setPicked(next), 0);
  }
}

const LOCAL_STORAGE_KEY = "lotto_pick_numbers_v1";

export function PickNumberProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const { profile } = useProfile();
  const isAuthed = !!user;
  const skipNextSyncRef = useRef(false);
  const dirtyRef = useRef(false);
  const pickedRef = useRef<number[]>([]);
  const savingRef = useRef(false);

  const [picked, setPicked] = useState<number[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const readLocal = () => {
      if (typeof window === "undefined") return [] as number[];
      try {
        const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed.filter((n) => typeof n === "number");
      } catch {
        return [];
      }
    };

    if (!isAuthed) {
      const local = readLocal();
      scheduleSetPicked(local, setPicked);
      pickedRef.current = [];
      dirtyRef.current = false;
      setHasUnsavedChanges(false);
      return;
    }
    if (!profile) return;
    if (dirtyRef.current) return;

    const local = readLocal();
    const server = Array.isArray(profile.memoNumbers)
      ? profile.memoNumbers.filter((n) => typeof n === "number")
      : [];

    if (server.length === 0 && local.length > 0) {
      scheduleSetPicked(local, setPicked);
      pickedRef.current = [];
      dirtyRef.current = false;
      setHasUnsavedChanges(true);
      return;
    }

    if (!arraysEqual(server, pickedRef.current)) {
      skipNextSyncRef.current = true;
      scheduleSetPicked(server, setPicked);
    }
    setHasUnsavedChanges(false);
  }, [isAuthed, profile]);

  useEffect(() => {
    pickedRef.current = picked;
  }, [picked]);

  useEffect(() => {
    if (skipNextSyncRef.current) {
      skipNextSyncRef.current = false;
    }
  }, [picked]);

  const toggleNumber = (n: number) => {
    dirtyRef.current = true;
    setPicked((prev) => {
      if (prev.includes(n)) return prev.filter((v) => v !== n);
      if (prev.length >= maxSelect) return prev;
      return [...prev, n].sort((a, b) => a - b);
    });
    setHasUnsavedChanges(true);
  };

  const resetPicked = () => {
    dirtyRef.current = true;
    setPicked([]);
    setHasUnsavedChanges(true);
  };

  const savePicked = async () => {
    if (savingRef.current) return;
    if (!hasUnsavedChanges) return;
    savingRef.current = true;
    try {
      if (isAuthed) {
        await fetch(`${apiUrl}/auth/profile`, {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ memoNumbers: picked }),
        });
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
      } else if (typeof window !== "undefined") {
        window.localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify(picked),
        );
      }
      dirtyRef.current = false;
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error(err);
    } finally {
      savingRef.current = false;
    }
  };

  const openPanel = () => setIsOpen(true);
  const closePanel = () => setIsOpen(false);

  return (
    <PickNumberContext.Provider
      value={{
        picked,
        toggleNumber,
        resetPicked,
        savePicked,
        hasUnsavedChanges,
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
