'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Volume2,
  VolumeX,
  MapPin,
  Clock,
  Phone,
  ExternalLink,
  Sparkles,
  ShieldCheck,
} from 'lucide-react'
import { T, useLanguage } from '@/components/language/LanguageProvider'
import type { SiteContent } from '@/lib/site-content'
import { EnquiryTriggerButton } from '@/components/ui/EnquiryTriggerButton'
import { GoogleMapsLink } from '@/components/location/GoogleMapsLink'

export function ShopVideo({
  content,
  localVideoExists,
}: {
  content: SiteContent
  localVideoExists: boolean
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)
  const [failed, setFailed] = useState(false)
  const [inView, setInView] = useState(false)
  const { language } = useLanguage()
  const hi = language === 'hi'

  const available = content.shopVideo !== '/videos/tejas-shop.mp4' || localVideoExists

  useEffect(() => {
    const video = ref.current
    if (!video) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.intersectionRatio >= 0.3
        setInView(visible)
        if (!visible) {
          video.pause()
          video.muted = true
          setMuted(true)
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(video)
    return () => {
      observer.disconnect()
    }
  }, [available])

  useEffect(() => {
    const video = ref.current
    if (!video || !available) return

    const stopPlayback = () => {
      video.pause()
      video.muted = true
      setMuted(true)
    }
    const syncPlayback = () => {
      if (document.hidden || !inView) {
        stopPlayback()
        return
      }
      video.play().catch(() => {})
    }

    syncPlayback()
    document.addEventListener('visibilitychange', syncPlayback)
    window.addEventListener('pagehide', stopPlayback)
    return () => {
      document.removeEventListener('visibilitychange', syncPlayback)
      window.removeEventListener('pagehide', stopPlayback)
    }
  }, [available, inView])

  const toggleMute = () => {
    const video = ref.current
    if (!video || !inView || document.hidden) return
    const nextMuted = !video.muted
    video.muted = nextMuted
    setMuted(nextMuted)
    if (!nextMuted && video.paused) video.play().catch(() => {
      video.muted = true
      setMuted(true)
    })
  }

  return (
    <section className="shop-experience" id="store" aria-labelledby="store-heading">
      <div className="shop-orb orb-one" aria-hidden="true" />
      <div className="shop-orb orb-two" aria-hidden="true" />

      {/* Left Column: Intro */}
      <div className="shop-copy">
        <span className="eyebrow">
          <Sparkles size={14} className="text-amber-500 inline mr-1" />
          <T hi="शोरूम व अनुभव केंद्र">OUR PRAYAGRAJ EXPERIENCE CENTER</T>
        </span>
        <h2 id="store-heading">
          <T hi="स्क्रीन से परे।">Beyond the Screen.</T>
          <br />
          <em><T hi="हमारे शोरूम में आएं।">Experience Solar in Person.</T></em>
        </h2>
        <p>
          <T hi="अपने सोलर सफ़र की शुरुआत सीधी बातचीत से करें। हमारे फाफामऊ स्थित शोरूम में आएं और सोलर पैनल, इन्वर्टर तथा अपनी छत के लिए उपलब्ध विकल्पों पर बात करें।">
            Visit our Phaphamau showroom to explore solar panels, inverters and rooftop options for your property with our team.
          </T>
        </p>

        <div className="shop-feature-pills">
          <span><ShieldCheck size={14} className="text-blue-600 inline mr-1" /> Live Demo Inverters</span>
          <span><Sparkles size={14} className="text-amber-500 inline mr-1" /> Instant Subsidy Calculation</span>
        </div>

        <div className="shop-cta-row">
          <EnquiryTriggerButton className="primary-cta">
            <T hi="विज़िट का समय तय करें">Schedule Store Visit</T>
          </EnquiryTriggerButton>
          <a className="secondary-cta" href={`tel:${content.phone.replace(/\D/g, '')}`}>
            <Phone size={15} />
            <T hi="कॉल करें">Call Specialist</T>
          </a>
        </div>
      </div>

      {/* Center Column: Portrait Video Frame */}
      <div className="video-halo">
        <div className="portrait-frame">
          {available && !failed ? (
            <video
              ref={ref}
              src={content.shopVideo}
              poster="/videos/tejas-shop-poster.jpg"
              muted={muted}
              autoPlay
              loop
              playsInline
              preload="metadata"
              aria-label={hi ? 'तेजस एंटरप्राइजेज़ स्टोर वीडियो' : 'Tejas Enterprises Store Tour'}
              onCanPlay={() => {
                if (inView && !document.hidden) ref.current?.play().catch(() => {})
              }}
              onError={() => setFailed(true)}
            />
          ) : (
            <img
              src="/videos/tejas-shop-poster.jpg"
              alt={hi ? 'तेजस एंटरप्राइजेज़ का वीडियो पोस्टर' : 'Tejas Enterprises video poster'}
              className="portrait-fallback-img"
            />
          )}

          <div className="frame-reflection" aria-hidden="true" />

          {available && !failed && (
            <button
              type="button"
              className="video-sound-control"
              onClick={toggleMute}
              aria-label={muted ? 'Unmute video' : 'Mute video'}
              aria-pressed={!muted}
              title={muted ? 'Turn sound on' : 'Mute sound'}
            >
              {muted ? <VolumeX size={20} aria-hidden="true" /> : <Volume2 size={20} aria-hidden="true" />}
            </button>
          )}

        </div>
      </div>

      {/* Right Column: High-End Location & Visit Details Card */}
      <div className="shop-location-card">
        <figure className="shop-storefront-photo">
          <img
            src={content.showroomPhoto}
            alt={hi ? 'प्रयागराज में तेजस एंटरप्राइजेज़ का ऑफिस बैनर' : 'Tejas Enterprises office banner in Prayagraj'}
            width={1448}
            height={1086}
            loading="lazy"
            decoding="async"
          />
        </figure>
        <div className="location-card-header">
          <span className="location-icon-badge">
            <MapPin size={20} className="text-blue-600" />
          </span>
          <div>
            <span className="location-eyebrow">HEAD OFFICE & SHOWROOM</span>
            <h3>Prayagraj, Uttar Pradesh</h3>
          </div>
        </div>

        <div className="location-address-group">
          <p className="location-address-text"><GoogleMapsLink className="location-address-link">{content.address}</GoogleMapsLink></p>
          <GoogleMapsLink className="google-profile-link">
            <ExternalLink size={15} aria-hidden="true" />
            <T hi="हमारी गूगल लिस्टिंग देखें">View our Google listing</T>
          </GoogleMapsLink>
        </div>

        <div className="location-hours">
          <Clock size={16} className="text-amber-500 flex-none" />
          <div>
            <strong>Planning a visit?</strong>
            <small>Call ahead to confirm showroom hours</small>
          </div>
        </div>

        <div className="location-action-btns">
          <GoogleMapsLink
            className="directions-link"
          >
            <MapPin size={15} />
            <T hi="गूगल मैप्स पर तेजस देखें">Open Tejas on Google Maps</T>
          </GoogleMapsLink>

          <a
            className="quick-call-link"
            href={`tel:${content.phone.replace(/\D/g, '')}`}
          >
            <Phone size={14} />
            <span>{content.phone}</span>
          </a>
        </div>
      </div>
    </section>
  )
}
