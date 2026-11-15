import { NextResponse } from 'next/server'
import { getWhatsAppUrl } from '@/lib/whatsapp'
import { hasAllowedOrigin } from '@/lib/request-origin'

const attempts = new Map<string, number[]>()

export async function GET() {
  return NextResponse.json({ enabled: true, destination: 'whatsapp', savesData: false }, { headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(request: Request) {
  if (!hasAllowedOrigin(request, false)) return NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
  const now = Date.now()
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'local'
  const recent = (attempts.get(ip) || []).filter(time => now - time < 600000)
  if (recent.length >= 6) return NextResponse.json({ error: 'Too many attempts. Please contact us on WhatsApp.' }, { status: 429 })
  attempts.set(ip, [...recent, now])

  try {
    const body = await request.json() as Record<string, unknown>
    if (body.website) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    const name = String(body.name || '').trim()
    const phone = String(body.phone || '').replace(/\D/g, '')
    const requirement = String(body.requirement || 'Solar quote').trim()
    const billRange = String(body.billRange || 'Not specified').trim()
    const locality = String(body.locality || 'Prayagraj').trim()
    if (name.length < 2 || name.length > 100 || !/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json({ error: 'Enter a valid name and 10-digit mobile number.' }, { status: 400 })
    }
    const whatsappUrl = getWhatsAppUrl(`Hello Tejas Enterprises, I would like a solar quote.\nName: ${name}\nMobile: ${phone}\nRequirement: ${requirement}\nMonthly bill: ${billRange}\nLocation: ${locality}`)
    return NextResponse.json({ ok: true, whatsappUrl, saved: false })
  } catch {
    return NextResponse.json({ error: 'Invalid enquiry details.' }, { status: 400 })
  }
}
