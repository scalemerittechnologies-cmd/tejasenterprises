import { randomUUID } from 'node:crypto'
import sharp from 'sharp'
import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { saveUploadedImage } from '@/lib/site-content'
import { hasAllowedOrigin } from '@/lib/request-origin'

export const runtime = 'nodejs'
const maxBytes = 4 * 1024 * 1024
const maxOptimizedImageBytes = 1_250_000

export async function POST(request: Request) {
  if (!hasAllowedOrigin(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  if (!await isAdminAuthenticated()) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 })
  let form: FormData
  try { form = await request.formData() } catch { return NextResponse.json({ error: 'Choose an image to upload.' }, { status: 400 }) }
  const file = form.get('file')
  if (!(file instanceof File) || file.size === 0) return NextResponse.json({ error: 'Choose an image file.' }, { status: 400 })
  if (file.size > maxBytes) return NextResponse.json({ error: 'Image upload must be under 4 MB after optimization.' }, { status: 413 })
  let output: Buffer
  try {
    const source = Buffer.from(await file.arrayBuffer())
    const processor = sharp(source, { limitInputPixels: 40_000_000, failOn: 'error' })
    const metadata = await processor.metadata()
    if (!metadata.width || !metadata.height || !['jpeg', 'png', 'webp', 'avif'].includes(metadata.format ?? '')) {
      return NextResponse.json({ error: 'Upload a valid JPEG, PNG, WebP or AVIF image.' }, { status: 415 })
    }
    output = Buffer.alloc(0)
    const targetBytes = maxOptimizedImageBytes
    for (const [side, quality] of [[1800, 82], [1600, 76], [1400, 70], [1200, 64], [1000, 58], [900, 50]]) {
      output = await sharp(source, { limitInputPixels: 40_000_000, failOn: 'error' })
        .rotate()
        .resize({ width: side, height: side, fit: 'inside', withoutEnlargement: true })
        .webp({ quality })
        .toBuffer()
      if (output.byteLength <= targetBytes) break
    }
    if (output.byteLength > targetBytes) return NextResponse.json({ error: 'This image is too detailed to fit free storage after optimization.' }, { status: 413 })
  } catch {
    return NextResponse.json({ error: 'This image could not be processed.' }, { status: 400 })
  }
  const filename = `${randomUUID()}.webp`
  try {
    const uploaded = await saveUploadedImage(filename, output)
    return NextResponse.json({ ok: true, ...uploaded, bytes: output.byteLength })
  } catch {
    return NextResponse.json({ error: 'The image was processed but could not be saved. Check the configured media storage.' }, { status: 503 })
  }
}
