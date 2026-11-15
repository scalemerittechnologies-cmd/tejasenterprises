'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'

type HeroSlide = { src: string; alt: string; width: number; height: number; fit: 'cover' | 'contain'; position?: string }
const slides: HeroSlide[] = [
  { src: '/images/tejas/powering-homes.webp', alt: 'Tejas Enterprises solar solutions for homes and businesses', width: 1400, height: 1123, fit: 'contain' },
  { src: '/images/tejas/solar-blue-sky.webp', alt: 'Solar panels beneath a bright blue sky', width: 2089, height: 753, fit: 'cover' },
  { src: '/images/tejas/solar-farmland.webp', alt: 'Rooftop solar panels overlooking farmland', width: 2172, height: 724, fit: 'cover', position: '60% center' },
  { src: '/images/tejas/solar-array.webp', alt: 'Close-up of a blue solar panel array', width: 2172, height: 724, fit: 'cover' },
  { src: '/images/solar-carport.webp', alt: 'Solar panel carport providing covered parking for vehicles', width: 1672, height: 941, fit: 'contain' },
]
export function HeroImageSlider() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    update(); media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  useEffect(() => {
    if (paused || reduced) return
    const timer = setInterval(() => { if (!document.hidden) setIndex(value => (value + 1) % slides.length) }, 5000)
    return () => clearInterval(timer)
  }, [paused, reduced, index])
  return <div className="hero-gallery">
    <section className="hero-image-slider" aria-label="Solar solutions gallery" aria-roledescription="carousel">
      <div className="hero-slider-window"><div className="hero-slider-track" style={{ transform: `translateX(-${index * 100}%)` }}>{slides.map((slide, i) => <div className="hero-image-slide" key={slide.src} aria-hidden={index !== i}><img src={slide.src} alt={slide.alt} width={slide.width} height={slide.height} style={{ objectFit: slide.fit, objectPosition: slide.position }} loading={i === 0 ? 'eager' : 'lazy'} decoding="async" fetchPriority={i === 0 ? 'high' : 'auto'} draggable={false} /></div>)}</div></div>
      <div className="hero-slider-controls">
        <button type="button" aria-label="Previous image" onClick={() => setIndex(value => (value - 1 + slides.length) % slides.length)}><ChevronLeft size={17}/></button>
        <div className="hero-slider-dots">{slides.map((slide, i) => <button type="button" key={slide.src} aria-label={`Show image ${i + 1}`} aria-current={index === i ? 'true' : undefined} onClick={() => setIndex(i)} />)}</div>
        <span className="hero-slider-count">0{index + 1} / 0{slides.length}</span>
        {!reduced && <button type="button" aria-label={paused ? 'Play slideshow' : 'Pause slideshow'} onClick={() => setPaused(value => !value)}>{paused ? <Play size={15}/> : <Pause size={15}/>}</button>}
        <button type="button" aria-label="Next image" onClick={() => setIndex(value => (value + 1) % slides.length)}><ChevronRight size={17}/></button>
      </div>
    </section>
  </div>
}
