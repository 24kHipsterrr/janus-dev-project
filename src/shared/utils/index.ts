// © Janus — yashxsanjay
export { cn } from './cn'

export function randomFileName(ext: string): string {
  return `${crypto.randomUUID()}.${ext}`
}

export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url)
    if (!['https:', 'http:'].includes(parsed.protocol)) return '#'
    return parsed.href
  } catch {
    return '#'
  }
}
