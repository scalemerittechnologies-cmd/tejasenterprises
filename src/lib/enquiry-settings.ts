import 'server-only'
import { readFile, writeFile, mkdir, rename } from 'node:fs/promises'
import path from 'node:path'
import { queryD1, usesCloudflareD1 } from '@/lib/cloudflare-storage'
export type EnquiryPopupCopy = {
  badgeEn: string; badgeHi: string
  headingEn: string; headingHi: string
  introEn: string; introHi: string
  submitEn: string; submitHi: string
}
export type EnquirySettings = { enabled: boolean; formUrl?: string; sheetUrl?: string; endpoint: string; token: string; popup: EnquiryPopupCopy }
export const defaultEnquirySettings: EnquirySettings = {
  enabled: false,
  endpoint: '',
  token: '',
  popup: {
    badgeEn: 'Govt. Subsidy Up to ₹78,000', badgeHi: 'सरकारी सब्सिडी ₹78,000 तक',
    headingEn: 'Get a Free Solar Rooftop Quote', headingHi: 'मुफ्त सोलर साइट सर्वे एवं कोटेशन',
    introEn: 'Fill out this quick form. Our local solar engineers will estimate your savings and guide you step-by-step.',
    introHi: 'अपनी आवश्यकता बताएं। हमारे विशेषज्ञ आपकी छत का आकलन कर सही समाधान देंगे।',
    submitEn: 'Get Free Quote & Site Survey', submitHi: 'मुफ्त कोटेशन और साइट सर्वे पाएं',
  },
}
const file = path.join(process.cwd(), 'data', 'enquiry-settings.json')
export async function getEnquirySettings(): Promise<EnquirySettings> {
  if (usesCloudflareD1()) {
    const rows = await queryD1<{ content: string }>('SELECT content FROM site_content WHERE site_key = ? LIMIT 1', ['tejas-enquiries'])
    return normalizeSettings(rows[0] ? JSON.parse(rows[0].content) as Partial<EnquirySettings> : null)
  }
  try { return normalizeSettings(JSON.parse(await readFile(file, 'utf8'))) }
  catch { return defaultEnquirySettings }
}
function normalizeSettings(value: Partial<EnquirySettings> | null | undefined): EnquirySettings {
 return { ...defaultEnquirySettings, ...value, popup: { ...defaultEnquirySettings.popup, ...value?.popup } }
}
export async function saveEnquirySettings(settings: EnquirySettings) {
  if (usesCloudflareD1()) {
    await queryD1('INSERT INTO site_content (site_key, content, updated_at) VALUES (?, ?, ?) ON CONFLICT(site_key) DO UPDATE SET content = excluded.content, updated_at = excluded.updated_at', ['tejas-enquiries', JSON.stringify(settings), new Date().toISOString()])
    return
  }
  await mkdir(path.dirname(file), { recursive: true })
  const tmp = `${file}.${crypto.randomUUID()}.tmp`
  await writeFile(tmp, JSON.stringify(settings), { mode: 0o600 })
  await rename(tmp, file)
}
export function validEndpoint(value:string){return /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(value)}
