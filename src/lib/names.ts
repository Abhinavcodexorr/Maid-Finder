/** "priya SHARMA (test profile)" -> "Priya Sharma (Test Profile)". Capitalises after spaces, hyphens, apostrophes and brackets. */
export function formatPersonName(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/(^|[\s\-'’(])([a-z])/g, (_, sep: string, ch: string) => sep + ch.toUpperCase());
}
