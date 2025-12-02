// components/Header.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/authContext";
import { Logo } from "./Footer";
import { FcGoogle } from "react-icons/fc";
import { SiNaver } from "react-icons/si";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const {
    user,
    setUser,
    openLoginModal,
    closeLoginModal,
    isLoginModalOpen,
    logout,
  } = useAuth();

  const oauthUrls = {
    google: process.env.NEXT_PUBLIC_GOOGLE_API_URI,
    naver: process.env.NEXT_PUBLIC_NAVER_API_URI,
    kakao: process.env.NEXT_PUBLIC_KAKAO_API_URI,
  };

  const navLinks = [
    { name: "홈", href: "/" },
    { name: "분석", href: "/analyze" },
    { name: "로또기록", href: "/lotto-history" },
    { name: "게시판", href: "/board" },
  ];

  const handleTestLogin = async () => {
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/auth/test-login",
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Test login failed");
      const data = await res.json();
      setUser(data.user);
      alert("테스트 로그인 완료! 1시간 PREMIUM 상태입니다.");
    } catch (err) {
      console.error(err);
      alert("테스트 로그인 실패");
    }
  };

  console.log(user);

  return (
    <>
      <header className="bg-white bg-opacity-95 backdrop-blur-sm shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Logo />
          {/* 데스크톱 네비 */}
          <nav className="hidden md:flex space-x-6 text-sm font-semibold text-gray-700 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative group px-2 py-1 transition-colors duration-200 ${
                  pathname === link.href
                    ? "text-blue-600"
                    : "hover:text-blue-600"
                }`}
              >
                {link.name}
                <span
                  className={`absolute left-0 -bottom-1 h-0.5 bg-blue-600 transition-all ${
                    pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </Link>
            ))}

            {user ? (
              <div className="flex items-center gap-3">
                <span
                  className={`font-bold ${
                    user.role === "PREMIUM" ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {user.role ?? "FREE"}
                </span>
                <span>{user.name}</span>
                <button
                  onClick={logout}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={openLoginModal}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                  로그인
                </button>
                <button
                  onClick={handleTestLogin}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  테스트 로그인
                </button>
              </>
            )}
          </nav>

          {/* 모바일 햄버거 */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              {isOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </header>

      {/* 모바일 메뉴 */}
      {isOpen && (
        <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-50 flex flex-col">
          <div className="flex justify-end p-4">
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>
          <nav className="flex flex-col mt-8 space-y-6 px-6 text-lg font-semibold">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {user ? (
              <>
                <span
                  className={`font-bold ${
                    user.role === "PREMIUM" ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {user.role ?? "FREE"}
                </span>
                <span>{user.name}</span>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() =>
                    (window.location.href = oauthUrls.google ?? "")
                  }
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Google
                </button>
                <button
                  onClick={() => (window.location.href = oauthUrls.naver ?? "")}
                  className="px-3 py-1 bg-green-500 text-white rounded"
                >
                  Naver
                </button>
                <button
                  onClick={() => (window.location.href = oauthUrls.kakao ?? "")}
                  className="px-3 py-1 bg-yellow-400 text-black rounded"
                >
                  Kakao
                </button>
                <button
                  onClick={handleTestLogin}
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  테스트 로그인
                </button>
              </>
            )}
          </nav>
        </div>
      )}

      {/* 모달 로그인 */}
      {isLoginModalOpen && !user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-80 flex flex-col gap-4">
            <h2 className="text-xl font-bold text-center">로그인</h2>

            {/* Google 로그인 버튼 */}
            <button
              onClick={() => (window.location.href = oauthUrls.google ?? "")}
              className="flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 px-4 py-2 rounded shadow"
            >
              <FcGoogle className="w-5 h-5" />
              <span>Google로 로그인</span>
            </button>

            {/* Naver 로그인 버튼 */}
            <button
              onClick={() => (window.location.href = oauthUrls.naver ?? "")}
              className="flex items-center justify-center gap-2 bg-[#03C75A] hover:bg-[#02b14b] text-white px-4 py-2 rounded shadow"
            >
              <SiNaver className="w-5 h-5" />
              <span>Naver로 로그인</span>
            </button>

            {/* 취소 버튼 */}
            <button
              onClick={closeLoginModal}
              className="mt-4 px-4 py-2 border rounded hover:bg-gray-100"
            >
              취소
            </button>
          </div>
        </div>
      )}
    </>
  );
}
