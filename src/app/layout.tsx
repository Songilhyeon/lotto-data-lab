import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { AuthProvider } from "@/app/context/authContext";
import Script from "next/script";
import { PageViewProvider } from "@/app/PageViewProvider";

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
    default: "로또 번호 분석·통계 | AI Lotto Data Lab",
    template: "%s | Lotto Data Lab",
  },
  description:
    "로또 당첨 번호 통계, 1·2등 당첨 판매점 분석, AI 기반 로또 번호 분석까지 제공하는 데이터 기반 로또 분석 서비스입니다.",
  openGraph: {
    title: "로또 번호 분석·통계 | AI Lotto Data Lab",
    description:
      "로또 당첨 번호 통계, 1·2등 당첨 판매점 분석, AI 기반 로또 번호 분석까지 제공하는 데이터 기반 로또 분석 서비스입니다.",
    url: "https://app.nexlab.ai.kr",
    siteName: "Lotto Data Lab",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <head>
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
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
          <PageViewProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </PageViewProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
