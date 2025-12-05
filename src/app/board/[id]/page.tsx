"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { apiUrl } from "@/app/utils/getUtils";
import { useAuth } from "@/app/context/authContext";
import CommentInput from "@/app/components/board/CommentInput";

/* --------------------------------------------
🔥 타입 정의
---------------------------------------------*/

interface CommentType {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string;
  };
}

interface PostType {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  user: { name: string };
  comments: CommentType[];
}

/* --------------------------------------------
🔥 상세 페이지
---------------------------------------------*/

export default function BoardDetailPage() {
  const { id } = useParams();
  const { user, openLoginModal } = useAuth();

  const [post, setPost] = useState<PostType | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 fetchPost 함수는 반드시 useEffect 밖!
  const fetchPost = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/posts/${id}`);
      const result = await res.json();
      setPost(result.post);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  if (loading) return <p className="p-6">로딩 중...</p>;
  if (!post) return <p className="p-6">게시글을 찾을 수 없습니다.</p>;

  return (
    <main className="p-6 max-w-3xl mx-auto">
      {/* 게시글 제목 */}
      <h1 className="text-2xl font-bold mb-2">{post.title}</h1>

      {/* 작성자/날짜 */}
      <p className="text-gray-500 text-sm mb-4">
        {post.user?.name} · {new Date(post.createdAt).toLocaleString()}
      </p>

      {/* 게시글 본문 */}
      <div className="border p-4 rounded-md whitespace-pre-wrap">
        {post.content}
      </div>

      {/* 댓글 목록 */}
      <h2 className="text-xl font-semibold mt-8 mb-3">댓글</h2>

      <div className="space-y-4">
        {post.comments.length === 0 ? (
          <p className="text-gray-500">댓글이 없습니다.</p>
        ) : (
          post.comments.map((comment) => (
            <div key={comment.id} className="border p-3 rounded-md">
              <p className="mb-1 whitespace-pre-wrap">{comment.content}</p>
              <p className="text-gray-500 text-sm">
                {comment.user.name} ·{" "}
                {new Date(comment.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>

      {/* 댓글 입력 */}
      <CommentInput postId={id as string} onSubmitFinish={fetchPost} />
    </main>
  );
}
