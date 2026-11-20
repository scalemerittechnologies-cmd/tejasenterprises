import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { getD1Image } from '@/lib/cloudflare-media'
import { usesCloudflareD1 } from '@/lib/cloudflare-storage'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(_request: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params
  if (!/^[a-f0-9-]{20,50}\.webp$/.test(filename)) return new Response('Not found', { status: 404 })
  try {
    const file = usesCloudflareD1()
      ? await getD1Image(filename)
      : process.env.NODE_ENV === 'production'
        ? null
        : new Uint8Array(await readFile(path.join(process.cwd(), 'data', 'uploads', filename)))
    if (!file) return new Response('Not found', { status: 404 })
    return new Response(new Uint8Array(file), { headers: { 'Content-Type': 'image/webp', 'Content-Length': String(file.byteLength), 'Cache-Control': 'public, max-age=604800, immutable', 'X-Content-Type-Options': 'nosniff' } })
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') return new Response('Not found', { status: 404 })
    return new Response('Media temporarily unavailable', { status: 503 })
  }
}
