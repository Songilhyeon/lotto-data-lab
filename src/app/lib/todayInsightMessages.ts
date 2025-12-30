import { TodayInsightType } from "@/app/types/insight";

/**
 * 인사이트 타입별 메시지
 *
 * 주의: 로또는 무작위 추첨이므로 과거 패턴이 미래를 예측하지 않습니다.
 * 메시지는 과거 경향을 설명하는 수준으로 작성되어야 합니다.
 */
export const TODAY_INSIGHT_MESSAGE: Record<TodayInsightType, string> = {
  CONSECUTIVE_DROP:
    "직전 회차와 비교했을 때 번호 겹침이 적어, 과거 이런 경우 다음 회차에서 조합이 크게 변화한 사례들이 있었습니다.",

  RANGE_BIAS:
    "최근 흐름을 보면 특정 번호 구간에서 출현이 집중되는 경향이 관찰되고 있습니다.",

  HOT_NUMBER:
    "최근 여러 회차에서 반복 등장한 번호들이 있으며, 과거에는 이러한 번호들이 다시 출현한 경우도 있었습니다.",

  BALANCED:
    "최근 회차들을 종합해 보면, 번호 구간이 비교적 고르게 분포된 흐름을 보이고 있습니다.",

  INSUFFICIENT_DATA:
    "분석에 충분한 회차 데이터가 부족합니다. 더 많은 추첨 결과가 쌓이면 인사이트를 제공할 수 있습니다.",
};

/**
 * Hot 번호가 있을 때 추가 정보 생성
 */
export function getHotNumberMessage(numbers: number[]): string {
  if (numbers.length === 0) return "";

  const numStr = numbers.join(", ");
  return ` (최다 출현: ${numStr})`;
}

/**
 * 구간 쏠림이 있을 때 추가 정보 생성
 */
export function getRangeBiasMessage(range: string): string {
  return ` (${range} 구간 집중)`;
}
