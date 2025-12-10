"use client";

import { usePageView } from "@/app/utils/usePageView";

// Add type annotations
export default function PageViewProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  usePageView();
  return <>{children}</>;
}
