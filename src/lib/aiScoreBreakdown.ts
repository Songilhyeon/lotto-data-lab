import { analyzePremiumRound } from "./premiumAnalyzer";
import { PremiumAnalysisResult } from "./premiumAnalyzer";

export type AiScoreFeatureKey =
  | "perNumber"
  | "kMatch"
  | "pattern"
  | "recent"
  | "oddEven"
  | "sumRange"
  | "zone";

export const AI_SCORE_FEATURE_KEYS: AiScoreFeatureKey[] = [
  "perNumber",
  "kMatch",
  "pattern",
  "recent",
  "oddEven",
  "sumRange",
  "zone",
];

type FeatureMap = Record<AiScoreFeatureKey, number>;

const getPatternWeights = (clusterUnit: number) => {
  if (clusterUnit >= 9) return { w10: 0.6, w7: 0.3, w5: 0.1 };
  if (clusterUnit >= 7) return { w10: 0.3, w7: 0.5, w5: 0.2 };
  return { w10: 0.2, w7: 0.3, w5: 0.5 };
};

const oddEvenScore = (
  num: number,
  oddEven?: { odd: number; even: number; ratio: number }
) => {
  if (!oddEven) return 0.5;
  const isOdd = num % 2 === 1;
  return isOdd ? oddEven.ratio : 1 - oddEven.ratio;
};

const toSelectedNumbers = (analysis: PremiumAnalysisResult) => {
  const per = analysis.perNumberNextFreq ?? {};
  return Object.keys(per).length ? Object.keys(per).map(Number) : [];
};

export async function buildAiScoreBreakdown(
  round: number,
  clusterUnit = 5,
  recentCount = 20
): Promise<{
  round: number;
  featuresByNumber: Array<{ num: number; features: FeatureMap }>;
}> {
  const analysis = await analyzePremiumRound(round, false, recentCount);
  const { w10, w7, w5 } = getPatternWeights(clusterUnit);

  const per = analysis.perNumberNextFreq ?? {};
  const km = analysis.kMatchNextFreq ?? {
    "1": {},
    "2": {},
    "3": {},
    "4+": {},
  };
  const p10 = analysis.pattern10NextFreq ?? {};
  const p7 = analysis.pattern7NextFreq ?? {};
  const p5 = analysis.pattern5NextFreq ?? {};
  const recent = analysis.recentFreq ?? {};
  const oddEven = analysis.oddEvenNextFreq;
  const sumRange = analysis.sumRangeNextFreq;
  const zone = analysis.zoneNextFreq;

  const selectedNums = toSelectedNumbers(analysis);

  const featuresByNumber: Array<{ num: number; features: FeatureMap }> = [];

  for (let num = 1; num <= 45; num++) {
    let perNumberValue = 0;
    if (selectedNums.length > 0) {
      let sum = 0;
      for (const sel of selectedNums) {
        sum += per[sel]?.[num] ?? 0;
      }
      perNumberValue = sum / selectedNums.length;
    }

    const kMatchValue =
      (km["1"]?.[num] ?? 0) * 0.7 +
      (km["2"]?.[num] ?? 0) * 0.2 +
      (km["3"]?.[num] ?? 0) * 0.1 +
      (km["4+"]?.[num] ?? 0) * 0.05;

    const patternValue =
      (p10[num] ?? 0) * w10 + (p7[num] ?? 0) * w7 + (p5[num] ?? 0) * w5;

    const recentValue = recent[num] ?? 0;
    const oddEvenValue = oddEvenScore(num, oddEven);

    const sumRangeValue = sumRange
      ? (sumRange.low?.[num] ?? 0) +
        (sumRange.mid?.[num] ?? 0) +
        (sumRange.high?.[num] ?? 0)
      : 0;

    const zoneKey = num <= 15 ? "low" : num <= 30 ? "mid" : "high";
    const zoneValue = zone ? zone[zoneKey]?.[num] ?? 0 : 0;

    featuresByNumber.push({
      num,
      features: {
        perNumber: perNumberValue,
        kMatch: kMatchValue,
        pattern: patternValue,
        recent: recentValue,
        oddEven: oddEvenValue,
        sumRange: sumRangeValue,
        zone: zoneValue,
      },
    });
  }

  return {
    round: analysis.round,
    featuresByNumber,
  };
}
