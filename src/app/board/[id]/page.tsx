"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
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

/* --------------------------------------------
🔥 상세 페이지
---------------------------------------------*/
export default function BoardDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, openLoginModal } = useAuth();

  const [post, setPost] = useState<PostType | null>(null);
  const [loading, setLoading] = useState(true);

  // 게시글 수정 모달
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // 댓글 수정 상태
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState("");

  /* -----------------------------
  📌 게시글 불러오기
  ------------------------------ */
  const fetchPost = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/posts/${id}`);
      const data = await res.json();
      setPost(data.post);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  if (loading) return <p className="p-6">로딩 중...</p>;
  if (!post) return <p className="p-6">게시글을 찾을 수 없습니다.</p>;

  const isOwner = user?.name === post.user.name;

  /* -----------------------------
  📌 게시글 삭제
  ------------------------------ */
  const handleDeletePost = async () => {
    if (!confirm("정말 게시글을 삭제할까요?")) return;

    const res = await fetch(`${apiUrl}/posts/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      alert("삭제 실패");
      return;
    }

    alert("삭제되었습니다.");
    router.push("/board");
  };

  /* -----------------------------
  📌 게시글 수정 저장
  ------------------------------ */
  const handleSaveEdit = async () => {
    const res = await fetch(`${apiUrl}/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        title: editTitle,
        content: editContent,
      }),
    });

    if (!res.ok) {
      alert("수정 실패");
      return;
    }

    alert("수정되었습니다.");
    setIsEditMode(false);
    fetchPost();
  };

  /* -----------------------------
  📌 댓글 삭제
  ------------------------------ */
  const deleteComment = async (commentId: string) => {
    if (!confirm("댓글을 삭제할까요?")) return;

    const res = await fetch(`${apiUrl}/posts/comments/${commentId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      alert("댓글 삭제 실패");
      return;
    }

    fetchPost();
  };

  /* -----------------------------
  📌 댓글 수정 저장
  ------------------------------ */
  const saveCommentEdit = async (commentId: string) => {
    const res = await fetch(`${apiUrl}/posts/comments/${commentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ content: editCommentText }),
    });

    if (!res.ok) {
      alert("댓글 수정 실패");
      return;
    }

    setEditingCommentId(null);
    fetchPost();
  };

  return (
    <main className="p-6 max-w-3xl mx-auto">
      {/* ----------------------------- */}
      {/* 상단 제목 & 수정/삭제 버튼 */}
      {/* ----------------------------- */}
      <div className="flex items-start justify-between mb-4">
        <h1 className="text-2xl font-bold">{post.title}</h1>

        {isOwner && (
          <div className="flex gap-3">
            {/* 수정 버튼 */}
            <button
              onClick={() => {
                setEditTitle(post.title);
                setEditContent(post.content);
                setIsEditMode(true);
              }}
              className="
                px-3 py-1.5 rounded-md text-sm font-medium
                border border-blue-300 text-blue-600 bg-white
                hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700
                active:scale-95 active:bg-blue-100
                transition-all duration-150
              "
            >
              수정
            </button>

            {/* 삭제 버튼 */}
            <button
              onClick={handleDeletePost}
              className="
                px-3 py-1.5 rounded-md text-sm font-medium
                border border-red-300 text-red-600 bg-white
                hover:bg-red-50 hover:border-red-400 hover:text-red-700
                active:scale-95 active:bg-red-100
                transition-all duration-150
              "
            >
              삭제
            </button>
          </div>
        )}
      </div>

      {/* 작성자 / 날짜 */}
      <p className="text-gray-500 text-sm mb-4">
        {post.user.name} · {new Date(post.createdAt).toLocaleString()}
      </p>

      {/* 게시글 내용 */}
      <div className="border p-4 rounded-md whitespace-pre-wrap">
        {post.content}
      </div>

      {/* ----------------------------- */}
      {/* 댓글 영역 */}
      {/* ----------------------------- */}
      <h2 className="text-xl font-semibold mt-8 mb-3">댓글</h2>

      <div className="space-y-4">
        {post.comments.length === 0 ? (
          <p className="text-gray-500">댓글이 없습니다.</p>
        ) : (
          post.comments.map((comment) => (
            <div key={comment.id} className="border p-3 rounded-md relative">
              {/* 댓글 수정 모드 */}
              {editingCommentId === comment.id ? (
                <>
                  <textarea
                    className="w-full border p-2 rounded"
                    rows={3}
                    value={editCommentText}
                    onChange={(e) => setEditCommentText(e.target.value)}
                  />

                  <div className="flex gap-2 mt-2">
                    <button
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 active:scale-95"
                      onClick={() => saveCommentEdit(comment.id)}
                    >
                      저장
                    </button>
                    <button
                      className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 active:scale-95"
                      onClick={() => setEditingCommentId(null)}
                    >
                      취소
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="whitespace-pre-wrap">{comment.content}</p>
                  <p className="text-gray-500 text-sm">
                    {comment.user.name} ·{" "}
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>

                  {user?.name === comment.user.name && (
                    <div className="flex gap-2 mt-2">
                      <button
                        className="
                          px-2 py-1 text-sm bg-gray-200 rounded
                          hover:bg-gray-300 active:scale-95
                        "
                        onClick={() => {
                          setEditingCommentId(comment.id);
                          setEditCommentText(comment.content);
                        }}
                      >
                        수정
                      </button>
                      <button
                        className="
                          px-2 py-1 text-sm bg-red-500 text-white rounded
                          hover:bg-red-600 active:scale-95
                        "
                        onClick={() => deleteComment(comment.id)}
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* 댓글 입력 */}
      <CommentInput postId={id as string} onSubmitFinish={fetchPost} />

      {/* ----------------------------- */}
      {/* 게시글 수정 모달 */}
      {/* ----------------------------- */}
      {isEditMode && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[2000]">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4">게시글 수정</h2>

            <input
              className="w-full border p-2 rounded mb-3"
              placeholder="제목"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />

            <textarea
              className="w-full border p-2 rounded"
              rows={6}
              placeholder="내용"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="
                  px-3 py-1 bg-gray-300 rounded
                  hover:bg-gray-400 active:scale-95
                "
                onClick={() => setIsEditMode(false)}
              >
                취소
              </button>
              <button
                className="
                  px-3 py-1 bg-blue-600 text-white rounded
                  hover:bg-blue-700 active:scale-95
                "
                onClick={handleSaveEdit}
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
