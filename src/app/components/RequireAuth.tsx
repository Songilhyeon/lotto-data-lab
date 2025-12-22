"use client";

import { ReactNode } from "react";
import useAuthGuard from "@/app/hooks/useAuthGuard";

interface RequireAuthProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function RequireAuth({ children, fallback }: RequireAuthProps) {
  const { isAuthed, openLoginModal } = useAuthGuard();

  if (!isAuthed) {
    return (
      fallback ?? (
        <div className="w-full flex justify-center mt-10 px-4">
          <div className="bg-white shadow-md rounded-xl px-4 py-5 text-center sm:px-6 sm:py-6">
            <p className="text-lg font-semibold text-gray-700 mb-2">
              로그인이 필요해요 😊
            </p>
            <p className="text-gray-500 text-sm">
              이 기능은 로그인 사용자만 이용할 수 있어요. 로그인 후 다시
              이용해주세요!
            </p>
            <button
              className="m-4 px-4 py-4 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
              onClick={openLoginModal}
            >
              로그인하기
            </button>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}
