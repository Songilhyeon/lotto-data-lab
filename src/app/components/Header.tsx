"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Logo from "./Logo";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const toggleMenu = () => setIsOpen(!isOpen);

  const {
    user,
    loading,
    logout,
    openLoginModal,
    isLoginModalOpen,
    closeLoginModal,
  } = useAuth();

  const oauthUrls = {
    google: "http://localhost:4000/api/auth/google",
    naver: "http://localhost:4000/api/auth/naver",
    kakao: "http://localhost:4000/api/auth/kakao",
  };

  const navLinks = [
    { name: "홈", href: "/" },
    { name: "분석", href: "/analyze" },
    { name: "히스토리", href: "/lotto-history" },
    { name: "대시보드", href: "/dashboard" },
  ];

  return (
    <>
      <header className="bg-white bg-opacity-95 backdrop-blur-sm shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Logo />

          {/* 데스크톱 네비 */}
          <nav className="hidden md:flex space-x-8 text-sm font-semibold text-gray-700">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative group px-2 py-1 transition-colors duration-200 ${
                    isActive ? "text-blue-600" : "hover:text-blue-600"
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute left-0 -bottom-1 h-0.5 bg-blue-600 transition-all ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </Link>
              );
            })}

            {!loading && user ? (
              <button
                onClick={logout}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                로그아웃
              </button>
            ) : (
              <button
                onClick={openLoginModal}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
              >
                로그인
              </button>
            )}
          </nav>

          {/* 모바일 햄버거 */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              {isOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </header>

      {/* 모바일 메뉴 */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={toggleMenu}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>
        <nav className="flex flex-col mt-8 space-y-6 px-6 text-lg font-semibold text-gray-700">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          {!loading && user ? (
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              로그아웃
            </button>
          ) : (
            <button
              onClick={() => {
                openLoginModal();
                setIsOpen(false);
              }}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              로그인
            </button>
          )}
        </nav>
      </div>

      {/* 모달형 로그인 */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-80 flex flex-col gap-4">
            <h2 className="text-xl font-bold text-center">로그인</h2>
            <button
              onClick={() => (window.location.href = oauthUrls.google)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Google
            </button>
            <button
              onClick={() => (window.location.href = oauthUrls.naver)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              Naver
            </button>
            <button
              onClick={() => (window.location.href = oauthUrls.kakao)}
              className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 transition"
            >
              Kakao
            </button>
            <button
              onClick={closeLoginModal}
              className="mt-4 px-4 py-2 rounded border hover:bg-gray-100 transition"
            >
              취소
            </button>
          </div>
        </div>
      )}
    </>
  );
}
