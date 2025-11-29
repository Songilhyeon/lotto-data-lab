export const getLatestRound = () => {
  // 회차 계산 기준일은 발표시간이 아니라 토요일 00:00 기반이어야 함
  const firstDrawDate = new Date("2002-12-07T00:00:00+09:00");
  const now = new Date();

  // 기본 회차 계산
  const diffWeeks =
    Math.floor(
      (now.getTime() - firstDrawDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
    ) + 1;

  // 이번 주 토요일 21:00(발표 종료 시점) 계산
  const announceTime = (() => {
    const sat = new Date(now);
    const day = sat.getDay(); // 0=일, 6=토
    const diff = (6 - day + 7) % 7;
    sat.setDate(sat.getDate() + diff);
    sat.setHours(21, 0, 0, 0);
    return sat;
  })();

  // 발표시간 전이면 아직 이전 회차가 최신 회차
  if (now < announceTime) {
    return diffWeeks - 1;
  }

  return diffWeeks;
};

const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL;

export const apiUrl = getApiUrl();
