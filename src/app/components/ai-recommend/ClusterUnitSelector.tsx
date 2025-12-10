interface ClusterUnitSelectorProps {
  clusterUnit: number;
  setClusterUnit: (value: number) => void;
  options?: number[]; // 선택 가능한 단위 (기본 5,7,10)
}

const clusterLabel: Record<number, string> = {
  5: "1~5, 6~10, ... , 41~45 로 그룹화",
  7: "1~7, 8~14, ... , 38~45 로 그룹화",
  10: "1~10, 11~20, ... , 36~45 로 그룹화",
};

const ClusterUnitSelector: React.FC<ClusterUnitSelectorProps> = ({
  clusterUnit,
  setClusterUnit,
  options = [5, 7, 10],
}) => {
  return (
    <div className="mb-4 flex items-center gap-2">
      <label className="font-semibold">클러스터 단위:</label>
      <select
        value={clusterUnit}
        onChange={(e) => setClusterUnit(Number(e.target.value))}
        className="border px-2 py-1 rounded"
      >
        {options.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
      <span className="text-gray-500 text-sm">{clusterLabel[clusterUnit]}</span>
    </div>
  );
};

export default ClusterUnitSelector;
