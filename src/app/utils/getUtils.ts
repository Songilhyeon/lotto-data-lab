export const getLatestRound = (): number => {
  // 1. 첫 회차 (로컬 시간 기준, KST)
  const firstDraw = new Date(2002, 11, 7, 21, 0, 0); // 월은 0부터 시작 (11 = 12월)
  // 2. 현재 시간
  const now = new Date();

  // 3. 이번 주 토요일 21:00
  const day = now.getDay(); // 0=일, 6=토
  const diff = 6 - day; // 토요일까지 남은 일수
  const thisSaturday = new Date(now);
  thisSaturday.setDate(now.getDate() + diff);
  thisSaturday.setHours(21, 5, 0, 0); // 21:05:00.000, 서버보다 5분 늦게 회차 갱신

  // 4. 만약 현재 시간이 토요일 21:00 이후라면 이번 주 회차 포함
  const referenceDate =
    now >= thisSaturday
      ? thisSaturday
      : new Date(thisSaturday.getTime() - 7 * 24 * 60 * 60 * 1000);

  // 5. 지난 토요일 기준 주 수 계산
  const weeksSinceFirst = Math.floor(
    (referenceDate.getTime() - firstDraw.getTime()) / (7 * 24 * 60 * 60 * 1000)
  );

  // 6. 1회차부터 시작이므로 +1
  return weeksSinceFirst + 1;
};

const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL;
export const apiUrl = getApiUrl();

export const cardWidth = "w-full max-w-xl";

export const formatNumber = (num: number) => {
  return new Intl.NumberFormat("ko-KR").format(num);
};
