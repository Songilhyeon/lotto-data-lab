import { Metadata } from "next";
import BoardDetailClient from "./BoardDetailClient";
import { apiUrl } from "@/app/utils/getUtils";

interface BoardDetailPageProps {
  params: { id: string };
}

interface CommentType {
  id: string;
  content: string;
  createdAt: string;
  authorDisplayName?: string;
  user: { id: string } | null;
}

interface PostType {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  authorDisplayName?: string;
  user: { id: string } | null;
  comments: CommentType[];
}

export default async function BoardDetailPage(props: BoardDetailPageProps) {
  const params = await props.params; // ✅ unwrap
  const id = params.id;

  let post: PostType | null = null;

  try {
    const res = await fetch(`${apiUrl}/posts/${id}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      post = data.post ?? null;
    }
  } catch (err) {
    console.error(err);
  }

  if (!post) return <p>게시글을 찾을 수 없습니다.</p>;

  return <BoardDetailClient initialPost={post} />;
}

// ---------------------
// SEO Metadata
// ---------------------
export async function generateMetadata(
  props: BoardDetailPageProps
): Promise<Metadata> {
  const params = await props.params; // ✅ unwrap
  const id = params.id;

  const canonical = `https://app.nexlab.ai.kr/board/${id || ""}`.replace(
    /\/$/,
    ""
  );

  if (!id) {
    return {
      title: "게시글 상세",
      description: "로또 커뮤니티 게시글 상세 페이지",
      alternates: { canonical: "https://app.nexlab.ai.kr/board" },
    };
  }

  try {
    const res = await fetch(`${apiUrl}/posts/${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error("API 호출 실패");
    const data = await res.json();
    const post = data.post ?? data;

    const title = post.title ?? "게시글 상세";
    const description =
      post.content?.slice(0, 150) ?? "로또 커뮤니티 게시글 상세 페이지";

    return {
      title,
      description,
      alternates: { canonical },
      openGraph: {
        title,
        description,
        url: canonical,
        siteName: "Lotto Data Lab",
        type: "article",
      },
    };
  } catch (err) {
    console.error(err);
    return {
      title: "게시글 상세",
      description: "로또 커뮤니티 게시글 상세 페이지",
      alternates: { canonical },
    };
  }
}
