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
  user: { name: string; id: string };
}

interface PostType {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  user: { name: string; id: string };
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

  if (!id)
    return {
      title: "게시글 상세",
      description: "로또 커뮤니티 게시글 상세 페이지",
    };

  try {
    const res = await fetch(`${apiUrl}/posts/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("API 호출 실패");
    const data = await res.json();
    const post = data.post ?? data;

    return {
      title: post.title ?? "게시글 상세",
      description:
        post.content?.slice(0, 150) ?? "로또 커뮤니티 게시글 상세 페이지",
    };
  } catch (err) {
    console.error(err);
    return {
      title: "게시글 상세",
      description: "로또 커뮤니티 게시글 상세 페이지",
    };
  }
}
