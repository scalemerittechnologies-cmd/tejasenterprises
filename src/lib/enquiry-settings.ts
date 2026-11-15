import 'server-only'
import { readFile, writeFile, mkdir, rename } from 'node:fs/promises'
import path from 'node:path'
import { githubContentConfigured } from '@/lib/github-content'
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
  if (githubContentConfigured() || process.env.NODE_ENV === 'production') return defaultEnquirySettings
  try { return normalizeSettings(JSON.parse(await readFile(file, 'utf8'))) }
  catch { return defaultEnquirySettings }
}
function normalizeSettings(value: Partial<EnquirySettings> | null | undefined): EnquirySettings {
 return { ...defaultEnquirySettings, ...value, popup: { ...defaultEnquirySettings.popup, ...value?.popup } }
}
export async function saveEnquirySettings(settings: EnquirySettings) {
  if (githubContentConfigured() || process.env.NODE_ENV === 'production') throw new Error('This site sends quote enquiries directly to WhatsApp and does not store enquiry data.')
  await mkdir(path.dirname(file), { recursive: true })
  const tmp = `${file}.${crypto.randomUUID()}.tmp`
  await writeFile(tmp, JSON.stringify(settings), { mode: 0o600 })
  await rename(tmp, file)
}
export function validEndpoint(value:string){return /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(value)}
