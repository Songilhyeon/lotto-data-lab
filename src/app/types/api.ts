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
  nextFreq?: number;
  final: number;
}

// 일반 AI 추천 결과
export interface IfAiRecommendResult {
  round: number;
  recommended: number[];
  scores: NumberScoreDetail[];
  scoreList?: NumberScoreDetail[];
  generatedAt: string;
}

// NextFreq AI 추천 결과
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
}
