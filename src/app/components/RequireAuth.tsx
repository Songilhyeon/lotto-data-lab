"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import useAuthGuard from "@/app/hooks/useAuthGuard";
import { isPremiumRole } from "@/app/context/authContext";

interface RequireAuthProps {
  children: ReactNode;
  fallback?: ReactNode;
  requirePremium?: boolean;
}

export default function RequireAuth({
  children,
  fallback,
  requirePremium = false,
}: RequireAuthProps) {
  const router = useRouter();
  const { isAuthed, openLoginModal, user } = useAuthGuard();
  const goPremium = () => router.push("/premium");

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
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                className="px-4 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                onClick={openLoginModal}
              >
                로그인하기
              </button>
              {/* sih 20260129 임시주석  */}
              {/* <button
                className="px-4 py-3 rounded-md border border-amber-300 text-amber-700 hover:bg-amber-50 transition"
                onClick={goPremium}
              >
                프리미엄 안내
              </button> */}
            </div>
          </div>
        </div>
      )
    );
  }

  if (requirePremium && !isPremiumRole(user?.role)) {
    return (
      fallback ?? (
        <div className="w-full flex justify-center mt-10 px-4">
          <div className="bg-white shadow-md rounded-xl px-4 py-5 text-center sm:px-6 sm:py-6">
            <p className="text-lg font-semibold text-gray-700 mb-2">
              프리미엄 전용 기능이에요 🔒
            </p>
            <p className="text-gray-500 text-sm">
              내 전략이 실제로 맞았는지 확인하는 분석 도구입니다.
            </p>
            <p className="mt-1 text-xs text-amber-700">
              결제 없이 무료로 시작할 수 있어요.
            </p>
            <button
              className="m-4 px-4 py-4 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
              onClick={goPremium}
            >
              프리미엄 안내로 이동
            </button>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}
