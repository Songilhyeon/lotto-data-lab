"use client";
import React, { useEffect, useRef, useState } from "react";
import LottoBall from "../LottoBall";
/**
 * 필요한 것:
 * - LottoBall 컴포넌트가 같은 scope에 있어야 함.
 *   import LottoBall from "@/components/LottoBall"; 처럼 경로 맞춰서 가져오세요.
 */

type NextRoundType = {
  round: number;
  numbers: number[];
  bonus?: number | null;
};

const STORAGE_KEY = "nextRoundPosition_v1";
const BOX_WIDTH_ESTIMATE = 300; // 초기 중앙 배치 위해 추정값(필요시 조정)
const BOX_HEIGHT_ESTIMATE = 70;

export default function DraggableNextRound({
  nextRound,
}: {
  nextRound: NextRoundType | null;
}) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  // position은 픽셀 단위
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null
  );

  // --- 초기 위치 복원 (SSR 안전)
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 복원 시도
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (
          typeof parsed.x === "number" &&
          typeof parsed.y === "number" &&
          Number.isFinite(parsed.x) &&
          Number.isFinite(parsed.y)
        ) {
          setPosition(parsed);
          return;
        }
      } catch {
        // 무시하고 기본값 사용
      }
    }

    // 기본: 화면 상단 중앙 (SSG/SSR에서는 이 effect가 클라이언트에서 실행됨)
    const x = Math.max(8, window.innerWidth / 2 - BOX_WIDTH_ESTIMATE / 2);
    const y = 35;
    setPosition({ x, y });
  }, []);

  // clamp 함수: 박스가 화면 밖으로 나가지 않게 함
  const clampToViewport = (x: number, y: number) => {
    if (typeof window === "undefined") return { x, y };
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const box = boxRef.current;
    const bw = box ? box.getBoundingClientRect().width : BOX_WIDTH_ESTIMATE;
    const bh = box ? box.getBoundingClientRect().height : BOX_HEIGHT_ESTIMATE;

    const minX = 8;
    const minY = 8;
    const maxX = Math.max(minX, vw - bw - 8);
    const maxY = Math.max(minY, vh - bh - 8);

    const nx = Math.min(Math.max(x, minX), maxX);
    const ny = Math.min(Math.max(y, minY), maxY);
    return { x: nx, y: ny };
  };

  // 공통 드래그 시작
  const startDrag = (clientX: number, clientY: number) => {
    if (!boxRef.current) return;
    const rect = boxRef.current.getBoundingClientRect();
    dragging.current = true;
    offset.current = { x: clientX - rect.left, y: clientY - rect.top };
    // 선택 방지
    document.body.style.userSelect = "none";
  };

  const onMouseDown: React.MouseEventHandler = (e) => {
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
  };

  const onTouchStart: React.TouchEventHandler = (e) => {
    if (!e.touches || e.touches.length === 0) return;
    const t = e.touches[0];
    startDrag(t.clientX, t.clientY);
  };

  // 이동
  const moveDrag = (clientX: number, clientY: number) => {
    if (!dragging.current) return;
    const rawX = clientX - offset.current.x;
    const rawY = clientY - offset.current.y;
    const { x, y } = clampToViewport(rawX, rawY);
    setPosition({ x, y });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ x, y }));
    } catch {
      // localStorage 실패 시 무시
    }
  };

  const onMouseMove = (e: MouseEvent) => {
    moveDrag(e.clientX, e.clientY);
  };

  const onTouchMove = (e: TouchEvent) => {
    if (!e.touches || e.touches.length === 0) return;
    const t = e.touches[0];
    // 모바일에서 스크롤 막고 싶으면 preventDefault (주의: passive listeners)
    // e.preventDefault(); // 필요 시 사용(추가 설정 필요)
    moveDrag(t.clientX, t.clientY);
  };

  const stopDrag = () => {
    dragging.current = false;
    document.body.style.userSelect = "";
  };

  // 전역 이벤트 바인딩
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", stopDrag);

    // touch 이벤트는 passive 문제로 preventDefault 불가능; 여기선 기본 이동만 처리
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", stopDrag);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", stopDrag);

      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", stopDrag);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 렌더링 전 위치가 준비되지 않았으면 null 반환 (SSR 안전)
  if (!nextRound || !position) return null;

  return (
    <div
      ref={boxRef}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      className="fixed bg-yellow-100 border border-yellow-400 rounded-xl px-4 py-2 shadow-md z-50 flex items-center gap-2 cursor-move select-none"
      style={{
        left: position.x,
        top: position.y,
        touchAction: "none", // 터치 동작 제어 (드래그 성능 향상)
      }}
      role="button"
      aria-label={`다음 회차 ${nextRound.round}`}
    >
      <span className="font-bold">다음 회차 {nextRound.round} :</span>

      <div className="flex flex-wrap gap-2 justify-center">
        {nextRound.numbers.map((num) => (
          // LottoBallComp는 number prop을 number 타입으로 받도록 가정
          <LottoBall key={num} number={num} />
        ))}
      </div>

      {nextRound.bonus != null && (
        <>
          <span className="text-sm font-medium text-yellow-800">/</span>
          <LottoBall number={nextRound.bonus} />
        </>
      )}
    </div>
  );
}
