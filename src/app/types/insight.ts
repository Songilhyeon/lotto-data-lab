export type RangeKey = "1-10" | "11-20" | "21-30" | "31-40" | "41-45";

export type TodayInsightType =
  | "CONSECUTIVE_DROP" // 직전 회차 대비 조합 급변
  | "RANGE_BIAS" // 특정 구간 쏠림
  | "HOT_NUMBER" // 최근 Hot 번호
  | "BALANCED"; // 뚜렷한 쏠림 없음

export interface TodayInsight {
  type: TodayInsightType;
  message: string;
}
