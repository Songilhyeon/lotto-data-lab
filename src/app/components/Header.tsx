"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/authContext";
import { Logo } from "./Footer";
import { FcGoogle } from "react-icons/fc";
import { SiNaver } from "react-icons/si";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/** ✅ 인앱 브라우저(WebView) 감지 */
function isInAppBrowser() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent.toLowerCase();

  // 자주 문제되는 인앱브라우저들 (필요하면 추가)
  return (
    ua.includes("naver") || // Naver
    ua.includes("kakaotalk") || // KakaoTalk
    ua.includes("instagram") || // Instagram
    ua.includes("fbav") ||
    ua.includes("fban") || // Facebook
    ua.includes("line") // LINE
  );
}

/** ✅ 외부 브라우저로 열기 (웹에서 가능한 “최선의” 방식)
 *  - 인앱 브라우저는 완전 강제 불가라, 새 창으로 띄우고
 *    사용자가 “기본 브라우저로 열기”를 선택하게 유도하는 게 현실적
 */
function openInExternalBrowser(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showInAppGuide, setShowInAppGuide] = useState(false);
  const [copied, setCopied] = useState(false);

  const pathname = usePathname();
  const { user, openLoginModal, closeLoginModal, isLoginModalOpen, logout } =
    useAuth();

  const oauthUrls = {
    google: process.env.NEXT_PUBLIC_GOOGLE_API_URI,
    naver: process.env.NEXT_PUBLIC_NAVER_API_URI,
  };

  const currentUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }, []);

  const navLinks = [
    { name: "홈", href: "/" },
    { name: "분석", href: "/analyze" },
    { name: "AI 점수 분석", href: "/ai-recommend" },
    { name: "1,2등 판매점", href: "/winner-stores" },
    { name: "로또기록", href: "/lotto-history" },
    { name: "게시판", href: "/board" },
  ];

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // clipboard 실패 시 fallback
      try {
        const ta = document.createElement("textarea");
        ta.value = currentUrl;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      } catch {}
    }
  }, [currentUrl]);

  /** ✅ OAuth 이동 공통 핸들러
   *  - Google은 인앱 브라우저에서 disallowed_useragent로 막힘 → 가이드 띄움
   */
  const goOAuth = useCallback(
    (provider: "google" | "naver") => {
      const url = oauthUrls[provider];
      if (!url) return;

      // ✅ 구글만 인앱에서 차단되는 케이스가 가장 많음
      if (provider === "google" && typeof window !== "undefined") {
        if (isInAppBrowser()) {
          setShowInAppGuide(true);
          return;
        }
      }

      window.location.href = url;
    },
    [oauthUrls]
  );

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
                  className={`relative px-2 py-1 transition ${
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

            {/* Auth */}
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
                      className={`relative flex items-center px-4 py-3 rounded-lg transition ${
                        isActive
                          ? "bg-blue-50 text-blue-600 font-bold"
                          : "text-gray-800 hover:bg-gray-100"
                      }`}
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
                      onClick={() => goOAuth("google")}
                      className="w-full py-2 border rounded flex items-center justify-center gap-2"
                    >
                      <FcGoogle /> Google 로그인
                    </button>

                    <button
                      onClick={() => goOAuth("naver")}
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
              onClick={() => goOAuth("google")}
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
              onClick={() => goOAuth("naver")}
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

      {/* ✅ IN-APP BROWSER GUIDE MODAL (Google 로그인 차단 대응) */}
      {showInAppGuide && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center px-4">
          <div className="w-full max-w-sm bg-white rounded-xl p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-center mb-3">
              구글 로그인 안내
            </h2>

            <p className="text-sm text-gray-700 leading-relaxed">
              지금은 <b>네이버 앱(인앱 브라우저)</b>에서 열려 있어서, 구글
              정책상 로그인 화면이 <b>차단(disallowed_useragent)</b>됩니다.
              <br />
              <br />
              아래 버튼으로 <b>외부 브라우저(Chrome/Safari)</b>에서 이 페이지를
              열고, 그곳에서 다시 구글 로그인을 진행해주세요.
            </p>

            <div className="mt-5 space-y-2">
              <button
                onClick={() => openInExternalBrowser(currentUrl)}
                className="w-full py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                외부 브라우저로 열기
              </button>

              <button
                onClick={copyLink}
                className="w-full py-2 border rounded hover:bg-gray-50 transition"
              >
                {copied ? "링크 복사됨!" : "현재 페이지 링크 복사"}
              </button>

              <button
                onClick={() => setShowInAppGuide(false)}
                className="w-full py-2 border rounded hover:bg-gray-50 transition"
              >
                닫기
              </button>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              팁) 외부 브라우저로 열린 뒤에도 인앱처럼 보이면, 공유/메뉴에서
              “기본 브라우저로 열기”를 선택해주세요.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
