"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/authContext";
import { Logo } from "./Footer";
import { FcGoogle } from "react-icons/fc";
import { SiNaver } from "react-icons/si";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, openLoginModal, closeLoginModal, isLoginModalOpen, logout } =
    useAuth();

  const oauthUrls = {
    google: process.env.NEXT_PUBLIC_GOOGLE_API_URI,
    naver: process.env.NEXT_PUBLIC_NAVER_API_URI,
    kakao: process.env.NEXT_PUBLIC_KAKAO_API_URI,
  };

  const navLinks = [
    { name: "홈", href: "/" },
    { name: "분석", href: "/analyze" },
    { name: "AI 점수 분석", href: "/ai-recommend" },
    { name: "1,2등 판매점", href: "/winner-stores" },
    { name: "게시판", href: "/board" },
    { name: "로또기록", href: "/lotto-history" },
  ];

  return (
    <>
      {/* HEADER */}
      <header className="bg-white/90 backdrop-blur-md shadow-md sticky top-0 z-50 border-b border-gray-100 h-16 flex items-center">
        <div className="max-w-6xl mx-auto px-6 w-full flex items-center justify-between">
          <Logo />

          {/* 데스크탑 메뉴 */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative px-3 py-2 transition-all ${
                    isActive
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute left-0 -bottom-1 h-0.5 bg-blue-600 transition-all ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}

            {/* 로그인/로그아웃 */}
            {user ? (
              <div className="flex items-center gap-3 ml-4">
                <span
                  className={`px-2 py-1 text-xs rounded-full font-bold ${
                    user.role === "PREMIUM"
                      ? "bg-amber-500 text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {user.role}
                </span>

                <span className="text-gray-700 truncate max-w-[100px]">
                  {user.name}
                </span>

                <button
                  onClick={logout}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <button
                onClick={openLoginModal}
                className="ml-4 px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                로그인
              </button>
            )}
          </nav>

          {/* mobile hamburger */}
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden p-2 text-gray-700 hover:bg-gray-200 rounded-md transition"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* 모바일 메뉴 */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex">
          <div className="w-[80vw] max-w-xs h-full bg-white shadow-xl p-6 flex flex-col">
            <div className="flex justify-between items-center">
              <Logo />
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:bg-gray-200 p-1 rounded"
              >
                <X className="w-6 h-6" />
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
                </Link>
              ))}

              <div className="pt-6 border-t">
                {user ? (
                  <>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-bold ${
                          user.role === "PREMIUM"
                            ? "bg-amber-500 text-white"
                            : "bg-gray-300 text-gray-700"
                        }`}
                      >
                        {user.role}
                      </span>
                      <span className="text-gray-700">{user.name}</span>
                    </div>

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
                      className="mt-3 w-full px-4 py-2 bg-[#03C75A] text-white rounded shadow flex items-center justify-center gap-2"
                    >
                      <SiNaver className="w-5 h-5" /> Naver 로그인
                    </button>
                  </>
                )}
              </div>
            </nav>
          </div>

          {/* side click close */}
          <div className="flex-1" onClick={() => setIsOpen(false)} />
        </div>
      )}

      {/* 로그인 모달 */}
      {isLoginModalOpen && !user && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-80 shadow-2xl">
            <h2 className="text-xl font-bold text-center mb-4">로그인</h2>

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
