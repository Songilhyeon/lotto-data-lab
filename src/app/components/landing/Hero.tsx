"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <header className="bg-paper-pattern shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-black mb-4"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          로또 데이터 실험실
        </motion.h1>
        <motion.p
          className="text-black text-lg md:text-xl mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          최신 당첨 회차 분석, 번호 패턴, 통계까지 한눈에 확인하세요.
        </motion.p>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link
            href="/analyze"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-blue-700 transition"
          >
            분석 시작하기
          </Link>
        </motion.div>
      </div>
    </header>
  );
}
