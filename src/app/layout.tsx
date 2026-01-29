import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { AuthProvider } from "@/app/context/authContext";
import { ProfileProvider } from "@/app/context/profileContext";
import Script from "next/script";
import { PageViewProvider } from "@/app/PageViewProvider";
import { PickNumberProvider } from "@/app/context/pickNumberContext";
import FloatingPickButton from "@/app/components/help/FloatingPickButton";
import FloatingHelpButton from "@/app/components/help/FloatingHelpButton";
import OnboardingModal from "@/app/components/help/OnboardingModal";
import FloatingMemoButton from "@/app/components/help/FloatingMemoButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://app.nexlab.ai.kr"),

  title: {
    default: "로또 번호 분석·통계 | 회차별 당첨 데이터 & 판매점 분석",
    template: "%s | 로또 데이터 분석",
  },

  description:
    "로또 당첨 번호를 회차별로 분석하고, 번호 패턴·간격·통계와 1·2등 당첨 판매점 정보를 제공합니다. AI 기반 로또 번호 분석 서비스.",

  keywords: [
    "로또 번호 분석",
    "로또 당첨 번호",
    "로또 회차 분석",
    "로또 판매점",
    "로또 통계",
    "로또 패턴 분석",
    "AI 로또",
    "로또 데이터",
    "로또 1등 판매점",
    "로또 2등 판매점",
  ],

  openGraph: {
    title: "로또 번호 분석·통계 | 회차별 당첨 데이터 & 판매점 분석",
    description:
      "로또 당첨 번호를 회차별로 분석하고, 번호 패턴·간격·통계와 1·2등 당첨 판매점 정보를 제공합니다.",
    url: "https://app.nexlab.ai.kr",
    siteName: "로또 데이터 분석",
    type: "website",
    locale: "ko_KR",
  },

  twitter: {
    card: "summary_large_image",
    title: "로또 번호 분석·통계 | 회차별 당첨 데이터",
    description:
      "로또 당첨 번호 통계, 회차 분석, 판매점 데이터를 한눈에 확인하세요.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const isProd = process.env.NODE_ENV === "production";
  return (
    <html lang="ko">
      <head>
        {/* Google Analytics (prod + GA_ID 있을 때만) */}
        {isProd && gaId && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', { anonymize_ip: true });
              `}
            </Script>
          </>
        )}

        {/* 구글 서치 콘솔 메타 태그 */}
        <meta
          name="google-site-verification"
          content={process.env.NEXT_PUBLIC_GSC_CODE}
        />

        <meta
          name="naver-site-verification"
          content={process.env.NEXT_PUBLIC_NSC_CODE}
        />

        {/* Open Graph, Twitter Card 등은 metadata로 자동 처리됨 */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ProfileProvider>
            <Suspense fallback={null}>
              <PageViewProvider>
                <Header />
                <PickNumberProvider>
                  <main>{children}</main>
                  <OnboardingModal />
                  <FloatingPickButton />
                  <FloatingMemoButton />
                  <FloatingHelpButton />
                </PickNumberProvider>
                <Footer />
              </PageViewProvider>
            </Suspense>
          </ProfileProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
