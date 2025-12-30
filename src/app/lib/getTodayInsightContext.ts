import { apiUrl, getLatestRound } from "@/app/utils/getUtils";
import {
  calcRangeStats,
  calcHotNumbers,
  detectConsecutiveDrop,
} from "@/app/utils/getInsightcalculator";
import { LottoNumber } from "@/app/types/lottoNumbers";
import { RangeKey } from "@/app/types/insight";

/** 인사이트 생성에 필요한 최소 회차 수 */
const MIN_ROUNDS_FOR_INSIGHT = 5;

/** 분석에 사용할 최근 회차 수 */
const ANALYSIS_ROUNDS = 10;

export interface TodayInsightContext {
  /** 직전 회차 ↔ 이전 회차 번호 겹침이 적었는지 */
  hasConsecutiveDrop: boolean;

  /** 최근 N회 전체 번호 구간 분포 */
  recentRanges: Record<RangeKey, number>;

  /** 최근 N회 가장 많이 나온 번호 */
  recentHotNumbers: number[];

  /** 데이터 부족 여부 */
  isInsufficientData: boolean;

  /** 분석에 사용된 실제 회차 수 */
  analyzedRounds: number;
}

const EMPTY_RANGES: Record<RangeKey, number> = {
  "1-10": 0,
  "11-20": 0,
  "21-30": 0,
  "31-40": 0,
  "41-45": 0,
};

export async function getTodayInsightContext(): Promise<TodayInsightContext> {
  try {
    const latestRound = await getLatestRound();

    const res = await fetch(
      `${apiUrl}/lotto/rounds?start=${
        latestRound - (ANALYSIS_ROUNDS - 1)
      }&end=${latestRound}&includeBonus=false`,
      {
        next: { revalidate: 60 * 60 }, // 1시간 캐시
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch insight data: ${res.status}`);
    }

    const json = await res.json();
    const recent: LottoNumber[] = json.data ?? [];

    // 데이터 부족 체크
    if (recent.length < MIN_ROUNDS_FOR_INSIGHT) {
      console.warn(
        `Insufficient data for insight: ${recent.length} rounds (min: ${MIN_ROUNDS_FOR_INSIGHT})`
      );

      return {
        recentRanges: EMPTY_RANGES,
        recentHotNumbers: [],
        hasConsecutiveDrop: false,
        isInsufficientData: true,
        analyzedRounds: recent.length,
      };
    }

    // 데이터 정렬 확인 (최신순 정렬 필요)
    const sorted = [...recent].sort((a, b) => a.drwNo - b.drwNo);

    return {
      recentRanges: calcRangeStats(sorted),
      recentHotNumbers: calcHotNumbers(sorted),
      hasConsecutiveDrop: detectConsecutiveDrop(sorted),
      isInsufficientData: false,
      analyzedRounds: sorted.length,
    };
  } catch (err) {
    console.error("[getTodayInsightContext] Error:", err);

    // 에러 시 안전한 기본값 반환
    return {
      recentRanges: EMPTY_RANGES,
      recentHotNumbers: [],
      hasConsecutiveDrop: false,
      isInsufficientData: true,
      analyzedRounds: 0,
    };
  }
}
