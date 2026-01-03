"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/authContext";
import { Logo } from "./Footer";
import { FcGoogle } from "react-icons/fc";
import { SiNaver } from "react-icons/si";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, openLoginModal, closeLoginModal, isLoginModalOpen, logout } =
    useAuth();

  const oauthUrls = {
    google: process.env.NEXT_PUBLIC_GOOGLE_API_URI,
    naver: process.env.NEXT_PUBLIC_NAVER_API_URI,
  };

  const redirectPath = useMemo(() => {
    if (typeof window === "undefined") return "";
    return encodeURIComponent(window.location.origin);
  }, []);

  const navLinks = [
    { name: "홈", href: "/" },
    { name: "분석", href: "/analyze" },
    { name: "AI 점수 분석", href: "/ai-recommend" },
    { name: "1,2등 판매점", href: "/winner-stores" },
    { name: "로또기록", href: "/lotto-history" },
    { name: "게시판", href: "/board" },
  ];

  return (
    <>
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="h-14 md:h-16 max-w-6xl mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="cursor-pointer">
              <Logo />
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-2 py-1 transition
                    ${
                      isActive
                        ? "text-blue-600 font-semibold"
                        : "text-gray-700 hover:text-blue-600"
                    }
                  `}
                >
                  {link.name}
                  <span
                    className={`absolute left-0 -bottom-1 h-0.5 bg-blue-600 transition-all
                      ${isActive ? "w-full" : "w-0 group-hover:w-full"}
                    `}
                  />
                </Link>
              );
            })}

            {/* Auth */}
            {user ? (
              <div className="flex items-center gap-3 ml-4">
                <span
                  className={`px-2 py-1 text-xs rounded-full font-bold
                    ${
                      user.role === "PREMIUM"
                        ? "bg-amber-500 text-white"
                        : "bg-gray-300 text-gray-700"
                    }
                  `}
                >
                  {user.role}
                </span>
                <span className="text-gray-700 max-w-[100px] truncate">
                  {user.name}
                </span>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <button
                onClick={openLoginModal}
                className="ml-4 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                로그인
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 active:bg-gray-200"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="w-[80vw] max-w-xs bg-white h-full shadow-xl p-5 flex flex-col"
            >
              {/* Top */}
              <div className="flex items-center justify-between">
                <Logo />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded hover:bg-gray-100 active:bg-gray-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Nav */}
              <nav className="mt-10 flex flex-col gap-2 text-base font-semibold">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`
          relative flex items-center
          px-4 py-3 rounded-lg
          transition
          ${
            isActive
              ? "bg-blue-50 text-blue-600 font-bold"
              : "text-gray-800 hover:bg-gray-100"
          }
        `}
                    >
                      {/* 왼쪽 Active Bar */}
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-blue-600" />
                      )}

                      <span className="ml-2">{link.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Auth Area */}
              <div className="mt-auto pt-6 border-t">
                {user ? (
                  <>
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-bold ${
                          user.role === "PREMIUM"
                            ? "bg-amber-500 text-white"
                            : "bg-gray-300 text-gray-700"
                        }`}
                      >
                        {user.role}
                      </span>
                      <span className="text-gray-700 truncate">
                        {user.name}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="w-full py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
                    >
                      로그아웃
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() =>
                        // (window.location.href = `${oauthUrls.google}?state=${redirectPath}`)
                        (window.location.href = `${oauthUrls.google}`)
                      }
                      className="w-full py-2 border rounded flex items-center justify-center gap-2"
                    >
                      <FcGoogle /> Google 로그인
                    </button>

                    <button
                      onClick={() =>
                        // (window.location.href = `${oauthUrls.naver}?state=${redirectPath}`)
                        (window.location.href = `${oauthUrls.naver}`)
                      }
                      className="mt-3 w-full py-2 rounded bg-[#03C75A] text-white flex items-center justify-center gap-2"
                    >
                      <SiNaver /> Naver 로그인
                    </button>
                  </>
                )}
              </div>
            </motion.div>

            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="flex-1 bg-black"
              onClick={() => setIsOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* LOGIN MODAL */}
      {isLoginModalOpen && !user && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="w-full max-w-sm bg-white rounded-xl p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-center mb-5">로그인</h2>

            {/* Google */}
            <button
              onClick={() =>
                // (window.location.href = `${oauthUrls.google}?state=${redirectPath}`)
                (window.location.href = `${oauthUrls.google}`)
              }
              className="
          w-full py-2 border rounded
          flex items-center justify-center gap-2
          transition
          hover:bg-gray-200
          active:bg-gray-400
          active:scale-[0.98]
          focus:outline-none focus:ring-2 focus:ring-gray-300
        "
            >
              <FcGoogle /> Google로 로그인
            </button>

            {/* Naver */}
            <button
              onClick={() =>
                // (window.location.href = `${oauthUrls.naver}?state=${redirectPath}`)
                (window.location.href = `${oauthUrls.naver}`)
              }
              className="
          mt-3 w-full py-2 rounded
          bg-[#03C75A] text-white
          flex items-center justify-center gap-2
          transition
          hover:bg-[#02b150]
          active:bg-[#029a46]
          active:scale-[0.98]
          focus:outline-none focus:ring-2 focus:ring-[#03C75A]/50
        "
            >
              <SiNaver /> Naver로 로그인
            </button>

            {/* Cancel */}
            <button
              onClick={closeLoginModal}
              className="
          mt-5 w-full py-2 border rounded
          transition
          hover:bg-gray-200
          active:bg-gray-400
          active:scale-[0.98]
          focus:outline-none focus:ring-2 focus:ring-gray-300
        "
            >
              취소
            </button>
          </div>
        </div>
      )}
    </>
  );
}
