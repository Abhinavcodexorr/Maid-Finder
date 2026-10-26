// The service catalog (admin-managed) has no emoji, so pick one from the
// service's name for the tiles and chips. Unknown names get a neutral one.
const EMOJI_BY_KEYWORD: Array<[RegExp, string]> = [
  [/cook|chef|kitchen/i, "🍳"],
  [/clean|maid|wash|laundry/i, "🧹"],
  [/plumb/i, "🔧"],
  [/electric/i, "⚡"],
  [/carpent/i, "🪚"],
  [/driver/i, "🚗"],
  [/nanny|baby|child/i, "👶"],
  [/elder|old/i, "🧓"],
  [/nurs|patient/i, "🏥"],
  [/garden/i, "🌱"],
  [/\bac\b|air/i, "❄️"],
  [/paint/i, "🎨"],
  [/sofa/i, "🛋️"],
  [/office/i, "🏢"],
];

export function emojiForService(name: string): string {
  return EMOJI_BY_KEYWORD.find(([pattern]) => pattern.test(name))?.[1] ?? "✨";
}
