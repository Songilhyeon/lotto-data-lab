export type DefaultOptions = {
  includeBonus: boolean;
  recentWindow: number;
  clusterUnit: 5 | 7 | 10;
  similarityMode: "pattern" | "mixed";
  showAdvanced: boolean;
  rangeUnit: 5 | 7 | 10;
  rangeConditions: Array<{
    key: string;
    enabled: boolean;
    op: "eq" | "gte" | "lte";
    value: number;
  }>;
  includeNumbers: number[];
  excludeNumbers: number[];
  oddCount?: { op: "between"; min: number; max: number } | { op: "eq" | "gte" | "lte"; value: number };
  sum?: { op: "between"; min: number; max: number } | { op: "eq" | "gte" | "lte"; value: number };
  minNumber?: { op: "between"; min: number; max: number } | { op: "eq" | "gte" | "lte"; value: number };
  maxNumber?: { op: "between"; min: number; max: number } | { op: "eq" | "gte" | "lte"; value: number };
  consecutiveMode: "any" | "yes" | "no";
};

export type UserProfile = {
  displayName: string | null;
  favoriteNumbers: number[];
  avoidNumbers: number[];
  memoNumbers: number[];
  strategyMemo: string | null;
  defaultOptions: DefaultOptions;
  updatedAt: string;
};
