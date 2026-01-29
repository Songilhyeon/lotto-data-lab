"use client";

import { useEffect, useState } from "react";
import {
  AiScoreBase,
  AiTunedBlock,
  IfAiNextFreqRecommendResult,
  WeightConfig,
} from "@/app/types/api";
import { apiUrl, getLatestRound } from "@/app/utils/getUtils";
import { componentBodyDivStyle } from "@/app/utils/getDivStyle";
import ComponentHeader from "@/app/components/ComponentHeader";
import ClusterUnitSelector from "@/app/components/ai-recommend/ClusterUnitSelector";
import { LottoDraw } from "@/app/types/lottoNumbers";
import DraggableNextRound from "@/app/components/DraggableNextRound";
import LottoBall from "../LottoBall";
import ScoreBarList from "@/app/components/ai-recommend/ScoreBarList";
import useRequestDedup from "@/app/hooks/useRequestDedup";
import BacktestSummaryCard from "@/app/components/ai-recommend/BacktestSummaryCard";
import { useAuth } from "@/app/context/authContext";

type NextRecommendParams = {
  clusterUnit: number;
  round: number;
  weights: {
    hot: number;
    cold: number;
    streak: number;
    pattern: number;
    cluster: number;
    random: number;
    nextFreq: number;
  };
};

