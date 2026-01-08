"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <header className="bg-gradient-to-b from-blue-50 to-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-18 text-center">
        {/* 상단 Sub Text */}
        <motion.span
          className="inline-flex items-center gap-2 text-blue-700 font-semibold text-xs sm:text-sm mb-3 tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-600" />
          진짜 수동 로또 유저를 위한 데이터 기반 분석 서비스
        </motion.span>

        {/* 메인 타이틀 */}
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-snug sm:leading-tight mb-4"
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <span className="block sm:inline">운에 기대지 않는 선택</span> <br />
          <span className="block sm:inline">
            데이터를 해석하는 로또 분석 도구
          </span>
        </motion.h1>

        {/* 서브 타이틀 */}
        <motion.p
          className="text-gray-600 text-base sm:text-lg md:text-xl mb-5 max-w-md sm:max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          당첨 번호의 흐름과 변화 패턴,
          <br className="hidden sm:block" />
          장기·단기 통계를 균형 있게 분석해
          <br className="hidden sm:block" />
          의미 있는 정보만 정제해 제공합니다.
        </motion.p>

        {/* 신뢰 배지 */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <span className="px-3 py-1 rounded-full bg-white/80 border border-gray-200 text-xs text-gray-700">
            ✅ 통계 기반 분석
          </span>
          <span className="px-3 py-1 rounded-full bg-white/80 border border-gray-200 text-xs text-gray-700">
            ✅ 수동 선택 보조
          </span>
          <span className="px-3 py-1 rounded-full bg-white/80 border border-gray-200 text-xs text-gray-700">
            ✅ 당첨 보장 아님
          </span>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            href="/analyze"
            className="inline-flex items-center justify-center bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl 
            text-base sm:text-lg font-bold shadow-lg hover:bg-blue-700 hover:shadow-xl transition active:scale-95"
          >
            무료 분석 시작하기 →
          </Link>
        </motion.div>

        {/* 작은 보조 문구 */}
        <motion.p
          className="mt-4 text-xs sm:text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          ※ 본 서비스는 통계 기반 참고 자료이며, 당첨을 보장하지 않습니다.
        </motion.p>
      </div>
    </header>
  );
}
