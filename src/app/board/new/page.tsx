import type { Metadata } from "next";
import BoardNewClient from "./page.client";

export const metadata: Metadata = {
  title: "게시글 작성 | 커뮤니티",
  description: "로또 커뮤니티 게시글 작성 페이지",
  alternates: { canonical: "https://app.nexlab.ai.kr/board/new" },
  robots: { index: false, follow: false }, // ✅ 글쓰기 폼은 보통 noindex 권장
};

export default function Page() {
  return <BoardNewClient />;
}
