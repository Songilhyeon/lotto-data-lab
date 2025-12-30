import { LottoNumber } from "../types/lottoNumbers";
import { RangeKey } from "@/app/types/insight";

/**
 * 로또 회차에서 당첨 번호 6개를 배열로 추출
 */
export function getNumbers(r: LottoNumber): number[] {
  const numbers = [
    r.drwtNo1,
    r.drwtNo2,
    r.drwtNo3,
    r.drwtNo4,
    r.drwtNo5,
    r.drwtNo6,
  ];

  // 데이터 검증
  const validNumbers = numbers.filter(
    (n) => Number.isInteger(n) && n >= 1 && n <= 45
  );

  if (validNumbers.length !== 6) {
    console.warn("Invalid lotto numbers detected:", numbers);
  }

  return validNumbers;
}

/**
 * 최근 회차들의 구간별 출현 횟수 계산
 */
export function calcRangeStats(
  rounds: LottoNumber[]
): Record<RangeKey, number> {
  const result: Record<RangeKey, number> = {
    "1-10": 0,
    "11-20": 0,
    "21-30": 0,
    "31-40": 0,
    "41-45": 0,
  };

  for (const r of rounds) {
    for (const n of getNumbers(r)) {
      if (n <= 10) result["1-10"]++;
      else if (n <= 20) result["11-20"]++;
      else if (n <= 30) result["21-30"]++;
      else if (n <= 40) result["31-40"]++;
      else result["41-45"]++;
    }
  }

  return result;
}

/**
 * 최근 회차에서 자주 출현한 Hot 번호 추출
 * @param rounds 분석할 회차 데이터
 * @param topN 상위 N개 번호
 * @param minFrequency 최소 출현 횟수 (undefined시 자동 계산)
 */
export function calcHotNumbers(
  rounds: LottoNumber[],
  topN = 5,
  minFrequency?: number
): number[] {
  if (rounds.length === 0) return [];

  // 자동 임계값: 회차 수의 30% 이상, 최소 2회
  const threshold =
    minFrequency ?? Math.max(2, Math.floor(rounds.length * 0.3));

  const freq = new Map<number, number>();

  for (const r of rounds) {
    for (const n of getNumbers(r)) {
      freq.set(n, (freq.get(n) || 0) + 1);
    }
  }

  const candidates = Array.from(freq.entries())
    .filter(([_, count]) => count >= threshold)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN);

  return candidates.map(([number, _]) => number);
}

/**
 * 직전 회차와 비교해 번호 겹침이 적은지 확인 (조합 급변)
 * @param rounds 분석할 회차 데이터
 * @param threshold 급변 기준 (이하 겹침 개수)
 */
export function detectConsecutiveDrop(
  rounds: LottoNumber[],
  threshold = 2
): boolean {
  if (rounds.length < 2) return false;

  // 최신 2개 회차 비교
  const prev = rounds[rounds.length - 2];
  const curr = rounds[rounds.length - 1];

  const prevSet = new Set(getNumbers(prev));
  const currNums = getNumbers(curr);

  const matchCount = currNums.filter((n) => prevSet.has(n)).length;

  // threshold개 이하 겹치면 급변으로 판단
  return matchCount <= threshold;
}

/**
 * 구간별 쏠림 정도를 정규화된 비율로 계산
 * @returns { maxRatio, avgRatio, biasedRange }
 */
export function analyzeRangeBias(rangeStats: Record<RangeKey, number>): {
  maxRatio: number;
  avgRatio: number;
  biasedRange: RangeKey | null;
} {
  const RANGE_WEIGHTS: Record<RangeKey, number> = {
    "1-10": 10,
    "11-20": 10,
    "21-30": 10,
    "31-40": 10,
    "41-45": 5,
  };

  const normalized = (Object.entries(rangeStats) as [RangeKey, number][]).map(
    ([key, count]) => ({
      range: key,
      ratio: count / RANGE_WEIGHTS[key],
    })
  );

  const maxEntry = normalized.reduce((max, curr) =>
    curr.ratio > max.ratio ? curr : max
  );

  const avgRatio =
    normalized.reduce((sum, n) => sum + n.ratio, 0) / normalized.length;

  return {
    maxRatio: maxEntry.ratio,
    avgRatio,
    biasedRange: maxEntry.range,
  };
}
