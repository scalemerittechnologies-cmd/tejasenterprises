import 'server-only'

const uuid = /^[a-f0-9-]{36}$/i
const accountIdPattern = /^[a-f0-9]{32}$/i

function d1Config() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim()
  const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID?.trim()
  const token = process.env.CLOUDFLARE_D1_API_TOKEN?.trim()
  if (!accountId && !databaseId && !token) return null
  if (!accountIdPattern.test(accountId ?? '') || !uuid.test(databaseId ?? '') || !token) {
    throw new Error('Set a valid CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_D1_DATABASE_ID and CLOUDFLARE_D1_API_TOKEN.')
  }
  return { accountId: accountId!, databaseId: databaseId!, token }
}

export function usesCloudflareD1() { return Boolean(d1Config()) }

type D1Envelope<T> = {
  success?: boolean
  errors?: { message?: string }[]
  result?: { success?: boolean; results?: T[] }[]
}

export async function queryD1<T extends object>(sql: string, params: string[] = []): Promise<T[]> {
  const config = d1Config()
  if (!config) throw new Error('Cloudflare D1 is not configured.')
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/d1/database/${config.databaseId}/query`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ sql, params }),
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    },
  )
  const body = await response.json().catch(() => null) as D1Envelope<T> | null
  if (!response.ok || !body?.success || !body.result?.[0]?.success) {
    throw new Error(`Cloudflare D1 query failed (${response.status}): ${body?.errors?.[0]?.message ?? 'unknown error'}`)
  }
  return body.result[0].results ?? []
}
