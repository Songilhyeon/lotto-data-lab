"use client";

import { useState } from "react";
import Link from "next/link";
import LottoCard from "./components/LottoCard";

export default function Home() {
  const [round, setRound] = useState(1198);

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center py-4">
          <div className="text-2xl font-bold text-blue-600">Lotto Data Lab</div>
          <div className="hidden md:flex space-x-8 text-sm font-medium">
            <Link className="text-blue-600" href="/Home">
              홈
            </Link>
            <Link className="hover:text-blue-600 transition" href="/analyze">
              번호 분석
            </Link>
            <Link className="hover:text-blue-600 transition" href="/history">
              히스토리
            </Link>
            <Link className="hover:text-blue-600 transition" href="/pattern">
              패턴
            </Link>
            <Link className="hover:text-blue-600 transition" href="/faq">
              FAQ
            </Link>
          </div>
        </div>
      </nav>

      <button
        onClick={() => setRound((prev) => prev - 1)}
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        이전 회차
      </button>

      <button
        onClick={() => setRound((prev) => prev + 1)}
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        다음 회차
      </button>

      {/* 서버 컴포넌트 호출 가능 */}
      <LottoCard round={round} />

      {/* Statistics Card */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
          <h3 className="text-lg font-semibold mb-2">가장 자주 나온 번호</h3>
          <p className="text-3xl font-bold text-blue-600">23</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
          <h3 className="text-lg font-semibold mb-2">가장 적게 나온 번호</h3>
          <p className="text-3xl font-bold text-red-500">7</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
          <h3 className="text-lg font-semibold mb-2">평균 당첨 번호</h3>
          <p className="text-3xl font-bold text-gray-700">28.3</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-bold text-white mb-4">서비스</h4>
            <ul className="space-y-2">
              <li>
                <a className="hover:text-blue-400" href="/analyze">
                  번호 분석
                </a>
              </li>
              <li>
                <a className="hover:text-blue-400" href="/history">
                  히스토리 트래커
                </a>
              </li>
              <li>
                <a className="hover:text-blue-400" href="/pattern">
                  패턴 인사이트
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">고객지원</h4>
            <ul className="space-y-2">
              <li>
                <a className="hover:text-blue-400" href="/faq">
                  FAQ
                </a>
              </li>
              <li>
                <a className="hover:text-blue-400" href="/contact">
                  문의하기
                </a>
              </li>
              <li>
                <a className="hover:text-blue-400" href="/privacy">
                  개인정보처리방침
                </a>
              </li>
            </ul>
          </div>

          <div className="text-sm text-gray-400">
            © 2024 로또인사이트. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
