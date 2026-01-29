"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { apiUrl } from "@/app/utils/getUtils";
import { useAuth } from "@/app/context/authContext";
import { DefaultOptions, UserProfile } from "@/app/types/userProfile";

const DEFAULT_OPTIONS: DefaultOptions = {
  includeBonus: false,
  recentWindow: 20,
  clusterUnit: 5,
  similarityMode: "pattern",
  showAdvanced: false,
  rangeUnit: 7,
  rangeConditions: [],
  includeNumbers: [],
  excludeNumbers: [],
  oddCount: undefined,
  sum: undefined,
  minNumber: undefined,
  maxNumber: undefined,
  consecutiveMode: "any",
};

type ProfileContextValue = {
  profile: UserProfile | null;
  loadingProfile: boolean;
  profileError: string | null;
  refreshProfile: () => Promise<void>;
  saveDefaultOptions: (
    partial: Partial<DefaultOptions>,
  ) => Promise<{ ok: boolean; message?: string }>;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const loadedUserIdRef = useRef<string | null>(null);

  const fetchProfile = useCallback(
    async (signal?: AbortSignal) => {
      if (!user) return;
      setLoadingProfile(true);
      setProfileError(null);
      try {
        const res = await fetch(`${apiUrl}/auth/profile`, {
          credentials: "include",
          signal,
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.message || "프로필을 불러오지 못했습니다.");
        }
        setProfile(data.profile ?? null);
        loadedUserIdRef.current = user.id;
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        setProfileError(
          err instanceof Error
            ? err.message
            : "프로필을 불러오지 못했습니다.",
        );
      } finally {
        setLoadingProfile(false);
      }
    },
    [user],
  );

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setProfileError(null);
      setLoadingProfile(false);
      loadedUserIdRef.current = null;
      return;
    }

    if (loadedUserIdRef.current === user.id) return;

    const controller = new AbortController();
    fetchProfile(controller.signal);
    return () => controller.abort();
  }, [user, fetchProfile]);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const controller = new AbortController();
    await fetchProfile(controller.signal);
  }, [fetchProfile, user]);

  const saveDefaultOptions = useCallback(
    async (partial: Partial<DefaultOptions>) => {
      const base = profile?.defaultOptions ?? DEFAULT_OPTIONS;
      const next = {
        ...base,
        ...partial,
      };
      try {
        const res = await fetch(`${apiUrl}/auth/profile`, {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ defaultOptions: next }),
        });
        const data = await res.json();
        if (!res.ok) {
          return { ok: false, message: data?.message || "저장에 실패했습니다." };
        }
        setProfile(data.profile ?? null);
        return { ok: true };
      } catch (err: unknown) {
        return {
          ok: false,
          message:
            err instanceof Error ? err.message : "저장에 실패했습니다.",
        };
      }
    },
    [profile],
  );

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loadingProfile,
        profileError,
        refreshProfile,
        saveDefaultOptions,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error("useProfile must be used within ProfileProvider");
  }
  return ctx;
}
