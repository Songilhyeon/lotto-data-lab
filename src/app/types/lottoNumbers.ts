export interface LottoNumber {
  drwNo: number;
  drwNoDate: Date;
  drwtNo1: number;
  drwtNo2: number;
  drwtNo3: number;
  drwtNo4: number;
  drwtNo5: number;
  drwtNo6: number;
  bnusNo: number;
  firstPrzwnerCo: string;
  firstWinamnt: string;
  totSellamnt: string;
  firstAccumamnt: string;

  autoWin: number | null;
  semiAutoWin: number | null;
  manualWin: number | null;
}

export interface AnalysisResult extends LottoNumber {
  numbers: number[];
  highlightMost: boolean;
  highlightLeast: boolean;
  highlightCurrent: boolean;
}

export interface LottoDraw {
  round: number;
  numbers: number[];
  bonus?: number;
}

export interface PremiumAnalysisData {
  round: number;
  bonusIncluded: boolean;

  /** 단일 번호 -> 다음 회차 전체 출현 빈도 (Record<number, number>) */
  perNumberNextFreq: Record<number, number>;

  /** k-매치 */
  kMatchNextFreq: {
    "1": Record<number, number>;
    "2": Record<number, number>;
    "3": Record<number, number>;
    "4+": Record<number, number>;
  };

  /** 패턴 */
  pattern10NextFreq: Record<number, number>;
  pattern7NextFreq: Record<number, number>;
  pattern5NextFreq: Record<number, number>;

  /** 최근 N회 */
  recentFreq: Record<number, number>;

  /** 다음 회차 번호 배열 */
  nextRound: number[] | null;

  generatedAt: string;
}

export interface NumberScoreDetail {
  num: number;
  hot: number;
  cold: number;
  streak: number;
  pattern: number;
  cluster: number;
  random: number;
  final: number;
}
