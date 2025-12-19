"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/authContext";
import Link from "next/link";
import { apiUrl } from "@/app/utils/getUtils";
import { componentBodyDivStyle } from "@/app/utils/getDivStyle";

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface PostListResponse {
  posts: Post[];
  page: number;
  totalPages: number;
  totalCount?: number;
}

const PAGE_SIZE = 10;

export default function BoardClient() {
  const { user, openLoginModal } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `${apiUrl}/posts?page=${page}&limit=${PAGE_SIZE}`
        );

        if (!res.ok) throw new Error("게시글을 불러오는 데 실패했습니다.");

        const data: PostListResponse = await res.json();
        setPosts(data.posts ?? []);
        setTotalPages(data.totalPages ?? 1);
      } catch (err: unknown) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page]);

  return (
    <main className={`${componentBodyDivStyle()} from-pink-50 to-indigo-100`}>
      {/* 글쓰기 버튼 */}
      <div className="mb-6">
        {user ? (
          <Link
            href="/board/new"
            className="inline-block px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-700 transition-colors"
          >
            글쓰기
          </Link>
        ) : (
          <button
            onClick={openLoginModal}
            className="inline-block px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-700 transition-colors"
          >
            로그인 후 글쓰기
          </button>
        )}
      </div>

      {/* 게시글 목록 */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-500">로딩 중...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : posts.length === 0 ? (
          <p className="text-gray-500">아직 게시글이 없습니다.</p>
        ) : (
          posts.map((post) => (
            <Link
              key={post.id}
              href={`/board/${post.id}`}
              className="block border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow hover:bg-gray-50"
            >
              <h2 className="text-lg font-semibold text-gray-800">
                {post.title}
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                {new Date(post.createdAt).toLocaleString()}
              </p>
              <p className="text-gray-600 mt-2 line-clamp-3">{post.content}</p>
            </Link>
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded border text-sm disabled:opacity-40"
          >
            이전
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 rounded border text-sm ${
                p === page
                  ? "bg-blue-600 text-white border-blue-600"
                  : "hover:bg-gray-100"
              }`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 rounded border text-sm disabled:opacity-40"
          >
            다음
          </button>
        </div>
      )}
    </main>
  );
}
