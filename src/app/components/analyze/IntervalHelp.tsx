type IntervalUnitHelpProps = {
  unit: 5 | 7 | 10;
};

export function IntervalUnitHelp({ unit }: IntervalUnitHelpProps) {
  return (
    <div className="mt-2 text-xs text-gray-500 leading-relaxed">
      {unit === 5 && (
        <>
          • <b>5단위</b>: 번호를 <b>1–5, 6–10, 11–15 …</b>처럼 세밀하게
          구분합니다.
          <br />• 짧은 구간 변화에 민감하며, 미세한 흐름을 보기 좋습니다.
        </>
      )}
      {unit === 7 && (
        <>
          • <b>7단위</b>: 번호를 <b>1–7, 8–14, 15–21 …</b>로 묶습니다.
          <br />• 노이즈를 줄이면서 전체적인 번호대 흐름을 파악하기 좋습니다.
        </>
      )}
      {unit === 10 && (
        <>
          • <b>10단위</b>: 번호를 <b>1–10, 11–20, 21–30 …</b>로 크게 묶습니다.
          <br />• 장기적인 번호대 강·약을 확인하는 데 적합합니다.
        </>
      )}
    </div>
  );
}

export function IntervalBucketLegend() {
  return (
    <div className="mt-2 text-xs text-gray-500 space-y-1">
      <div>
        <b>S</b> : Short (≤ 5회 간격)
      </div>
      <div>
        <b>M</b> : Medium (6 ~ 10회 간격)
      </div>
      <div>
        <b>L</b> : Long (11 ~ 20회 간격)
      </div>
      <div>
        <b>XL</b> : Extra Long (21회 이상)
      </div>
    </div>
  );
}
