import Link from "next/link";
import { apiUrl, getLatestRound } from "@/app/utils/getUtils";
import { LottoNumber } from "@/app/types/lottoNumbers";

interface LottoNumberResponse {
  data: LottoNumber;
}

async function fetchLatestRoundSafe(): Promise<LottoNumberResponse | null> {
  if (!apiUrl) return null;

  try {
    const res = await fetch(`${apiUrl}/lotto/round/${getLatestRound()}`, {
      next: { revalidate: 60 * 60 }, // 1시간
    });

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function HomeDashboardSummary() {
  const latest = await fetchLatestRoundSafe();

  return (
    <section className="bg-gray-50 border-y">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
          로또 데이터 한눈에 보기
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* 최신 회차 */}
          <div className="bg-white rounded-xl border p-5 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">최신 회차</p>

            {latest ? (
              <>
                <p className="text-2xl font-bold text-gray-900">
                  {latest.data.drwNo}회
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  추첨일{" "}
                  {new Date(latest.data.drwNoDate).toLocaleDateString("ko-KR")}
                </p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold text-gray-900">-</p>
                <p className="text-xs text-gray-500 mt-1">
                  최신 회차 데이터를 불러오는 중입니다.
                </p>
              </>
            )}

            <Link
              href="/analyze"
              className="inline-block mt-3 text-sm text-blue-600 font-medium hover:underline"
            >
              전체 회차 보기 →
            </Link>
          </div>

          {/* AI 분석 */}
          <div className="bg-white rounded-xl border p-5 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">AI 점수 분석</p>
            <p className="text-lg font-semibold text-gray-900">
              패턴 · 빈도 · 연속 출현
            </p>
            <p className="text-xs text-gray-500 mt-1">
              과거 데이터 기반 점수 계산
            </p>
            <Link
              href="/ai-recommend"
              className="inline-block mt-3 text-sm text-blue-600 font-medium hover:underline"
            >
              AI 분석 점수 보기 →
            </Link>
          </div>

          {/* 통계 */}
          <div className="bg-white rounded-xl border p-5 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">번호 통계</p>
            <p className="text-lg font-semibold text-gray-900">
              출현 빈도 · 구간 분포
            </p>
            <p className="text-xs text-gray-500 mt-1">
              최근 회차 기반 통계 분석
            </p>
            <Link
              href="/analyze?tab=numberFrequency"
              className="inline-block mt-3 text-sm text-blue-600 font-medium hover:underline"
            >
              통계 상세 →
            </Link>
          </div>

          {/* 당첨 판매점 */}
          <div className="bg-white rounded-xl border p-5 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">당첨 판매점</p>
            <p className="text-lg font-semibold text-gray-900">
              1·2등 판매점 분석
            </p>
            <p className="text-xs text-gray-500 mt-1">
              지역 · 자동/수동 · 누적
            </p>
            <Link
              href="/winner-stores"
              className="inline-block mt-3 text-sm text-blue-600 font-medium hover:underline"
            >
              판매점 보기 →
            </Link>
          </div>
        </div>

        {/* SEO 보강용 설명 문단 */}
        <p className="mt-8 text-sm text-gray-600 leading-relaxed">
          Lotto Data Lab은 로또 회차별 당첨 번호 데이터를 기반으로 번호 출현
          빈도, 연속 출현 패턴, AI 기반 점수 분석, 1·2등 당첨 판매점 통계를
          제공하는 데이터 분석 서비스입니다.
        </p>
      </div>
    </section>
  );
}
