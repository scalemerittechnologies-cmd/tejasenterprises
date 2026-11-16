'use client'

import type { ComponentPropsWithoutRef, MouseEvent } from 'react'
import { GOOGLE_BUSINESS_PROFILE_URL } from '@/lib/location'

type GoogleMapsLinkProps = Omit<ComponentPropsWithoutRef<'a'>, 'target' | 'rel'>

function isMobileDevice() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

export function GoogleMapsLink({ href = GOOGLE_BUSINESS_PROFILE_URL, onClick, ...props }: GoogleMapsLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    // A same-tab Maps link can hand off to the installed app on mobile.
    // Desktop visitors keep the current page open in a separate tab.
    if (isMobileDevice()) event.currentTarget.target = '_self'
    onClick?.(event)
  }

  return <a {...props} href={href} target="_blank" rel="noopener noreferrer" onClick={handleClick} />
}
