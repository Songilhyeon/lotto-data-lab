export function getIntervalKey(num: number, size: number) {
  const start = Math.floor((num - 1) / size) * size + 1;
  const end = Math.min(start + size - 1, 45); // ✅ 핵심
  return `${start}-${end}`;
}

export function buildIntervalEnsemble(
  ensemble: { num: number; score: number }[],
  size: number,
  sortByScore = false
) {
  const map = new Map<string, number[]>();

  ensemble.forEach(({ num, score }) => {
    const key = getIntervalKey(num, size);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(Number(score)); // ✅ ① 여기서 보정
  });

  const result = Array.from(map.entries()).map(([interval, scores]) => ({
    interval,
    score: scores.reduce((a, b) => a + b, 0) / scores.length, // a,b 둘 다 number
  }));

  return sortByScore ? result.sort((a, b) => b.score - a.score) : result;
}

// --------------------------------------------------
// 1~45 번호별 출현 회차 Map 생성
// --------------------------------------------------
export function getAppearMap(rounds: { drwNo: number; numbers: number[] }[]) {
  const map = new Map<number, number[]>();

  // 1~45 초기화
  for (let n = 1; n <= 45; n++) {
    map.set(n, []);
  }

  // 각 회차 번호별로 출현 회차 기록
  for (const round of rounds) {
    for (const num of round.numbers) {
      map.get(num)!.push(round.drwNo);
    }
  }

  return map; // Map<number, number[]>
}

export function getCurrentGapExcludingRound(
  num: number,
  baseRound: number,
  appearMap: Map<number, number[]> // 미리 만들어서 전달
): number | null {
  const rounds = appearMap.get(num);
  if (!rounds || rounds.length === 0) return null;

  const filteredRounds = rounds.filter((r) => r !== baseRound);
  if (!filteredRounds.length) return null;

  const lastRound = filteredRounds[filteredRounds.length - 1];
  return baseRound - lastRound;
}
