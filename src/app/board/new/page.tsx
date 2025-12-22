"use client";

import { useState, useEffect } from "react";
import { apiUrl } from "@/app/utils/getUtils";
import { useRouter } from "next/navigation";
import { componentBodyDivStyle } from "@/app/utils/getDivStyle";
import useAuthGuard from "@/app/hooks/useAuthGuard";

interface PostResponse {
  ok: boolean;
  message?: string;
}

const MAX_CONTENT_LENGTH = 2000;

export default function NewPostPage() {
  const { isAuthed, openLoginModal } = useAuthGuard();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** 🔐 비로그인 시 로그인 모달 */
  useEffect(() => {
    if (!isAuthed) openLoginModal();
  }, [isAuthed, openLoginModal]);

  /** ⚠️ 작성 중 이탈 방지 */
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (title.trim() || content.trim()) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [title, content]);

  if (!isAuthed) return null;

  const submit = async () => {
    if (loading) return;

    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 모두 입력해주세요.");
      return;
    }

    if (content.length > MAX_CONTENT_LENGTH) {
      setError(`내용은 ${MAX_CONTENT_LENGTH}자 이내로 작성해주세요.`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${apiUrl}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, content }),
      });

      if (res.status === 401) {
        openLoginModal();
        return;
      }

      if (!res.ok) {
        const data: PostResponse = await res.json();
        throw new Error(data.message || "게시글 등록에 실패했습니다.");
      }

      router.push("/board");
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "게시글 등록 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <main className={`${componentBodyDivStyle()} from-pink-50 to-indigo-100`}>
        <h1 className="text-3xl font-bold mb-6">📝 게시글 작성</h1>

        {error && <p className="mb-4 text-red-500 font-medium">{error}</p>}

        <input
          type="text"
          placeholder="제목"
          className="border p-3 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />

        <textarea
          placeholder="내용"
          className="border p-3 w-full h-48 mb-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.ctrlKey && e.key === "Enter") submit();
          }}
          disabled={loading}
        />

        <p className="text-sm text-gray-500 text-right mb-4">
          {content.length} / {MAX_CONTENT_LENGTH}
        </p>

        <button
          onClick={submit}
          disabled={loading}
          className={`px-6 py-2 rounded text-white font-medium transition-colors ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
          }`}
        >
          {loading ? "등록 중..." : "등록"}
        </button>
      </main>
    </div>
  );
}
