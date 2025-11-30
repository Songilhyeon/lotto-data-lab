export const getLatestRound = () => {
  const firstDraw = new Date("2002-12-07T21:00:00"); // 첫 회차 발표 시간 포함

  const now = new Date();

  // 이번 주 토요일 21:00
  const sat = new Date(now);
  const day = sat.getDay(); // 0=일, 6=토
  const diff = 6 - day; // 이번 주 토요일까지 남은 일수
  sat.setDate(sat.getDate() + diff);
  sat.setHours(21, 0, 0, 0);

  // 지난 토요일 수 계산
  const weeksSinceFirst = Math.floor(
    (sat.getTime() - firstDraw.getTime()) / (7 * 24 * 60 * 60 * 1000)
  );

  return weeksSinceFirst;
};

const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL;
export const apiUrl = getApiUrl();
