// app/lib/gtag.ts
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

// prod에서만 허용
function canTrack() {
  return (
    process.env.NODE_ENV === "production" &&
    typeof window !== "undefined" &&
    !!GA_ID &&
    typeof window.gtag === "function"
  );
}

// 페이지뷰 기록
export const pageview = (url: string) => {
  if (!canTrack()) return;

  window.gtag("config", GA_ID, {
    page_path: url,
  });
};

// 이벤트 기록
export const gaEvent = (
  action: string,
  params: Record<string, unknown> = {}
) => {
  if (!canTrack()) return;

  window.gtag("event", action, params);
};
