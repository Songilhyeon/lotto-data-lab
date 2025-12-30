import { TodayInsight } from "@/app/types/insight";
import {
  TODAY_INSIGHT_MESSAGE,
  getHotNumberMessage,
  getRangeBiasMessage,
} from "@/app/lib/todayInsightMessages";
import { TodayInsightContext } from "./getTodayInsightContext";
import { analyzeRangeBias } from "@/app/utils/getInsightcalculator";

/** 구간 쏠림 판단 기준: 정규화 비율이 평균의 N배 이상 */
const RANGE_BIAS_THRESHOLD = 1.5;

/** Hot 번호 강도 판단 기준: N개 이상 */
const HOT_NUMBER_STRENGTH_THRESHOLD = 3;

/**
 * 수집된 컨텍스트를 바탕으로 최종 인사이트 결정
 *
 * 우선순위:
 * 1. 데이터 부족
 * 2. 조합 급변 (CONSECUTIVE_DROP)
 * 3. 강력한 Hot 번호 (5개 이상)
 * 4. 구간 쏠림 (RANGE_BIAS)
 * 5. 일반 Hot 번호 (3개 이상)
 * 6. 균형 상태 (BALANCED)
 */
export function getTodayInsight(ctx: TodayInsightContext): TodayInsight {
  // 1️⃣ 데이터 부족
  if (ctx.isInsufficientData) {
    return {
      type: "INSUFFICIENT_DATA",
      message: TODAY_INSIGHT_MESSAGE.INSUFFICIENT_DATA,
    };
  }

  // 2️⃣ 조합 급변 (최우선)
  if (ctx.hasConsecutiveDrop) {
    return {
      type: "CONSECUTIVE_DROP",
      message: TODAY_INSIGHT_MESSAGE.CONSECUTIVE_DROP,
    };
  }

  // Hot 번호 강도 계산
  const hotNumberCount = ctx.recentHotNumbers.length;

  // 3️⃣ 강력한 Hot 번호 (5개 이상이면 구간 쏠림보다 우선)
  if (hotNumberCount >= 5) {
    return {
      type: "HOT_NUMBER",
      message:
        TODAY_INSIGHT_MESSAGE.HOT_NUMBER +
        getHotNumberMessage(ctx.recentHotNumbers),
      hotNumbers: ctx.recentHotNumbers,
    };
  }

  // 4️⃣ 구간 쏠림
  const { maxRatio, avgRatio, biasedRange } = analyzeRangeBias(
    ctx.recentRanges
  );

  if (maxRatio >= avgRatio * RANGE_BIAS_THRESHOLD && biasedRange) {
    return {
      type: "RANGE_BIAS",
      message:
        TODAY_INSIGHT_MESSAGE.RANGE_BIAS + getRangeBiasMessage(biasedRange),
      biasedRange,
    };
  }

  // 5️⃣ 일반 Hot 번호 (3개 이상)
  if (hotNumberCount >= HOT_NUMBER_STRENGTH_THRESHOLD) {
    return {
      type: "HOT_NUMBER",
      message:
        TODAY_INSIGHT_MESSAGE.HOT_NUMBER +
        getHotNumberMessage(ctx.recentHotNumbers),
      hotNumbers: ctx.recentHotNumbers,
    };
  }

  // 6️⃣ 균형 (기본값)
  return {
    type: "BALANCED",
    message: TODAY_INSIGHT_MESSAGE.BALANCED,
  };
}
