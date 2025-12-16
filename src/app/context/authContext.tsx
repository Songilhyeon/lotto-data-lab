"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { apiUrl } from "@/app/utils/getUtils";

export interface User {
  id: string;
  name: string;
  email?: string;
  role?: "FREE" | "PREMIUM";
  subscriptionExpiresAt?: string | Date;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  refreshUser: () => Promise<void>;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  isLoginModalOpen: boolean;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const fetchUser = async () => {
    const res = await fetch(apiUrl + "/auth/me", {
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      return data.user ?? null;
    }
    return null;
  };
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const user = await fetchUser();
        if (mounted) setUser(user);
      } catch (err) {
        console.error(err);
        if (mounted) setUser(null);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const refreshUser = async () => {
    const user = await fetchUser();
    setUser(user);
  };

  const logout = async () => {
    try {
      await fetch(apiUrl + "/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      setIsLoginModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        refreshUser,
        openLoginModal,
        closeLoginModal,
        isLoginModalOpen,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("useAuth must be used within AuthProvider");
  return auth;
};
