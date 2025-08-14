

export default function time12Compact(ms: number) {
  const s = new Date(ms).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  return s.replace(/\s/g, '').toLowerCase() // "8:32pm"
}
