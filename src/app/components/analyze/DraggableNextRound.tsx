"use client";
import React, { useEffect, useRef, useState } from "react";
import LottoBall from "../LottoBall";

type NextRoundObj = {
  round: number;
  numbers: number[];
  bonus?: number | null;
};

type NextRoundProp = number[] | NextRoundObj | null;

const STORAGE_KEY = "nextRoundPosition_v1";
const BOX_WIDTH_ESTIMATE = 300;
const BOX_HEIGHT_ESTIMATE = 70;

function isNextRoundObj(x: NextRoundProp): x is NextRoundObj {
  return (
    x !== null &&
    typeof x === "object" &&
    Array.isArray((x as NextRoundObj).numbers) &&
    typeof (x as NextRoundObj).numbers[0] !== "undefined"
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

  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null
  );

  // --- 위치 복원 ---
  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === "number" && typeof parsed.y === "number") {
          setTimeout(() => setPosition({ x: parsed.x, y: parsed.y }), 0);
          return;
        }
      } catch {}
    }

    const x = Math.max(8, window.innerWidth / 2 - BOX_WIDTH_ESTIMATE / 2);
    const y = 35;
    setTimeout(() => setPosition({ x, y }), 0);
  }, []);

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

    return {
      x: Math.min(Math.max(x, minX), maxX),
      y: Math.min(Math.max(y, minY), maxY),
    };
  };

  const startDrag = (clientX: number, clientY: number) => {
    if (!boxRef.current) return;

    const rect = boxRef.current.getBoundingClientRect();
    dragging.current = true;
    offset.current = {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
    document.body.style.userSelect = "none";
  };

  const onMouseDown: React.MouseEventHandler = (e) => {
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
  };

  const onTouchStart: React.TouchEventHandler = (e) => {
    if (!e.touches.length) return;
    const t = e.touches[0];
    startDrag(t.clientX, t.clientY);
  };

  const moveDrag = (clientX: number, clientY: number) => {
    if (!dragging.current) return;

    const rawX = clientX - offset.current.x;
    const rawY = clientY - offset.current.y;

    const { x, y } = clampToViewport(rawX, rawY);
    setPosition({ x, y });

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ x, y }));
    } catch {}
  };

  const onMouseMove = (e: MouseEvent) => moveDrag(e.clientX, e.clientY);
  const onTouchMove = (e: TouchEvent) => {
    if (!e.touches.length) return;
    const t = e.touches[0];
    moveDrag(t.clientX, t.clientY);
  };

  const stopDrag = () => {
    dragging.current = false;
    document.body.style.userSelect = "";
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", stopDrag);

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

  if (!nextRound || !position) return null;

  // unify to numbers array & optional meta
  const numbers: number[] = isNextRoundObj(nextRound)
    ? nextRound.numbers
    : (nextRound as number[]);

  const roundLabel: number | null = isNextRoundObj(nextRound)
    ? nextRound.round
    : null;

  const bonusLabel: number | null = isNextRoundObj(nextRound)
    ? nextRound.bonus ?? null
    : null;

  return (
    <div
      ref={boxRef}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      className="fixed bg-yellow-100 border border-yellow-400 rounded-xl px-4 py-2 shadow-md z-50 flex items-center gap-2 cursor-move select-none"
      style={{
        left: position.x,
        top: position.y,
        touchAction: "none",
      }}
    >
      <span className="font-bold">
        {roundLabel ? `다음 회차 ${roundLabel} :` : "다음 회차 :"}
      </span>

      <div className="flex flex-wrap gap-2">
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
          <span className="text-sm font-medium text-yellow-800">/</span>
          <LottoBall number={bonusLabel} />
        </>
      )}
    </div>
  );
}
