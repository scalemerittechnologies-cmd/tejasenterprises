export function hasAllowedOrigin(request: Request, requireOrigin = true): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return !requireOrigin
  try {
    const candidate = new URL(origin).origin
    const allowed = new Set([new URL(request.url).origin])
    const forwardedHost = request.headers.get('x-forwarded-host') ?? request.headers.get('host')
    if (forwardedHost) allowed.add(`${request.headers.get('x-forwarded-proto') ?? 'https'}://${forwardedHost}`)
    for (const value of [process.env.NEXT_PUBLIC_SITE_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL, process.env.VERCEL_URL, process.env.URL]) {
      if (!value) continue
      const url = value.includes('://') ? value : `https://${value}`
      allowed.add(new URL(url).origin)
    }
    return allowed.has(candidate)
  } catch {
    return false
  }
}
