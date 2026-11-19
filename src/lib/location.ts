// Resolved from the showroom's shared Maps link. A direct google.com URL avoids
// short-link failures in some desktop browsers and keeps the exact business pin.
export const GOOGLE_BUSINESS_PROFILE_URL = 'https://www.google.com/maps/place/Tejas+Enterprises+-+Solar+Energy+System+Dealers%2FRooftop+Solar+System%2FSolar+Atta+Chakki+Dealer+in+Prayagraj/@25.5275089,81.8626139,17z/data=!3m1!4b1!4m6!3m5!1s0x399acb49eb0a4d81:0x4da2aa435de23350!8m2!3d25.5275089!4d81.8651888!16s%2Fg%2F11hy7vlsqk'

export function googleMapsDirectionsUrl() {
  // Coordinates avoid Maps resolving the street address to a different point.
  return 'https://www.google.com/maps/dir/?api=1&destination=25.5275089%2C81.8651888'
}
