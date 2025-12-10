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
    { name: "AI 점수 분석", href: "/ai-recommend" },
    { name: "게시판", href: "/board" },
    { name: "로또기록", href: "/lotto-history" },
    // { name: "프리미엄구독", href: "/premium", premium: true },
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

  return (
    <>
      <header className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Logo />

          {/* 데스크톱 메뉴 */}
          <nav className="hidden md:flex space-x-6 text-sm font-medium items-center">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              // ✅ 프리미엄 유저라면 프리미엄 메뉴 숨김
              // if (link.premium && user?.role === "PREMIUM") return null;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-2 transition-all ${
                    isActive
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span>{link.name}</span>

                    {/* PREMIUM Badge */}
                    {/* {link.premium && (
                      <span className=" px-1.5 py-0.5 rounded bg-amber-500 text-white font-bold shadow-sm">
                        프리미엄구독
                      </span>
                    )} */}
                  </div>

                  {/* underline */}
                  <span
                    className={`absolute left-0 -bottom-1 h-0.5 bg-blue-600 transition-all ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}

            {/* 로그인 영역 */}
            {user ? (
              <div className="flex items-center gap-3 ml-4">
                <span
                  className={`px-2 py-1 text-xs rounded-full font-bold ${
                    user.role === "PREMIUM"
                      ? "bg-amber-500 text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {user.role ?? "FREE"}
                </span>

                <span className="text-gray-700">{user.name}</span>

                <button
                  onClick={logout}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-4">
                <button
                  onClick={openLoginModal}
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  로그인
                </button>
              </div>
            )}
          </nav>

          {/* 모바일 햄버거 */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(true)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-200 transition"
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      {/* 모바일 전체 메뉴 패널 */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 backdrop-blur-sm flex">
          <div className="w-72 h-full bg-white shadow-2xl p-6 flex flex-col">
            <div className="flex justify-between items-center">
              <Logo />
              <button
                onClick={() => setIsOpen(false)}
                className="text-xl font-bold text-gray-600"
              >
                ✕
              </button>
            </div>

            <nav className="flex flex-col mt-10 space-y-6 text-lg font-semibold">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between"
                >
                  {link.name}

                  {/* {link.premium && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500 text-white font-bold shadow-sm">
                      PREMIUM
                    </span>
                  )} */}
                </Link>
              ))}

              {/* 로그인 + 로그아웃 */}
              <div className="pt-6 border-t">
                {user ? (
                  <>
                    <span
                      className={`text-sm px-2 py-1 rounded-full font-bold ${
                        user.role === "PREMIUM"
                          ? "bg-amber-500 text-white"
                          : "bg-gray-300 text-gray-700"
                      }`}
                    >
                      {user.role}
                    </span>
                    <span className="ml-2">{user.name}</span>

                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="mt-4 w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
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
                      className="w-full px-4 py-2 bg-white border border-gray-300 flex items-center justify-center gap-2 rounded shadow"
                    >
                      <FcGoogle className="w-5 h-5" /> Google 로그인
                    </button>

                    <button
                      onClick={() =>
                        (window.location.href = oauthUrls.naver ?? "")
                      }
                      className="w-full mt-3 px-4 py-2 bg-[#03C75A] text-white flex items-center justify-center gap-2 rounded shadow"
                    >
                      <SiNaver className="w-5 h-5" /> Naver 로그인
                    </button>
                  </>
                )}
              </div>
            </nav>
          </div>

          {/* 빈 공간 클릭 → 닫기 */}
          <div className="flex-1" onClick={() => setIsOpen(false)} />
        </div>
      )}

      {/* 로그인 모달 */}
      {isLoginModalOpen && !user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-80 shadow-2xl">
            <h2 className="text-xl font-bold text-center mb-4">로그인</h2>

            {/* Google 로그인 */}
            <button
              onClick={() => {
                const redirectUrl = encodeURIComponent(window.location.origin);
                window.location.href = `${oauthUrls.google}?state=${redirectUrl}`;
              }}
              className="flex items-center justify-center gap-2 w-full bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 px-4 py-2 rounded shadow"
            >
              <FcGoogle className="w-5 h-5" />
              Google로 로그인
            </button>

            {/* Naver 로그인 */}
            <button
              onClick={() => {
                const redirectUrl = encodeURIComponent(window.location.origin);
                window.location.href = `${oauthUrls.naver}?state=${redirectUrl}`;
              }}
              className="flex items-center justify-center gap-2 w-full bg-[#03C75A] border border-[#03C75A] hover:bg-[#02b14b] text-white px-4 py-2 rounded shadow mt-3"
            >
              <SiNaver className="w-5 h-5" />
              Naver로 로그인
            </button>

            {/* 취소 버튼 */}
            <button
              onClick={closeLoginModal}
              className="mt-5 w-full px-4 py-2 border rounded hover:bg-gray-100"
            >
              취소
            </button>
          </div>
        </div>
      )}
    </>
  );
}
