"use client";

import { useEffect, useState, startTransition } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import LottoBall from "@/app/components/LottoBall";

function getRandomLottoNumbers() {
  const nums: number[] = [];
  while (nums.length < 6) {
    const n = Math.floor(Math.random() * 45) + 1;
    if (!nums.includes(n)) nums.push(n);
  }
  return nums.sort((a, b) => a - b);
}

export default function Hero() {
  const [sampleNumbers, setSampleNumbers] = useState<number[] | null>(null);

  // 클라이언트에서만 실행 (SSR 안전)
  useEffect(() => {
    // React 19: setState는 transition 안에서 호출해야 경고 없음
    startTransition(() => {
      setSampleNumbers(getRandomLottoNumbers());
    });
  }, []);

  return (
    <header className="bg-linear-to-b from-blue-50 to-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        {/* 상단 Sub Text */}
        <motion.span
          className="inline-block text-blue-600 font-semibold text-sm mb-3 tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          이번 주 로또 데이터 기반 추천
        </motion.span>

        {/* 메인 타이틀 */}
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          더 똑똑하게 번호를 선택하세요
        </motion.h1>

        {/* 서브 타이틀 */}
        <motion.p
          className="text-gray-600 text-lg md:text-xl mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          당첨 번호 패턴 · 최근 10주 빈도 · 일치 패턴 · 다음 회차 예측까지 로또
          데이터 실험실에서 분석한 핵심 결과를 제공합니다.
        </motion.p>

        {/* 추천 번호 샘플 */}
        {sampleNumbers && (
          <motion.div
            className="flex justify-center gap-3 mb-10"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.6 }}
          >
            {sampleNumbers.map((n) => (
              <LottoBall key={n} number={n} size="lg" pulse={true} />
            ))}
          </motion.div>
        )}

        {/* CTA 버튼 */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Link
            href="/analyze"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-xl 
                       text-lg font-bold shadow-lg hover:bg-blue-700 hover:shadow-xl 
                       transition active:scale-95"
          >
            무료 분석 시작하기 →
          </Link>
        </motion.div>
      </div>
    </header>
  );
}
