"use client";
import Link from "next/link";

export default function HowItWorks() {
  return (
    <section className="bg-gray-100 py-16">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          분석 페이지 접근 방법
        </h2>
        <p className="text-gray-700 text-lg mb-4">1. 최근 N회 회차 선택</p>
        <p className="text-gray-700 text-lg mb-4">
          2. 정렬, 보너스 포함 여부, 패턴 분석 옵션 활용
        </p>
        <p className="text-gray-700 text-lg mb-8">
          3. 로또 용지 UI와 히트맵으로 번호별 등장 빈도 확인
        </p>
        <Link
          href="/analyze"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-blue-700 transition"
        >
          분석 페이지로 이동
        </Link>
      </div>
    </section>
  );
}
