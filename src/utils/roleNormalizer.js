export function normalizeRole(raw) {
  if (!raw) return 'unknown-role'
  const r = raw.toLowerCase()
  if (r === 'ai' || r === 'assistant') return 'assistant'
  if (r === 'user') return 'user'
  return 'unknown-role'
}