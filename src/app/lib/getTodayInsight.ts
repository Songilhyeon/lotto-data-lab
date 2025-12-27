import { TodayInsight } from "@/app/types/insight";
import { TODAY_INSIGHT_MESSAGE } from "@/app/lib/todayInsightMessages";
import { TodayInsightContext } from "./getTodayInsightContext";

export function getTodayInsight(ctx: TodayInsightContext): TodayInsight {
  // 1️⃣ 조합 급변 (최우선)
  if (ctx.hasConsecutiveDrop) {
    return {
      type: "CONSECUTIVE_DROP",
      message: TODAY_INSIGHT_MESSAGE.CONSECUTIVE_DROP,
    };
  }

  // 2️⃣ 구간 쏠림
  const rangeValues = Object.values(ctx.recentRanges);
  const max = Math.max(...rangeValues);
  const avg = rangeValues.reduce((a, b) => a + b, 0) / rangeValues.length;

  if (max >= avg * 1.4) {
    return {
      type: "RANGE_BIAS",
      message: TODAY_INSIGHT_MESSAGE.RANGE_BIAS,
    };
  }

  // 3️⃣ Hot 번호 존재
  if (ctx.recentHotNumbers.length > 0) {
    return {
      type: "HOT_NUMBER",
      message: TODAY_INSIGHT_MESSAGE.HOT_NUMBER,
    };
  }

  // 4️⃣ 균형
  return {
    type: "BALANCED",
    message: TODAY_INSIGHT_MESSAGE.BALANCED,
  };
}
