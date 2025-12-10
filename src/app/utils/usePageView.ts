"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function usePageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;

    window.gtag?.("config", "G-JYYJBFHWY2", {
      page_path:
        pathname +
        (searchParams?.toString() ? "?" + searchParams.toString() : ""),
    });
  }, [pathname, searchParams]);
}
