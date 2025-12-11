// /app/lib/gtag.ts

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-JYYJBFHWY2";

// 페이지뷰 기록
export const pageview = (url: string) => {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("config", GA_ID, {
    page_path: url,
  });
};

// 이벤트 기록
export const gaEvent = (
  action: string,
  params: Record<string, unknown> = {}
) => {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("event", action, params);
};
