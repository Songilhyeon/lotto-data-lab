export function getDisplayName(
  displayName?: string | null,
  fallbackName?: string | null,
) {
  return displayName || fallbackName || "익명";
}
