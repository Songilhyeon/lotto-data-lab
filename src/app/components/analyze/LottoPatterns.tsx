"use client";

import { useEffect, useState, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import RangeFilterBar from "@/app/components/RangeFilterBar"; // 방금 작성한 컴포넌트
import { apiUrl, getLatestRound } from "@/app/utils/getUtils";

interface ConsecutivePattern {
  seq: number[];
  count: number;
  lastRounds: number[];
}

interface ColdNumber {
  num: number;
  gapRounds: number | null;
  lastSeen: number | null;
}

interface PatternResponse {
  consecutive: ConsecutivePattern[];
  coldNumbers: ColdNumber[];
  message?: string;
}

interface StatisticsResponse {
  success: boolean;
  data: {
    frequency: Record<number, number>;
    roundResults: { drwNo: number; numbers: number[] }[];
    nextRound: { drwNo: number; numbers: number[] } | null;
  };
}

export default function LottoPatterns() {
  const latestRound = getLatestRound();
  const [patternData, setPatternData] = useState<PatternResponse | null>(null);
  const [statisticsData, setStatisticsData] = useState<
    StatisticsResponse["data"] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [start, setStart] = useState(latestRound - 19);
  const [end, setEnd] = useState(latestRound);
  const [includeBonus, setIncludeBonus] = useState(true);
  const [selectedRecent, setSelectedRecent] = useState<number | null>(20);
  const [topK, setTopK] = useState(10);

  const prevParamsRef = useRef({
    start: -1,
    end: -1,
    topK: -1,
    includeBonus: !includeBonus,
  });

  const fetchData = async () => {
    const prev = prevParamsRef.current;
    if (
      prev.start === start &&
      prev.end === end &&
      prev.topK === topK &&
      prev.includeBonus === includeBonus
    ) {
      console.log("⭐ same params, skip fetch");
      return; // ← fetch 실행 안 함
    }

    setLoading(true);
    try {
      const lookback = selectedRecent ?? end - start + 1;

      const [patternRes, statsRes] = await Promise.all([
        fetch(
          `${apiUrl}/lotto/pattern?lookback=${lookback}&topK=${topK}&minConsec=2&includeBonus=${includeBonus}`
        ),
        fetch(
          `${apiUrl}/lotto/frequency?start=${start}&end=${end}&includeBonus=${includeBonus}`
        ),
      ]);

      const patternJson: PatternResponse = await patternRes.json();
      const statsJson: StatisticsResponse = await statsRes.json();

      setPatternData(patternJson);
      setStatisticsData(statsJson.data);
    } catch (err) {
      console.error(err);
      setPatternData(null);
      setStatisticsData(null);
    } finally {
      setLoading(false);
      prevParamsRef.current = { start, end, topK, includeBonus }; // ← params 저장
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p>Loading data...</p>;
  if (!patternData || !statisticsData) return <p>Failed to load data.</p>;

  const frequencyArray = Object.entries(statisticsData.frequency).map(
    ([num, count]) => ({ num: Number(num), count })
  );

  const consecutiveChartData = patternData.consecutive.map((item) => ({
    ...item,
    seqLabel: item.seq.join("-"),
  }));

  // --- end 입력 시 recent 선택 해제 ---
  const handleEndChange = (value: number) => {
    setEnd(value);
    setSelectedRecent(null); // 수동 변경 시 recent 해제
  };

  // --- start 직접 수정 ---
  const handleStartChange = (value: number) => {
    setStart(value);
    setSelectedRecent(null); // 수동 변경 시 recent 해제
  };

  const handleRecent = (count: number) => {
    setSelectedRecent(count);
    setStart(Math.max(1, end - count + 1));
    if (count === latestRound) setEnd(count);
  };

  const clearRecentSelect = () => setSelectedRecent(null);
  return (
    <div className="p-6 space-y-6">
      {/* 필터 바 */}
      <RangeFilterBar
        start={start}
        end={end}
        latest={latestRound}
        includeBonus={includeBonus}
        selectedRecent={selectedRecent}
        setStart={handleStartChange}
        setEnd={handleEndChange}
        setIncludeBonus={setIncludeBonus}
        onRecentSelect={handleRecent}
        clearRecentSelect={clearRecentSelect}
      />

      <div className="flex justify-start mt-2 mb-6">
        {/* TopK 설정 */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Top 개수:</label>
          <input
            type="number"
            min={1}
            max={50}
            value={topK}
            onChange={(e) => setTopK(Number(e.target.value))}
            className="border px-2 py-1 rounded w-20"
          />
        </div>

        {/* 조회하기 버튼 */}
        <button
          onClick={fetchData}
          className="ml-4 px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
        >
          {loading ? "조회 중..." : "조회하기"}
        </button>
      </div>

      {/* 번호별 출현 빈도 차트 */}
      <div>
        <h2 className="text-xl font-bold mb-4">번호별 출현 빈도</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={frequencyArray}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="num" />
            <YAxis />
            <Tooltip formatter={(value) => value ?? "미출현"} />
            <Legend />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 연속 번호 차트 */}
      <div>
        <h2 className="text-xl font-bold mb-4">연속 번호 분석 (Top {topK})</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={consecutiveChartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="seqLabel" />
            <YAxis />
            <Tooltip formatter={(value) => value ?? "미출현"} />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 미출현 번호 차트 */}
      <div>
        <h2 className="text-xl font-bold mb-4">
          장기 미출현 번호 (Top {topK})
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={patternData.coldNumbers}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="num" />
            <YAxis />
            <Tooltip formatter={(value) => value ?? "미출현"} />
            <Legend />
            <Bar dataKey="gapRounds" fill="#ff7f50" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
