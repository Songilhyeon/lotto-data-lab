"use client";

import { useAuth } from "@/app/context/authContext";

export default function useAuthGuard() {
  const { user, openLoginModal } = useAuth();

  return {
    user,
    // isAuthed: !!user,
    // sih 20260117 임시 수정-
    isAuthed: true,
    openLoginModal,
  };
}
