import fs from "fs";
import path from "path";
import { initializeLottoCache } from "../lib/lottoCache";
import { initializePremiumCache } from "../lib/premiumCache";
import { sortedLottoCache } from "../lib/lottoCache";
import { buildAiScoreBreakdown } from "../lib/aiScoreBreakdown";
import { prisma } from "../app";

const getArgValue = (args: string[], key: string) => {
  const flag = `--${key}`;
  const direct = args.find((arg) => arg.startsWith(`${flag}=`));
  if (direct) return direct.split("=").slice(1).join("=");
  const idx = args.indexOf(flag);
  if (idx !== -1 && idx + 1 < args.length) return args[idx + 1];
  return undefined;
};

async function main() {
  const args = process.argv.slice(2);
  const startRaw = getArgValue(args, "start");
  const endRaw = getArgValue(args, "end");
  const outRaw = getArgValue(args, "out") ?? "data/trainset.jsonl";
  const clusterUnitRaw = getArgValue(args, "clusterUnit");
  const recentRaw = getArgValue(args, "recent");

  const start = Number(startRaw);
  const end = Number(endRaw);
  const clusterUnit = clusterUnitRaw ? Number(clusterUnitRaw) : 5;
  const recent = recentRaw ? Number(recentRaw) : 20;

  if (!Number.isInteger(start) || start < 1) {
    throw new Error("Invalid --start. Use an integer >= 1.");
  }
  if (!Number.isInteger(end) || end < start) {
    throw new Error("Invalid --end. Use an integer >= start.");
  }
  if (!Number.isInteger(clusterUnit) || clusterUnit < 1) {
    throw new Error("Invalid --clusterUnit. Use an integer >= 1.");
  }
  if (!Number.isInteger(recent) || recent < 1) {
    throw new Error("Invalid --recent. Use an integer >= 1.");
  }

  await initializeLottoCache();
  initializePremiumCache();

  const outPath = path.resolve(process.cwd(), outRaw);
  const outDir = path.dirname(outPath);
  fs.mkdirSync(outDir, { recursive: true });

  const nextByRound = new Map<number, number[]>();
  sortedLottoCache.forEach((rec) => {
    nextByRound.set(rec.drwNo, [
      rec.drwtNo1,
      rec.drwtNo2,
      rec.drwtNo3,
      rec.drwtNo4,
      rec.drwtNo5,
      rec.drwtNo6,
    ]);
  });

  const stream = fs.createWriteStream(outPath, { encoding: "utf-8" });

  let written = 0;
  for (let t = start; t <= end; t++) {
    const nextNumbers = nextByRound.get(t + 1);
    if (!nextNumbers) continue;
    const nextSet = new Set(nextNumbers);

    const breakdown = await buildAiScoreBreakdown(t, clusterUnit, recent);
    for (const row of breakdown.featuresByNumber) {
      const line = {
        t,
        n: row.num,
        features: row.features,
        label: nextSet.has(row.num) ? 1 : 0,
      };
      stream.write(`${JSON.stringify(line)}\n`);
      written += 1;
    }
  }

  stream.end();
  console.log(`[export_trainset] Wrote ${written} rows to ${outPath}`);
}

main()
  .catch((err) => {
    console.error("[export_trainset] Failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
