'use client'

import { useEffect, useRef } from 'react'
import { VolumeX } from 'lucide-react'
import { T } from '@/components/language/LanguageProvider'

const videos = [
  {
    src: '/videos/installations/rooftop-solar-walkthrough.mp4',
    poster: '/videos/installations/rooftop-solar-walkthrough-poster.jpg',
    title: 'The rooftop array',
    titleHi: 'छत पर सोलर पैनल',
    description: 'A wide view of the panels and their raised support structure.',
    descriptionHi: 'सोलर पैनलों और उनके ऊंचे सपोर्ट स्ट्रक्चर का विस्तृत दृश्य।',
  },
  {
    src: '/videos/installations/rooftop-panel-closeup.mp4',
    poster: '/videos/installations/rooftop-panel-closeup-poster.jpg',
    title: 'A closer look at installation',
    titleHi: 'इंस्टॉलेशन को करीब से देखें',
    description: 'Panel details and work on a rooftop installation.',
    descriptionHi: 'रूफटॉप इंस्टॉलेशन के दौरान पैनलों और काम की झलक।',
  },
  {
    src: '/videos/installations/solar-installation-structure.mp4',
    poster: '/videos/installations/solar-installation-structure-poster.jpg',
    title: 'Panels and mounting structure',
    titleHi: 'पैनल और माउंटिंग स्ट्रक्चर',
    description: 'Views from above and below the installed panels.',
    descriptionHi: 'लगे हुए पैनलों को ऊपर और नीचे से देखें।',
  },
] as const

type ProjectVideo = (typeof videos)[number]

function ProjectVideoCard({ video, index, registerVideo }: {
  video: ProjectVideo
  index: number
  registerVideo: (index: number, element: HTMLVideoElement | null) => void
}) {
  return (
    <article className="installation-video-card">
      <div className="installation-video-media" style={{ backgroundImage: `url('${video.poster}')` }}>
        <video
          ref={(element) => registerVideo(index, element)}
          muted
          loop
          playsInline
          preload="metadata"
          poster={video.poster}
          aria-label={video.title}
          onVolumeChange={(event) => { if (!event.currentTarget.muted) event.currentTarget.muted = true }}
        >
          <source src={video.src} type="video/mp4" />
          Your browser does not support video playback.
        </video>
        <div className="installation-video-top" aria-hidden="true">
          <span className="installation-video-index">{String(index + 1).padStart(2, '0')} / 03</span>
          <span className="installation-video-muted"><VolumeX size={14} /> <T hi="साइलेंट वीडियो">SILENT VIDEO</T></span>
        </div>
      </div>
      <div className="installation-video-copy">
        <h3><T hi={video.titleHi}>{video.title}</T></h3>
        <p><T hi={video.descriptionHi}>{video.description}</T></p>
      </div>
    </article>
  )
}

export function ProjectVideos() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const players = videoRefs.current
    let inView = false

    function syncPlayback() {
      const shouldPlay = inView && !document.hidden && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      players.forEach((video) => {
        if (!video) return
        if (shouldPlay) {
          video.muted = true
          void video.play().catch(() => {})
        } else {
          video.pause()
        }
      })
    }

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      syncPlayback()
    }, { threshold: 0.08, rootMargin: '0px 0px -12% 0px' })

    observer.observe(section)
    document.addEventListener('visibilitychange', syncPlayback)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', syncPlayback)
      players.forEach((video) => video?.pause())
    }
  }, [])

  return (
    <section id="installation-videos" ref={sectionRef} className="installation-videos-section" aria-labelledby="installation-videos-heading">
      <div className="section-heading">
        <span className="eyebrow"><T hi="असली प्रोजेक्ट वीडियो">REAL PROJECT FOOTAGE</T></span>
        <h2 id="installation-videos-heading"><T hi="रूफटॉप सोलर को करीब से देखें">See rooftop solar in action</T></h2>
        <p><T hi="सोलर पैनल, इंस्टॉलेशन के काम और सपोर्ट स्ट्रक्चर के तीन वास्तविक वीडियो।">Three real on-site views of solar panels, installation work and the supporting structure.</T></p>
      </div>
      <div className="installation-videos-grid">
        {videos.map((video, index) => (
          <ProjectVideoCard
            key={video.src}
            video={video}
            index={index}
            registerVideo={(videoIndex, element) => { videoRefs.current[videoIndex] = element }}
          />
        ))}
      </div>
    </section>
  )
}
