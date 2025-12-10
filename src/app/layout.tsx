import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { AuthProvider } from "@/app/context/authContext";
import Script from "next/script";
import PageViewProvider from "@/app/PageViewProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lotto Data Lab",
  description: "Lotto Data Lab",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* GA4 Script */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-JYYJBFHWY2"
        />

        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-JYYJBFHWY2', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        <AuthProvider>
          <PageViewProvider>
            {/* Header */}
            <Header />
            <main>{children}</main>
            <Footer />
          </PageViewProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
