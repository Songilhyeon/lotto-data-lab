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
}

export interface AnalysisResult extends LottoNumber {
  numbers: number[];
  highlightMost: boolean;
  highlightLeast: boolean;
  highlightCurrent: boolean;
}
