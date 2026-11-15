const WHATSAPP_NUMBER = '919935685939'

export function getWhatsAppUrl(message?: string): string {
  const url = `https://wa.me/${WHATSAPP_NUMBER}`
  return message ? `${url}?text=${encodeURIComponent(message)}` : url
}
