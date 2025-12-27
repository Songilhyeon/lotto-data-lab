import { apiUrl, getLatestRound } from "@/app/utils/getUtils";
import {
  calcRangeStats,
  calcHotNumbers,
  detectConsecutiveDrop,
} from "@/app/utils/getInsightcalculator";
import { LottoNumber } from "@/app/types/lottoNumbers";
import { RangeKey } from "@/app/types/insight";

export interface TodayInsightContext {
  /** 직전 회차 ↔ 이전 회차 번호 겹침이 적었는지 */
  hasConsecutiveDrop: boolean;

  /** 최근 10회 전체 번호 구간 분포 */
  recentRanges: Record<RangeKey, number>;

  /** 최근 10회 가장 많이 나온 번호 */
  recentHotNumbers: number[];
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
        latestRound - 9
      }&end=${latestRound}&includeBonus=false`,
      {
        next: { revalidate: 60 * 60 }, // 1시간 캐시
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch today insight data");
    }

    const json = await res.json();
    const recent: LottoNumber[] = json.data ?? [];

    // 데이터 부족 방어 (10회 미만이어도 계산은 가능)
    if (recent.length === 0) {
      return {
        recentRanges: EMPTY_RANGES,
        recentHotNumbers: [],
        hasConsecutiveDrop: false,
      };
    }

    return {
      recentRanges: calcRangeStats(recent),
      recentHotNumbers: calcHotNumbers(recent),
      hasConsecutiveDrop: detectConsecutiveDrop(recent),
    };
  } catch (err) {
    console.error("[getTodayInsightContext]", err);

    return {
      recentRanges: EMPTY_RANGES,
      recentHotNumbers: [],
      hasConsecutiveDrop: false,
    };
  }
}
