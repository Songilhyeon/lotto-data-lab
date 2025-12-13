export interface MethodStats {
  auto: number;
  semi: number;
  manual: number;
}

export interface TopStore {
  store: string;
  address: string;
  appearanceCount: number;
  autoWin: number;
  semiAutoWin: number;
  manualWin: number;
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
