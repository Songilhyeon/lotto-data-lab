"use client";

import { useAuth } from "@/app/context/authContext";

export default function useAuthGuard() {
  const { user, openLoginModal } = useAuth();

  return {
    user,
    isAuthed: !!user,
    // sih 20260117 임시 수정, 로그인 기능 없이 모든 기능 사용가능
    // isAuthed: true,
    openLoginModal,
  };
}
