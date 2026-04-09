const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || '/api'

function trimTrailingSlashes(value: string): string {
  return value.replace(/\/+$/, '')
}

function trimLeadingSlashes(value: string): string {
  return value.replace(/^\/+/, '')
}

function joinUrl(base: string, path: string): string {
  const normalizedBase = trimTrailingSlashes(base)
  const normalizedPath = trimLeadingSlashes(path)
  return `${normalizedBase}/${normalizedPath}`
}

export const API_BASE_URL = trimTrailingSlashes(rawApiBaseUrl)
export const API_CONTENT_URL = joinUrl(API_BASE_URL, 'content')
export const API_TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT_MS || '10000')

export function toAbsoluteUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) {
    return url
  }

  return new URL(url, window.location.origin).toString()
}

export function getApiHostLabel(): string {
  const absoluteUrl = toAbsoluteUrl(API_BASE_URL)
  return new URL(absoluteUrl).host
}

export function isPrivateNetworkHost(): boolean {
  const host = new URL(toAbsoluteUrl(API_BASE_URL)).hostname

  return (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(host)
  )
}
