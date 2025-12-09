"use client";

import { motion } from "framer-motion";

export default function Hero() {
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
          진짜 수동 로또 유저를 위한 데이터 서비스
        </motion.span>

        {/* 메인 타이틀 */}
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          &quot;🟡 운에 기대지 않는 사람들을 위한
          <br />
          프리미엄 로또 분석 도구.&quot;
        </motion.h1>

        {/* 서브 타이틀 */}
        <motion.p
          className="text-gray-600 text-lg md:text-xl mb-4 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          당첨 번호의 흐름, 변화의 패턴, 장기·단기 통계의 균형… 모든 회차의
          데이터를 정밀하게 다듬어 ‘의미 있는 정보’만 제공합니다.
        </motion.p>

        {/* 프리미엄 차별점 */}
        <motion.p
          className="text-blue-600 font-semibold text-base md:text-lg mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.6 }}
        >
          운이 아니라 ‘근거’를 가지고 선택하는 사람들을 위해.
        </motion.p>
      </div>
    </header>
  );
}
