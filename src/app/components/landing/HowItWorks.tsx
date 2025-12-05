"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BarChart2, Target, Grid } from "lucide-react";

const steps = [
  {
    icon: <Grid className="w-10 h-10 text-blue-600" />,
    title: "1. 회차 선택",
    desc: "보고 싶은 회차만 선택하면 나머지는 자동 분석됩니다.",
  },
  {
    icon: <Target className="w-10 h-10 text-green-600" />,
    title: "2. 패턴 & 옵션 설정",
    desc: "보너스 포함 여부와 패턴 분석 세부 옵션을 설정해보세요.",
  },
  {
    icon: <BarChart2 className="w-10 h-10 text-rose-600" />,
    title: "3. 다양한 시각화로 확인",
    desc: "로또 용지 UI, 히트맵, 다음 회차 패턴 등 정교한 분석 제공.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10">
          어떻게 작동하나요?
        </h2>
        <p className="text-gray-600 text-lg mb-14 max-w-2xl mx-auto">
          로또 데이터 실험실은 모든 회차 데이터를 기반으로
          <strong className="text-blue-600 font-semibold">
            번호 패턴, 출현 빈도, 다음 회차 흐름
          </strong>
          을 자동 분석합니다.
        </p>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition text-center"
            >
              <div className="flex justify-center mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-14"
        >
          <Link
            href="/analyze"
            className="inline-block bg-blue-600 text-white px-10 py-4 rounded-xl text-lg font-semibold shadow-md hover:bg-blue-700 transition"
          >
            지금 바로 분석해보기
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
