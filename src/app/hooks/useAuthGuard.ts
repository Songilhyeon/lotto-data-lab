"use client";

import { useAuth } from "@/app/context/authContext";

export default function useAuthGuard() {
  const { user, openLoginModal } = useAuth();

  return {
    user,
    // isAuthed: !!user,
    isAuthed: true,
    openLoginModal,
  };
}
