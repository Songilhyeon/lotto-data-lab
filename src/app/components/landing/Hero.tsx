"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <header className="bg-gradient-to-b from-blue-50 to-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
        {/* 상단 Sub Text */}
        <motion.span
          className="inline-block text-blue-600 font-semibold text-xs sm:text-sm mb-2 sm:mb-3 tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          진짜 수동 로또 유저를 위한 데이터 서비스
        </motion.span>

        {/* 메인 타이틀 */}
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-snug sm:leading-tight mb-4"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <span className="block sm:inline">
            🟡 운에 기대지 않는 사람들을 위한
          </span>
          <span className="block sm:inline">프리미엄 로또 분석 도구.</span>
        </motion.h1>

        {/* 서브 타이틀 */}
        <motion.p
          className="text-gray-600 text-base sm:text-lg md:text-xl mb-4 max-w-md sm:max-w-xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          당첨 번호의 흐름, 변화의 패턴, 장기·단기 통계의 균형… 모든 회차
          데이터를 정밀하게 다듬어 ‘의미 있는 정보’만 제공합니다.
        </motion.p>

        {/* 프리미엄 강조 문구 */}
        <motion.p
          className="text-blue-600 font-semibold text-sm sm:text-base md:text-lg mb-8 sm:mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.6 }}
        >
          운이 아니라 ‘분석’을 통해 선택하는 사람들을 위해.
        </motion.p>

        {/* CTA 버튼 */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Link
            href="/analyze"
            className="inline-block bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl 
            text-base sm:text-lg font-bold shadow-lg hover:bg-blue-700 hover:shadow-xl 
            transition active:scale-95"
          >
            무료 분석 시작하기 →
          </Link>
        </motion.div>
      </div>
    </header>
  );
}
