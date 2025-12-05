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

  if (!user) return openLoginModal();

  const submit = async () => {
    const res = await fetch(`${apiUrl}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ title, content }),
    });

    const data = await res.json();
    if (data.ok) router.push("/board");
  };

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">게시글 작성</h1>

      <input
        type="text"
        placeholder="제목"
        className="border p-2 w-full mb-4"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="내용"
        className="border p-2 w-full h-40"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        onClick={submit}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        등록
      </button>
    </main>
  );
}
