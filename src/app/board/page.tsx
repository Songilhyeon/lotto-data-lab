"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/authContext";
import Link from "next/link";
import { apiUrl } from "@/app/utils/getUtils";

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function BoardPage() {
  const { user, openLoginModal } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${apiUrl}/posts`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">피드백 게시판</h1>
      <p className="text-gray-500 mb-4">
        피드백을 남겨주세요. 문제점, 개선사항, 궁금한 점 등을 공유해주세요.
      </p>

      {user ? (
        <Link
          href="/board/new"
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          글쓰기
        </Link>
      ) : (
        <button
          onClick={openLoginModal}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          로그인 후 글쓰기
        </button>
      )}

      {/* 목록 */}
      <div className="mt-6 space-y-4">
        {loading ? (
          <p>로딩 중...</p>
        ) : posts.length === 0 ? (
          <p className="text-gray-500">아직 게시글이 없습니다.</p>
        ) : (
          posts.map((post) => (
            <Link
              key={post.id}
              href={`/board/${post.id}`}
              className="block border p-4 rounded-md hover:bg-gray-50"
            >
              <h2 className="font-bold">{post.title}</h2>
              <p className="text-gray-500 text-sm">
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}
