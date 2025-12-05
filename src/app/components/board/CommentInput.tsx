"use client";
import { useState } from "react";
import { useAuth } from "@/app/context/authContext";
import { apiUrl } from "@/app/utils/getUtils";

interface CommentInputProps {
  postId: string;
  onSubmitFinish: () => void;
}

/* --------------------------------------------
🔥 댓글 입력 UI Component
---------------------------------------------*/
export default function CommentInput({
  postId,
  onSubmitFinish,
}: CommentInputProps) {
  const { user, openLoginModal } = useAuth();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const submitComment = async () => {
    if (!user) {
      openLoginModal();
      return;
    }

    if (!content.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/posts/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ postId, content }),
      });

      const data = await res.json();
      if (data.ok) {
        setContent("");
        onSubmitFinish(); // 🔥 댓글 등록되면 다시 불러오기
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border p-3 rounded-md h-24"
        placeholder="댓글을 입력하세요"
      />

      <button
        onClick={submitComment}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
        disabled={loading}
      >
        {loading ? "등록 중..." : "댓글 등록"}
      </button>
    </div>
  );
}
