export function getLowestN<T>(
  arr: T[],
  n: number,
  getValue: (item: T) => number
): T[] {
  return [...arr]
    .sort((a, b) => getValue(b) - getValue(a)) // 오름차순
    .slice(-n);
}
