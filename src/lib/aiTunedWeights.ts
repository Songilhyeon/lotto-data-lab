import fs from "fs";
import path from "path";
import { AiScoreFeatureKey } from "./aiScoreBreakdown";

export type TunedWeightsFile = {
  version: string;
  model: string;
  clusterUnit: number;
  recent: number;
  weights: Record<AiScoreFeatureKey, number>;
  metrics?: Record<string, number>;
  seed?: number;
  trials?: number;
};

let cachedWeights: TunedWeightsFile | null = null;
let attemptedLoad = false;

export function loadWeights(): TunedWeightsFile | null {
  if (attemptedLoad) return cachedWeights;
  attemptedLoad = true;

  const weightsPath = path.resolve(process.cwd(), "data", "weights.json");
  if (!fs.existsSync(weightsPath)) {
    cachedWeights = null;
    return cachedWeights;
  }

  try {
    const raw = fs.readFileSync(weightsPath, "utf-8");
    cachedWeights = JSON.parse(raw) as TunedWeightsFile;
    return cachedWeights;
  } catch (err) {
    console.error("[aiTunedWeights] Failed to load weights.json", err);
    cachedWeights = null;
    return cachedWeights;
  }
}

export function getWeights(): TunedWeightsFile | null {
  if (!attemptedLoad) {
    return loadWeights();
  }
  return cachedWeights;
}
