'use client'

import { ReactNode } from 'react'

export function EnquiryTriggerButton({
  children,
  className = 'primary-cta',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        window.dispatchEvent(new Event('tejas-enquire'))
      }}
    >
      {children}
    </button>
  )
}

