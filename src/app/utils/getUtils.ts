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
  thisSaturday.setHours(21, 35, 0, 0); // 21:35:00.000, 서버보다 5분 늦게 회차 갱신

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

export function getAddressInfo(address?: string) {
  if (!address) {
    return { type: "EMPTY" as const };
  }

  if (address.includes("동행복권") || address.includes("dhlottery")) {
    return { type: "ONLINE" as const };
  }

  return { type: "NORMAL" as const };
}

export function getAnomalyLevel(score: number) {
  if (score >= 85) {
    return {
      label: "매우 특이",
      badge: "bg-red-100 text-red-700",
      bar: "bg-red-500",
    };
  }

  if (score >= 65) {
    return {
      label: "눈에 띔",
      badge: "bg-yellow-100 text-yellow-700",
      bar: "bg-yellow-500",
    };
  }

  return {
    label: "일반",
    badge: "bg-gray-100 text-gray-600",
    bar: "bg-gray-400",
  };
}

export function patternLabel(type: string) {
  switch (type) {
    case "RECENT_SPIKE":
      return "🔥 최근 급등";
    case "LONG_DORMANT":
      return "🧊 장기 공백";
    case "PROMOTION_2_TO_1":
      return "🔁 2→1 전환";
    case "HIGH_MANUAL_RATIO":
      return "🎯 수동 집중";
    default:
      return type;
  }
}
