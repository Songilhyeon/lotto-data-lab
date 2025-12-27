import { TodayInsightType } from "@/app/types/insight";

export const TODAY_INSIGHT_MESSAGE: Record<TodayInsightType, string> = {
  CONSECUTIVE_DROP:
    "직전 회차와 비교했을 때 번호 겹침(연속 출현)이 적어, 다음 회차에서는 조합 변화가 크게 나타난 사례가 많았습니다.",

  RANGE_BIAS:
    "최근 흐름을 보면 특정 번호 구간에 출현이 집중되는 패턴이 나타나고 있습니다.",

  HOT_NUMBER:
    "최근 여러 회차에서 반복 등장한 번호들이 관측되고 있어, 다시 출현한 사례가 있었습니다.",

  BALANCED:
    "최근 회차들을 종합해 보면, 번호 구간이 비교적 고르게 분포된 흐름을 보이고 있습니다.",
};
