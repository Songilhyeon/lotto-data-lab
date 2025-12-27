import { LottoNumber } from "./../types/lottoNumbers";
import { RangeKey } from "@/app/types/insight";

export function getNumbers(r: LottoNumber): number[] {
  return [r.drwtNo1, r.drwtNo2, r.drwtNo3, r.drwtNo4, r.drwtNo5, r.drwtNo6];
}

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

export function calcHotNumbers(rounds: LottoNumber[], topN = 5): number[] {
  const freq = Array(46).fill(0);

  for (const r of rounds) {
    for (const n of getNumbers(r)) {
      freq[n]++;
    }
  }

  return freq
    .map((count, number) => ({ number, count }))
    .filter((v) => v.number > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, topN)
    .map((v) => v.number);
}

export function detectConsecutiveDrop(rounds: LottoNumber[]): boolean {
  if (rounds.length < 2) return false;

  const prev = rounds[rounds.length - 2];
  const curr = rounds[rounds.length - 1];

  const prevSet = new Set(getNumbers(prev));
  const currNums = getNumbers(curr);

  const matchCount = currNums.filter((n) => prevSet.has(n)).length;

  // 0~1개만 겹치면 급변
  return matchCount <= 1;
}
