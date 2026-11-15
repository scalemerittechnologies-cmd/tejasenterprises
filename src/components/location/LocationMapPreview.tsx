import { ArrowUpRight, MapPin } from 'lucide-react'
import { GOOGLE_BUSINESS_PROFILE_URL } from '@/lib/location'

export function LocationMapPreview({ className = '' }: { className?: string }) {
  return (
    <a
      className={`location-map-preview ${className}`.trim()}
      href={GOOGLE_BUSINESS_PROFILE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open Tejas Enterprises location in Maps"
    >
      <img
        src="/images/tejas/location-map.webp"
        alt="Map showing the Tejas Enterprises pin near Banaras Road and Phaphamau Junction"
        width={1558}
        height={958}
        loading="lazy"
        decoding="async"
      />
      <span className="location-map-preview-action"><MapPin size={17} aria-hidden="true" /> Open in Maps <ArrowUpRight size={17} aria-hidden="true" /></span>
    </a>
  )
}
