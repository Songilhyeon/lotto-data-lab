// app/context/authContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// ---------------------------
// User 타입
// ---------------------------
export interface User {
  id: string;
  name: string;
  email?: string;
  role?: "FREE" | "PREMIUM";
  subscriptionExpiresAt?: string | Date;
}

// ---------------------------
// Context 타입
// ---------------------------
interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  isLoginModalOpen: boolean;
  logout: () => Promise<void>;
}

// ---------------------------
// Context 생성
// ---------------------------
export const AuthContext = createContext<AuthContextType | null>(null);

// ---------------------------
// Provider Props
// ---------------------------
interface AuthProviderProps {
  children: ReactNode;
}

// ---------------------------
// Provider 구현
// ---------------------------
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const logout = async () => {
    try {
      await fetch(process.env.NEXT_PUBLIC_API_URL + "/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/auth/me", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user ?? null);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error(err);
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
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

// ---------------------------
// 커스텀 훅
// ---------------------------
export const useAuth = () => {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("useAuth must be used within AuthProvider");
  return auth;
};
