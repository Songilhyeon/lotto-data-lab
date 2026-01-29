"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import LottoBall from "./LottoBall";

type NextRoundObj = {
  round: number;
  numbers: number[];
  bonus?: number | null;
};

type NextRoundProp = number[] | NextRoundObj | null;

const STORAGE_KEY = "nextRoundPosition_v2";

/** type guard */
function isNextRoundObj(x: NextRoundProp): x is NextRoundObj {
  return (
    x !== null &&
    typeof x === "object" &&
    Array.isArray((x as NextRoundObj).numbers)
  );
}

export default function DraggableNextRound({
  nextRound,
  most,
  least,
}: {
  nextRound: NextRoundProp;
  most?: number[];
  least?: number[];
}) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  // 기본값: 안전한 화면 좌상단(SSR에서도 안전)
  const [position, setPosition] = useState<{ x: number; y: number }>(() => ({
    x: 12,
    y: 12,
  }));

  const isClient = typeof window !== "undefined";
  const isMobile = isClient ? window.innerWidth < 640 : false;

  // clamp: 박스가 화면을 벗어나지 않게 제한
  const clamp = (x: number, y: number) => {
    if (!isClient) return { x, y };
    const bw = boxRef.current?.offsetWidth ?? 260;
    const bh = boxRef.current?.offsetHeight ?? 60;
    const minX = 8;
    const minY = 8;
    const maxX = Math.max(minX, window.innerWidth - bw - 8);
    const maxY = Math.max(minY, window.innerHeight - bh - 8);
    return {
      x: Math.min(Math.max(x, minX), maxX),
      y: Math.min(Math.max(y, minY), maxY),
    };
  };

  // --- 초기 위치 복원(또는 초기 위치 설정)
  useLayoutEffect(() => {
    if (!nextRound || typeof window === "undefined") return;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === "number" && typeof parsed.y === "number") {
          const fixed = clamp(parsed.x, parsed.y);
          // requestAnimationFrame으로 감싸서 동기 setState 호출 문제 회피
          window.requestAnimationFrame(() => setPosition(fixed));
          return;
        }
      }
    } catch {}

    if (isMobile) {
      window.requestAnimationFrame(() => setPosition({ x: 12, y: 12 }));
    } else {
      const defaultX = Math.max(8, window.innerWidth / 2 - 160);
      window.requestAnimationFrame(() => setPosition(clamp(defaultX, 20)));
    }
  }, [nextRound]);

  // --- 드래그 시작
  const startDrag = (clientX: number, clientY: number) => {
    if (!boxRef.current) return;
    const rect = boxRef.current.getBoundingClientRect();
    dragging.current = true;
    offset.current = { x: clientX - rect.left, y: clientY - rect.top };
    document.body.style.userSelect = "none";
  };

  // --- 드래그 이동
  const moveDrag = (clientX: number, clientY: number) => {
    if (!dragging.current) return;
    const raw = {
      x: clientX - offset.current.x,
      y: clientY - offset.current.y,
    };
    const { x, y } = clamp(raw.x, raw.y);
    setPosition({ x, y });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ x, y }));
    } catch {}
  };

  // --- 드래그 중단
  const stopDrag = () => {
    dragging.current = false;
    document.body.style.userSelect = "";
  };

  // 전역 이벤트 바인딩 + resize 처리
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => moveDrag(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches?.length) {
        if (dragging.current) e.preventDefault();
        moveDrag(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onResize = () => setPosition((prev) => clamp(prev.x, prev.y));

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", stopDrag);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", stopDrag);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", stopDrag);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  if (!nextRound) return null;

  const numbers: number[] = isNextRoundObj(nextRound)
    ? nextRound.numbers
    : (nextRound as number[]);
  const roundLabel: number | null = isNextRoundObj(nextRound)
    ? nextRound.round
    : null;
  const bonusLabel: number | null = isNextRoundObj(nextRound)
    ? (nextRound.bonus ?? null)
    : null;

  return (
    <div
      ref={boxRef}
      onMouseDown={(e) => {
        e.preventDefault();
        startDrag(e.clientX, e.clientY);
      }}
      onTouchStart={(e) => {
        if (e.touches?.length)
          startDrag(e.touches[0].clientX, e.touches[0].clientY);
      }}
      className="fixed bg-gray-100 border border-yellow-400 rounded-xl px-3 py-2 shadow-md z-1000 flex items-center gap-2 cursor-move select-none text-sm sm:text-base"
      style={{
        left: position.x,
        top: position.y,
        touchAction: "none",
        maxWidth: "90vw", // 화면 줄어들어도 찌그러지지 않음
      }}
    >
      <span className="font-bold whitespace-nowrap">
        {roundLabel ? `다음 회차 ${roundLabel} :` : "다음 회차 :"}
      </span>

      <div className="flex flex-wrap gap-1 sm:gap-2">
        {numbers.map((num) => (
          <LottoBall
            key={num}
            number={num}
            highlightMax={most?.includes(num) ?? false}
            highlightMin={least?.includes(num) ?? false}
          />
        ))}
      </div>

      {bonusLabel != null && (
        <>
          <span className="text-xs font-medium text-yellow-800">/</span>
          <LottoBall
            number={bonusLabel}
            highlightMax={most?.includes(bonusLabel) ?? false}
            highlightMin={least?.includes(bonusLabel) ?? false}
          />
        </>
      )}
    </div>
  );
}
