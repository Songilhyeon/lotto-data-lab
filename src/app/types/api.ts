import { LottoDraw } from "@/app/types/lottoNumbers";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface NumberScoreDetail {
  num: number;
  hot: number;
  cold: number;
  streak: number;
  pattern: number;
  cluster: number;
  random: number;
  nextFreq: number;
  finalRaw: number; // ✅ 원본 점수
  final: number; // ✅ 정규화 점수 (0~100)
}

// 일반 AI 분석 점수 결과
export interface IfAiRecommendResult {
  round: number;
  recommended: number[];
  scores: NumberScoreDetail[];
  scoreList?: NumberScoreDetail[];
  generatedAt: string;
}

// NextFreq AI 분석 점수 결과
export interface IfAiNextFreqRecommendResult {
  combination: number[];
  details: NumberScoreDetail[];
  generatedAt: string;
  scores: NumberScoreDetail[];
}

export interface IfAiRecommendation {
  combination: number[];
  scores: NumberScoreDetail[];
  seed: number;
  nextRound?: LottoDraw | null;
}

export interface WeightConfig {
  hot: number;
  cold: number;
  streak: number;
  pattern: number;
  cluster: number;
  random: number;
  nextFreq: number;
}

// -----------------------------
// Preset 예시
// -----------------------------
export interface AiPreset {
  name: string;
  weight: WeightConfig;
}

export const AiPresets: AiPreset[] = [
  {
    name: "안정형",
    weight: {
      hot: 2,
      cold: 1,
      streak: 1,
      pattern: 1,
      cluster: 1,
      random: 0,
      nextFreq: 2,
    },
  },
  {
    name: "고위험형",
    weight: {
      hot: 1,
      cold: 2,
      streak: 1,
      pattern: 2,
      cluster: 1,
      random: 1,
      nextFreq: 1,
    },
  },
  {
    name: "패턴형",
    weight: {
      hot: 1,
      cold: 1,
      streak: 1,
      pattern: 3,
      cluster: 2,
      random: 0,
      nextFreq: 2,
    },
  },
];

export interface AiScoreBase {
  num: number;

  /** 내부 계산 점수 (raw) */
  finalRaw: number;

  /** UI 표시용 점수 (0~100) */
  final: number;

  // --------------------
  // 공통 feature
  // --------------------
  hot?: number;
  cold?: number;

  // streak
  streakRun?: number; // Independent
  streak?: number; // Next / Advanced

  // pattern
  patternScore?: number; // Independent
  pattern?: number; // Next / Advanced

  // cluster / density
  density?: number; // Independent
  cluster?: number; // Next / Advanced

  // decay
  decayScore?: number;

  // random
  noise?: number;
  random?: number;

  // next-round
  nextFreq?: number;
}

export type PerNumberRow = {
  num: number;
  latestPattern: string | null;
  patternSampleCount: number;
  appearCount: number;
  currentGap: number | null;
  lastGap: number | null;
};
