// app/board/page.tsx
import BoardClient from "./BoardClient";
import ComponentHeader from "@/app/components/ComponentHeader";

export const metadata = {
  title: "커뮤니티 & 게시판",
  description:
    "로또 관련 커뮤니티 게시판입니다. 질문, 후기, 번호 공유 등 사용자 참여형 게시물을 확인하고 의견을 남겨보세요.",
  openGraph: {
    title: "커뮤니티 & 게시판",
    description:
      "로또 관련 커뮤니티 게시판입니다. 질문, 후기, 번호 공유 등 사용자 참여형 게시물을 확인하고 의견을 남겨보세요.",
    url: "https://app.nexlab.ai.kr/board",
    siteName: "Lotto Data Lab",
    type: "website",
  },
};

export default function Page() {
  return (
    <div className="p-4">
      <ComponentHeader
        title="📋 피드백 게시판"
        content="문제점, 개선사항, 궁금한 점 등을 자유롭게 남겨보세요."
        srOnly={true}
      />
      <BoardClient />
    </div>
  );
}