export default function AiNextRecommend() {
  const latestRound = getLatestRound(); // 최신 회차
  const { user } = useAuth();
  const canUseTuned = user?.role === "ADMIN";
  const [selectedRound, setSelectedRound] = useState<number>(latestRound); // 분석 회차
  const [clusterUnit, setClusterUnit] = useState<number>(7);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IfAiNextFreqRecommendResult | null>(
    null,
  );
  const [nextRound, setNextRound] = useState<LottoDraw | null>(null);
  const [scoreMode, setScoreMode] = useState<"raw" | "normalized">(
    "normalized",
  );
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [useTuned, setUseTuned] = useState(false);
  const [tunedOverride, setTunedOverride] = useState<AiTunedBlock | null>(null);
  const [loggedTunedResponse, setLoggedTunedResponse] = useState(false);

  const isTunedActive = useTuned && canUseTuned;

  useEffect(() => {
    if (!canUseTuned && useTuned) {
      setUseTuned(false);
    }
  }, [canUseTuned, useTuned]);

  // ✅ 성공한 요청만 dedup 대상으로 저장, 실패 시 재시도 가능
  const { begin, commit, rollback } = useRequestDedup<NextRecommendParams>();

  // weight 기본값
  const weights: WeightConfig = {
    hot: 1,
    cold: 0.5,
    streak: 1,
    pattern: 1,
    cluster: 0.5,
    random: 1,
    nextFreq: 5,
  };

  const fetchAnalysis = async (force = false) => {
    const params: NextRecommendParams = {
      clusterUnit,
      round: selectedRound,
      weights: {
        hot: weights.hot,
        cold: weights.cold,
        streak: weights.streak,
        pattern: weights.pattern,
        cluster: weights.cluster,
        random: weights.random,
        nextFreq: weights.nextFreq,
      },
    };

    const attempt = begin(params, force);
    if (!attempt.ok) return;

    setLoading(true);
    try {
      setErrorMsg("");

      const query = new URLSearchParams({
        clusterUnit: clusterUnit.toString(),
        start: selectedRound.toString(),
        end: selectedRound.toString(),
        hot: weights.hot.toString(),
        cold: weights.cold.toString(),
        streak: weights.streak.toString(),
        pattern: weights.pattern.toString(),
        cluster: weights.cluster.toString(),
        random: weights.random.toString(),
        nextFreq: weights.nextFreq.toString(),
        aiTuned: canUseTuned ? "true" : "false",
        tunedVariant: "next",
      });

      const res = await fetch(
        `${apiUrl}/lotto/premium/recommend-next?${query.toString()}`,
        {
          // ✅ 공개 엔드포인트면 필요 없음
          // ✅ auth 걸어둔 엔드포인트면 아래 주석 해제
          // credentials: "include",
        },
      );

      if (!res.ok) {
        let msg = "요청에 실패했습니다.";
        try {
          const json = await res.json();
          msg = json?.message || json?.error || msg;
        } catch {}
        throw new Error(msg);
      }

      const json = await res.json();
      const nextResult = json.result;

      const isRecord = (value: unknown): value is Record<string, unknown> =>
        typeof value === "object" && value !== null;

      const readTuned = (value: unknown): AiTunedBlock | undefined => {
        if (!isRecord(value)) return undefined;
        const tuned = value.tuned;
        if (
          isRecord(tuned) &&
          Array.isArray(tuned.recommended) &&
          Array.isArray(tuned.scores)
        ) {
          return tuned as AiTunedBlock;
        }
        const data = value.data;
        if (isRecord(data)) {
          return readTuned(data);
        }
        return undefined;
      };

      const tunedBlock = readTuned(nextResult) ?? readTuned(json);

      if (isTunedActive && tunedBlock && !loggedTunedResponse) {
        // console.log("tuned response snapshot:", json);
        setLoggedTunedResponse(true);
      }

      setResult(nextResult);
      setNextRound(nextResult?.nextRound ?? null);
      setTunedOverride(tunedBlock ?? null);

      commit(attempt.key); // ✅ 성공 확정
    } catch (err: unknown) {
      console.error(err);

      let msg = "요청 중 오류가 발생했습니다.";
      if (err instanceof Error) {
        msg = err.message;
      }

      setErrorMsg(msg);
      rollback(); // ✅ 실패면 재시도 가능
    } finally {
      setLoading(false);
    }
  };

  const hitNumberSet = nextRound ? new Set<number>(nextRound.numbers) : null;
  const bonusNumber = nextRound?.bonus;
  const tunedResult = tunedOverride ?? result?.tuned;
  const tunedFallbackMsg =
    isTunedActive && !tunedResult
      ? "AI 튜닝 결과가 없어 기본 추천을 표시합니다."
      : "";

  const renderTunedScores = (tuned: AiTunedBlock) => {
    const tunedScoreBars: AiScoreBase[] = tuned.scores.map((row) => ({
      num: row.num,
      finalRaw: row.finalRawTuned,
      final: row.finalTuned,
    }));

    return (
      <ScoreBarList
        scores={tunedScoreBars}
        mode={scoreMode}
        hitNumberSet={hitNumberSet}
        bonusNumber={bonusNumber}
        title="🎛 튜닝 점수 분포 (점수 높은 순)"
      />
    );
  };

  const renderResult = () => {
    if (loading) return <div>점수 분석 중...</div>;
    if (!result) return <div>분석 결과가 없습니다.</div>;

    return (
      <div className="mt-2 p-4 border rounded bg-green-50">
        <h3 className="font-bold mb-2">분석 점수 TOP6 번호</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {(isTunedActive && tunedResult?.recommended?.length
            ? tunedResult.recommended
            : result.combination
          ).map((n) => (
            <LottoBall key={n} number={n} size="lg" />
          ))}
        </div>

        {isTunedActive && tunedFallbackMsg && (
          <div className="mb-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
            {tunedFallbackMsg}
          </div>
        )}

        {isTunedActive && tunedResult
          ? renderTunedScores(tunedResult)
          : result.scores && (
              <ScoreBarList
                scores={result.scores}
                mode={scoreMode}
                hitNumberSet={hitNumberSet}
                bonusNumber={bonusNumber}
              />
            )}
      </div>
    );
  };

  return (
    <div className={`${componentBodyDivStyle()} from-green-50 to-purple-100`}>
      <ComponentHeader
        title="🔗 다음 회차 이어짐 모델"
        content={`이전 회차 번호와 다음 회차 출현의 연관 빈도(nextFreq)를 중심으로, hot/cold·연속·패턴·클러스터·랜덤 점수를 함께 합산해 분석하는 혼합형 모델.
                  회차를 선택하여 과거 회차에 어떤 번호가 당첨 되었는지 분석할 수 있습니다.`}
      />

      <ClusterUnitSelector
        clusterUnit={clusterUnit}
        setClusterUnit={setClusterUnit}
      />

      <BacktestSummaryCard
        modelKey="ai_next"
        clusterUnit={clusterUnit}
        weights={weights}
        aiTuned={isTunedActive}
        tunedVariant="next"
      />

      {/* 회차 선택 UI */}
      <div className="mb-4 flex items-center gap-2">
        <label className="font-medium text-gray-700">회차 선택:</label>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setSelectedRound((prev) => Math.max(prev - 1, 1))}
            className="
              px-2 py-1 bg-gray-200 rounded
              hover:bg-gray-300 active:bg-gray-400
              transition disabled:opacity-40
            "
            disabled={selectedRound <= 1}
          >
            -
          </button>

          <input
            type="number"
            min={1}
            max={latestRound}
            value={selectedRound}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (!Number.isNaN(value)) setSelectedRound(value);
            }}
            onBlur={() => {
              setSelectedRound((prev) =>
                Math.min(Math.max(prev, 1), latestRound),
              );
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
            }}
            className="
              min-w-[4.5rem]
              px-2 py-1
              text-center
              border rounded
              bg-white
              tabular-nums
              focus:outline-none focus:ring-2 focus:ring-blue-300
            "
          />

          <button
            onClick={() =>
              setSelectedRound((prev) => Math.min(prev + 1, latestRound))
            }
            className="
              px-2 py-1 bg-gray-200 rounded
              hover:bg-gray-300 active:bg-gray-400
              transition disabled:opacity-40
            "
            disabled={selectedRound >= latestRound}
          >
            +
          </button>
        </div>

        <span
          className="text-gray-500 cursor-pointer hover:underline"
          onClick={() => setSelectedRound(latestRound)}
        >
          최신 회차: {latestRound}
        </span>
      </div>

      <div className="flex gap-2 mb-2">
        {errorMsg && (
          <div className="mb-3 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            {errorMsg}
          </div>
        )}
      </div>

      {/* 실행 */}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <button
          onClick={() => fetchAnalysis(false)}
          className="bg-green-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded mb-4 w-full sm:w-auto font-medium shadow-md hover:bg-green-600 active:scale-95"
        >
          점수 분석 실행
        </button>

        {/* ✅ 같은 params라도 강제 재실행 */}
        {/* <button
          onClick={() => fetchAnalysis(true)}
          className="bg-gray-200 px-4 py-2 sm:px-6 sm:py-3 rounded mb-4 w-full sm:w-auto font-medium shadow-md hover:bg-gray-300"
        >
          강제 새로고침
        </button> */}

        {canUseTuned && (
          <button
            type="button"
            onClick={() => setUseTuned((prev) => !prev)}
            className={`px-4 py-2 sm:px-6 sm:py-3 rounded mb-4 w-full sm:w-auto font-medium shadow-md ${
              isTunedActive
                ? "bg-slate-900 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            AI 튜닝 분석 {isTunedActive ? "ON" : "OFF"}
          </button>
        )}

        <button
          onClick={() => setScoreMode("normalized")}
          className={`px-4 py-2 sm:px-6 sm:py-3 rounded mb-4 w-full sm:w-auto font-medium shadow-md ${
            scoreMode === "normalized"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          정규화 점수
        </button>

        <button
          onClick={() => setScoreMode("raw")}
          className={`px-4 py-2 sm:px-6 sm:py-3 rounded mb-4 w-full sm:w-auto font-medium shadow-md ${
            scoreMode === "raw" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          원본 점수
        </button>
      </div>

      {nextRound && (
        <div className="min-w-0">
          <DraggableNextRound nextRound={nextRound} most={[]} least={[]} />
        </div>
      )}

      <div className="overflow-visible">{renderResult()}</div>
    </div>
  );
}
