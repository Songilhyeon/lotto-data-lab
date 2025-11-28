"use client";

import { useContext } from "react";
import { AuthContext } from "@/app/context/authContext";

export default function TestLoginButton() {
  const auth = useContext(AuthContext);
  if (!auth) return null; // Context 없으면 렌더링 안함
  const { setUser } = auth;

  const handleTestLogin = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/auth/test-login", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user); // 바로 상태 업데이트
        alert("테스트 로그인 성공! 1시간 PREMIUM 상태입니다.");
      } else {
        alert("테스트 로그인 실패");
      }
    } catch (err) {
      console.error(err);
      alert("서버 오류");
    }
  };

  return (
    <button
      onClick={handleTestLogin}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      테스트 로그인 (1시간 PREMIUM)
    </button>
  );
}
