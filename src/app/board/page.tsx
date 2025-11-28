"use client";
import { useAuth } from "@/app/context/authContext";

export default function BoardPage() {
  const { user, openLoginModal } = useAuth();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">나중에 추가 할 페이지</h1>

      {user ? (
        <p>{user.name}님 환영합니다!</p>
      ) : (
        <button
          onClick={openLoginModal}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          로그인하기
        </button>
      )}
    </main>
  );
}
