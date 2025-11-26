export function numberParticle(str: string) {
  const numberPronunciationEnd = ["1", "3", "6", "7", "8"];
  const lastDigit = str[str.length - 1];
  const endsWithVowel = numberPronunciationEnd.includes(lastDigit);
  const particle = endsWithVowel ? " 이" : " 가";

  return `${str}${particle}`;
}
