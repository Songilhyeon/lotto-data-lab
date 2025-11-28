"use client";

import { motion } from "framer-motion";

const features = [
  {
    icon: "📊",
    title: "번호 등장 통계",
    desc: "최근 회차 번호 출현 빈도 확인",
  },
  {
    icon: "🎯",
    title: "홀/짝 & 패턴 분석",
    desc: "홀짝 비율과 번호 패턴 확인",
  },
  {
    icon: "📝",
    title: "로또 용지 시각화",
    desc: "로또 용지 스타일로 번호 시각화",
  },
];

export default function FeatureCards() {
  return (
    <div className="space-y-8">
      {features.map((f, i) => (
        <motion.div
          key={i}
          className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center text-center hover:shadow-lg transition"
          whileHover={{ scale: 1.03 }}
        >
          <div className="text-5xl mb-4">{f.icon}</div>
          <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
          <p className="text-gray-600">{f.desc}</p>
        </motion.div>
      ))}
    </div>
  );
}
