export interface MethodStats {
  auto: number;
  semi: number;
  manual: number;
}

export interface TopStore {
  store: string;
  address: string;
  appearanceCount: number;
  autoWin?: number;
  semiAutoWin?: number;
  manualWin?: number;
}

export interface RegionStat {
  region: string;
  regionCount: number;
}

export interface SubRegionStat {
  subRegion: string;
  regionCount: number;
}

export interface ByRegionItem {
  tops: TopStore[];
  method: MethodStats;
  region: RegionStat[];
  subRegionStats: SubRegionStat[];
}

export interface WinnerStoresApiResponse {
  nationwide: {
    tops: TopStore[];
    region: RegionStat[];
    method: MethodStats;
  };
  byRegion: Record<string, ByRegionItem>;
}

export interface RoundStore {
  store: string;
  address: string;
  region: string;
  method: "자동" | "수동" | "반자동";
}

export interface LottoStore {
  drwNo: number;
  store: string;
  address: string;
  rank: number;
  autoWin: number | null;
  semiAutoWin: number | null;
  manualWin: number | null;
}

export interface LottoStoreHistory {
  round: number;
  autoWin: number;
  semiAutoWin: number;
  manualWin: number;
}

export interface StoreHistoryItem {
  round: number;
  autoWin: number;
  semiAutoWin: number;
  manualWin: number;
}
