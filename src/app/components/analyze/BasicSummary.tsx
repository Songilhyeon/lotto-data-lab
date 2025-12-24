"use client";

import { useEffect, useState, useRef } from "react";
import { apiUrl, getLatestRound } from "@/app/utils/getUtils";
import RangeFilterBar from "@/app/components/RangeFilterBar";
import ComponentHeader from "@/app/components/ComponentHeader";
import LookUpButton from "@/app/components/analyze/LookUpButton";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartTooltip,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { LottoNumber } from "@/app/types/lottoNumbers";
import {
  componentBodyDivStyle,
  rangeFilterDivStyle,
} from "@/app/utils/getDivStyle";

export default function BasicSummary() {
  const latestRound = getLatestRound();
  const [start, setStart] = useState(latestRound - 9);
  const [end, setEnd] = useState(latestRound);
  const [includeBonus, setIncludeBonus] = useState(false);
  const [data, setData] = useState<LottoNumber[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecent, setSelectedRecent] = useState<number | null>(10);

  const prevParamsRef = useRef({
    start: -1,
    end: -1,
    includeBonus: !includeBonus,
  });

  const fetchData = async () => {
    const prev = prevParamsRef.current;
    if (
      prev.start === start &&
      prev.end === end &&
      prev.includeBonus === includeBonus
    )
      return;

    setLoading(true);
    try {
      const res = await fetch(
        `${apiUrl}/lotto/rounds?start=${start}&end=${end}&includeBonus=${includeBonus}`
      );
      const json = await res.json();
      setData(json.success ? json.data : []);
    } catch (err) {
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
      prevParamsRef.current = { start, end, includeBonus };
    }
  };

  useEffect(() => {
    fetchData();
  }, [includeBonus]);

  const handleEndChange = (value: number) => {
    if (value < start) setStart(value);
    setEnd(value);
    setSelectedRecent(null);
  };

  const handleStartChange = (value: number) => {
    if (value > end) setEnd(value);
    setStart(value);
    setSelectedRecent(null);
  };

  const handleRecent = (count: number) => {
    setSelectedRecent(count);
    setStart(Math.max(1, end - count + 1));
    if (count === latestRound) setEnd(count);
  };

  const clearRecentSelect = () => setSelectedRecent(null);

  // -------------------
  // 통계 계산
  // -------------------
  const allNumbers = data.flatMap((d) => [
    d.drwtNo1,
    d.drwtNo2,
    d.drwtNo3,
    d.drwtNo4,
    d.drwtNo5,
    d.drwtNo6,
    ...(includeBonus ? [d.bnusNo] : []),
  ]);

  const oddCount = allNumbers.filter((n) => n % 2 === 1).length;
  const evenCount = allNumbers.length - oddCount;
  const lowCount = allNumbers.filter((n) => n <= 22).length;
  const highCount = allNumbers.length - lowCount;

  const lastDigitCount = Array(10).fill(0);
  allNumbers.forEach((n) => lastDigitCount[n % 10]++);

  const ranges10 = Array.from({ length: 5 }, (_, i) => ({
    range: `${i * 10 + 1}-${i === 4 ? 45 : (i + 1) * 10}`,
    count: allNumbers.filter(
      (n) => n >= i * 10 + 1 && n <= (i === 4 ? 45 : (i + 1) * 10)
    ).length,
  }));

  const ranges7 = Array.from({ length: 7 }, (_, i) => {
    const start = i * 7 + 1;
    const end = i === 6 ? 45 : start + 6;
    return {
      range: `${start}-${end}`,
      count: allNumbers.filter((n) => n >= start && n <= end).length,
    };
  });

  const ranges5 = Array.from({ length: 9 }, (_, i) => {
    const start = i * 5 + 1;
    const end = i === 8 ? 45 : start + 4;
    return {
      range: `${start}-${end}`,
      count: allNumbers.filter((n) => n >= start && n <= end).length,
    };
  });

  // -------------------
  // 연속 번호
  // -------------------
  const consecutiveNumbers: { round: number; sequence: number[] }[] = [];
  data.forEach((d) => {
    const numbers = [
      d.drwtNo1,
      d.drwtNo2,
      d.drwtNo3,
      d.drwtNo4,
      d.drwtNo5,
      d.drwtNo6,
      ...(includeBonus ? [d.bnusNo] : []),
    ].sort((a, b) => a - b);
    let seq: number[] = [numbers[0]];
    for (let i = 1; i < numbers.length; i++) {
      if (numbers[i] === numbers[i - 1] + 1) seq.push(numbers[i]);
      else {
        if (seq.length >= 2)
          consecutiveNumbers.push({ round: d.drwNo, sequence: [...seq] });
        seq = [numbers[i]];
      }
    }
    if (seq.length >= 2)
      consecutiveNumbers.push({ round: d.drwNo, sequence: [...seq] });
  });
  consecutiveNumbers.sort((a, b) => b.round - a.round);

  // -------------------
  // 연속 출현 번호
  // -------------------
  const numberRoundsMap: Record<number, number[]> = {};
  data.forEach((d) => {
    [
      d.drwtNo1,
      d.drwtNo2,
      d.drwtNo3,
      d.drwtNo4,
      d.drwtNo5,
      d.drwtNo6,
      ...(includeBonus ? [d.bnusNo] : []),
    ].forEach((n) => {
      if (!numberRoundsMap[n]) numberRoundsMap[n] = [];
      numberRoundsMap[n].push(d.drwNo);
    });
  });

  const streakNumbers: { number: number; rounds: number[] }[] = [];
  Object.entries(numberRoundsMap).forEach(([numStr, rounds]) => {
    rounds.sort((a, b) => a - b);
    let streak: number[] = [rounds[0]];
    for (let i = 1; i < rounds.length; i++) {
      if (rounds[i] === rounds[i - 1] + 1) streak.push(rounds[i]);
      else {
        if (streak.length >= 2)
          streakNumbers.push({ number: Number(numStr), rounds: [...streak] });
        streak = [rounds[i]];
      }
    }
    if (streak.length >= 2)
      streakNumbers.push({ number: Number(numStr), rounds: [...streak] });
  });
  streakNumbers.sort((a, b) => b.rounds[0] - a.rounds[0]);

  // -------------------
  // 번호별 추세 라인 차트
  // -------------------
  const lineChartData = data.map((d) => ({
    round: d.drwNo,
    n1: d.drwtNo1,
    n2: d.drwtNo2,
    n3: d.drwtNo3,
    n4: d.drwtNo4,
    n5: d.drwtNo5,
    n6: d.drwtNo6,
    ...(includeBonus ? { bonus: d.bnusNo } : {}),
  }));

  const lastDigitChartData = lastDigitCount.map((count, digit) => ({
    digit,
    count,
  }));
  const oddEvenData = [
    { label: "홀", count: oddCount },
    { label: "짝", count: evenCount },
  ];
  const lowHighData = [
    { label: "낮음(1~22)", count: lowCount },
    { label: "높음(23~45)", count: highCount },
  ];

  return (
    <div className={`${componentBodyDivStyle()} from-blue-50 to-cyan-100`}>
      <ComponentHeader
        title="📊 번호 패턴 요약"
        content="선택된 회차 범위 동안의 기본 통계를 확인할 수 있습니다."
      />
      <div className={rangeFilterDivStyle + " mt-4 sm:mt-6"}>
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
      </div>
      <div className="flex justify-start mt-2 mb-6">
        <LookUpButton onClick={fetchData} loading={loading} />
      </div>

      {/* 기본 통계 */}
      <div className="flex flex-col md:flex-row gap-6 mt-4">
        <div className="flex-1 bg-white rounded-xl shadow p-4">
          <h3 className="text-sm font-semibold mb-2">홀/짝 통계</h3>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={oddEvenData}>
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <RechartTooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 bg-white rounded-xl shadow p-4">
          <h3 className="text-sm font-semibold mb-2">낮음/높음 통계</h3>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={lowHighData}>
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <RechartTooltip />
              <Bar dataKey="count" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 끝자리 + 10단위 */}
      <div className="flex flex-col md:flex-row gap-6 mt-6">
        <div className="flex-1 bg-white rounded-xl shadow p-4">
          <h3 className="text-sm font-semibold mb-2">끝자리 통계</h3>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={lastDigitChartData}>
              <XAxis dataKey="digit" />
              <YAxis allowDecimals={false} />
              <RechartTooltip />
              <Bar dataKey="count" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 bg-white rounded-xl shadow p-4">
          <h3 className="text-sm font-semibold mb-2">10단위 구간 통계</h3>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={ranges10}>
              <XAxis dataKey="range" />
              <YAxis allowDecimals={false} />
              <RechartTooltip />
              <Bar dataKey="count" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 7단위 / 5단위 구간 */}
      <div className="flex flex-col md:flex-row gap-6 mt-6">
        <div className="flex-1 bg-white rounded-xl shadow p-4">
          <h3 className="text-sm font-semibold mb-2">7단위 구간 통계</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={ranges7}>
              <XAxis dataKey="range" fontSize={12} />
              <YAxis allowDecimals={false} />
              <RechartTooltip />
              <Bar dataKey="count" fill="#06b6d4" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 bg-white rounded-xl shadow p-4">
          <h3 className="text-sm font-semibold mb-2">5단위 구간 통계</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={ranges5}>
              <XAxis dataKey="range" fontSize={12} />
              <YAxis allowDecimals={false} />
              <RechartTooltip />
              <Bar dataKey="count" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 연속 번호 */}
      {consecutiveNumbers.length > 0 && (
        <div className="bg-white rounded-xl shadow p-4 mt-6">
          <h3 className="text-sm font-semibold mb-2">연속된 번호 🔥</h3>
          <div className="flex flex-wrap gap-2">
            {consecutiveNumbers.map((item, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold"
              >
                {item.sequence.join("-")} : {item.round}회
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 연속 출현 번호 */}
      {streakNumbers.length > 0 && (
        <div className="bg-white rounded-xl shadow p-4 mt-6">
          <h3 className="text-sm font-semibold mb-2">연속 출현 번호 🔥</h3>
          <div className="flex flex-wrap gap-2">
            {streakNumbers.map((item, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-semibold"
              >
                {item.number} : {item.rounds.join(", ")}회
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 번호별 추세 */}
      <div className="bg-white rounded-xl shadow p-4 mt-6">
        <h3 className="text-sm font-semibold mb-2">번호별 추세</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={lineChartData}>
            <XAxis dataKey="round" />
            <YAxis allowDecimals={false} domain={[1, 45]} />
            <RechartTooltip />
            <Legend />
            <Line type="monotone" dataKey="n1" stroke="#3b82f6" />
            <Line type="monotone" dataKey="n2" stroke="#f97316" />
            <Line type="monotone" dataKey="n3" stroke="#10b981" />
            <Line type="monotone" dataKey="n4" stroke="#8b5cf6" />
            <Line type="monotone" dataKey="n5" stroke="#f43f5e" />
            <Line type="monotone" dataKey="n6" stroke="#facc15" />
            {includeBonus && (
              <Line type="monotone" dataKey="bonus" stroke="#000000" />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {loading && (
        <div className="text-center py-6 text-gray-500">데이터 분석 중...</div>
      )}
      {!loading && data.length === 0 && (
        <div className="text-center py-6 text-gray-500">데이터가 없습니다.</div>
      )}
    </div>
  );
}
