export const GOOGLE_BUSINESS_PROFILE_URL = 'https://maps.app.goo.gl/HsmWbS4ATT2376pb7?g_st=aw'

export function googleMapsDirectionsUrl(address: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
}
