"use client";

import { motion } from "framer-motion";
import { BarChart2, Percent, Scan, Cpu } from "lucide-react";

const features = [
  {
    icon: <BarChart2 className="w-10 h-10 text-blue-600" />,
    title: "번호 등장 통계",
    desc: "최근 회차 번호 출현 빈도 및 트렌드를 즉시 파악하세요.",
  },
  {
    icon: <Percent className="w-10 h-10 text-green-600" />,
    title: "홀짝 & 패턴 분석",
    desc: "홀짝 비율과 패턴 흐름을 시각적으로 제공합니다.",
  },
  {
    icon: <Scan className="w-10 h-10 text-purple-600" />,
    title: "로또 용지 시각화",
    desc: "번호를 실제 로또 용지 형태로 직관적으로 확인할 수 있습니다.",
  },
  {
    icon: <Cpu className="w-10 h-10 text-red-600" />,
    title: "AI 번호 분석",
    desc: "AI 기반 번호 점수와 패턴 점수를 확인하고 전략적인 선택을 돕습니다.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const card = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export default function FeatureCards() {
  return (
    <motion.div
      className="space-y-8"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      {features.map((f, i) => (
        <motion.div
          key={i}
          variants={card}
          whileHover={{
            scale: 1.05,
            rotateX: 6,
            rotateY: -6,
            boxShadow: "0px 12px 25px rgba(0,0,0,0.15)",
          }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="bg-white rounded-xl p-7 shadow-md flex flex-col items-center text-center
          border border-gray-100 hover:border-blue-500/40 hover:shadow-blue-200"
        >
          <div className="mb-4">{f.icon}</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {f.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
