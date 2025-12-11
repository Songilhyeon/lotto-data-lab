"use client";

import { useState } from "react";
import { useAuth } from "@/app/context/authContext";
import { apiUrl } from "@/app/utils/getUtils";
import { useRouter } from "next/navigation";

export default function NewPostPage() {
  const { user, openLoginModal } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    openLoginModal();
    return null;
  }

  const submit = async () => {
    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 모두 입력해주세요.");
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

      const data = await res.json();
      if (data.ok) {
        router.push("/board");
      } else {
        setError(data.message || "게시글 등록에 실패했습니다.");
      }
    } catch (err: unknown) {
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
    <main className="p-6 max-w-3xl mx-auto">
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
        className="border p-3 w-full h-48 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={loading}
      />

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
  );
}
