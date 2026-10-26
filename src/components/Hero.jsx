import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { MapPin, Moon, Phone, ShieldCheck, Headset, Sun, Sunset, Wifi, Waves } from 'lucide-react'
import { ADDRESS_LINE, GOOGLE_REVIEWS, MAPS_URL, PHONE, PHONE_DISPLAY, RATING, REVIEWS, img, waLink } from '../site'
import { GoogleG, Stars, WhatsAppIcon, isServer } from './ui'
import { formatTime, skyClock, sunPosition, sunsetToday } from './three/sky'
import { useTheme } from '../theme'

const OceanScene = lazy(() => import('./three/OceanScene'))

const SLIDES = [
  { src: img('view-from-homestay', true), caption: 'The view from our homestay — Sindhudurg Fort on the horizon' },
  { src: img('homestay-from-sea', true), caption: 'Laxmi Beach Homestay, seen from the sea', pos: 'object-[56%_50%]' },
  { src: img('room2', true), caption: 'Pink Paradise Room' },
  { src: img('room1', true), caption: 'Fresh Blue Sea View room' },
  { src: img('restraurant-1-image', true), caption: 'Laxmi Restaurant — fresh Malvani thalis' },
  { src: img('room3', true), caption: 'Blue Serenity Room' },
]

const STATS = [
  { icon: Waves, value: '10 m', label: 'from Malvan beach & Sindhudurg Fort jetty' },
  { icon: Headset, value: '24/7', label: 'guest support' },
  { icon: ShieldCheck, value: '100%', label: 'CCTV-covered govt. car parking' },
  { icon: Wifi, value: 'Free', label: 'high-speed Wi-Fi' },
]

// Loading backdrop roughly matching the live sky, so the 3D fade-in is gentle.
const FALLBACK = {
  night: 'bg-[linear-gradient(180deg,#03050c_0%,#0b1430_45%,#18223f_55%,#060607_56%,#020203_100%)]',
  dusk: 'bg-[linear-gradient(180deg,#0B0B0D_0%,#38456f_42%,#f2a35e_55%,#0a0a0c_56%,#020203_100%)]',
  day: 'bg-[linear-gradient(180deg,#17498f_0%,#3f86c8_40%,#d3e9f2_55%,#0c0d10_56%,#030304_100%)]',
  light: 'bg-[linear-gradient(180deg,#5d9bd3_0%,#9cc9ea_38%,#f3f9fb_52%,#1d97b0_53%,#0b5872_100%)]',
}

/**
 * Malvan's clock, ticking once a minute; drives the 3D sky. It is null in the
 * pre-rendered HTML and during hydration (the build's time is meaningless to a
 * visitor), and starts on the visitor's device right after.
 */
function useMalvanClock() {
  const [now, setNow] = useState(null)
  useEffect(() => {
    setNow(skyClock())
    const t = setInterval(() => setNow(skyClock()), 60000)
    return () => clearInterval(t)
  }, [])
  if (!now) return { now: null, sunset: null, phase: 'dusk', elevation: 0 }
  const { elevation } = sunPosition(now)
  const sunset = sunsetToday(now)
  const phase = elevation < -6 ? 'night' : elevation < 6 ? 'dusk' : 'day'
  return { now, sunset, phase, elevation }
}

function canUseWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch {
    return false
  }
}

/** Pauses the 3D scene once the hero scrolls out of view. */
function useInView(ref) {
  const [inView, setInView] = useState(true)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.02 })
    io.observe(el)
    return () => io.disconnect()
  }, [ref])
  return inView
}

function PhotoStack() {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (paused || reduce) return
    const t = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 5000)
    return () => clearInterval(t)
  }, [paused, reduce])

  const onMove = (e) => {
    if (reduce) return
    const r = e.currentTarget.getBoundingClientRect()
    setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * -10, y: ((e.clientX - r.left) / r.width - 0.5) * 12 })
  }

  return (
    <div
      className="relative mx-auto w-full max-w-[400px] [perspective:1200px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => { setPaused(false); setTilt({ x: 0, y: 0 }) }}
      onMouseMove={onMove}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className="relative transition-transform duration-300 ease-out [transform-style:preserve-3d]"
        style={{ transform: `rotateX(${tilt.x + 4}deg) rotateY(${tilt.y - 8}deg)` }}
      >
        {/* stacked cards behind for depth */}
        <div className="absolute inset-0 translate-x-6 translate-y-5 rounded-xl3 bg-on/10 ring-1 ring-on/15 [[data-theme=light]_&]:bg-white/50 [transform:translateZ(-60px)]" />
        <div className="absolute inset-0 translate-x-3 translate-y-2.5 rounded-xl3 bg-on/15 ring-1 ring-on/20 [[data-theme=light]_&]:bg-white/70 [transform:translateZ(-30px)]" />

        <figure className="relative aspect-[4/5] overflow-hidden rounded-xl3 bg-ink-2 shadow-lift ring-1 ring-white/25">
          {SLIDES.map((s, i) => (
            <img
              key={s.src}
              src={s.src}
              alt={s.caption}
              loading="lazy"
              className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[1200ms] ease-out ${s.pos || ''} ${
                i === index ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
              }`}
            />
          ))}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/85 to-transparent" />
          <figcaption className="absolute inset-x-0 bottom-0 p-5 [transform:translateZ(40px)]">
            <p className="text-[15px] font-semibold text-white" aria-live="polite">{SLIDES[index].caption}</p>
            <div className="-ml-1.5 mt-2 flex" role="group" aria-label="Choose photo">
              {SLIDES.map((s, i) => (
                <button
                  key={s.src}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show photo ${i + 1}: ${s.caption}`}
                  aria-current={i === index}
                  className="group grid h-7 min-w-7 place-items-center px-1.5"
                >
                  <span className={`block h-1.5 rounded-full transition-all ${i === index ? 'w-7 bg-saffron' : 'w-3 bg-white/45 group-hover:bg-white/80'}`} />
                </button>
              ))}
            </div>
          </figcaption>
        </figure>

      </div>
    </div>
  )
}

function ReviewTicker() {
  const items = [...REVIEWS, ...REVIEWS]
  return (
    <div className="group relative overflow-hidden border-t border-on/10 bg-scrim/55 backdrop-blur-md [[data-theme=light]_&]:bg-white/75">
      <h2 className="sr-only">Guest reviews from Google</h2>
      <ul className="flex w-max animate-[ticker_70s_linear_infinite] gap-10 py-3.5 group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] motion-reduce:animate-none">
        {items.map((r, i) => (
          <li key={i} aria-hidden={i >= REVIEWS.length} className="flex shrink-0 items-center gap-3 text-[14px]">
            <Stars size={12} className="text-star" />
            <a href={GOOGLE_REVIEWS} target="_blank" rel="noopener noreferrer" tabIndex={i >= REVIEWS.length ? -1 : 0} className="font-bold text-accent hover:underline">
              {r.name}
            </a>
            <span className="max-w-[46ch] truncate text-on/80">“{r.text}”</span>
          </li>
        ))}
      </ul>
      <style>{`@keyframes ticker { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
    </div>
  )
}

export default function Hero() {
  const reduce = useReducedMotion()
  const { theme } = useTheme()
  const light = theme === 'light'
  const section = useRef(null)
  const inView = useInView(section)

  // Scroll parallax: the sea drifts slowly, the words at reading speed and the
  // photo card fastest, so the three read as separate layers of depth.
  const { scrollYProgress: heroProgress } = useScroll({ target: section, offset: ['start start', 'end start'] })
  const sceneY = useTransform(heroProgress, [0, 1], reduce ? ['0%', '0%'] : ['0%', '32%'])
  const textY = useTransform(heroProgress, [0, 1], reduce ? [0, 0] : [0, -60])
  const cardY = useTransform(heroProgress, [0, 1], reduce ? [0, 0] : [0, -150])
  const [webgl, setWebgl] = useState(null)
  const [quality, setQuality] = useState('high')
  const [sceneReady, setSceneReady] = useState(false)
  const [focus, setFocus] = useState({ x: 0.5, y: 0.5, scrimTop: null, skyScrim: 0 })
  const clock = useMalvanClock()
  const SkyIcon = clock.phase === 'night' ? Moon : clock.phase === 'dusk' ? Sunset : Sun
  const textCol = useRef(null)
  const cardCol = useRef(null)
  const window_ = useRef(null)

  // Keep the fort and sun in open space: between headline and photo card on
  // desktop, and in a gap under the headline on phones.
  useEffect(() => {
    const measure = () => {
      const hero = section.current.getBoundingClientRect()
      if (window.innerWidth >= 1024) {
        const textRight = textCol.current.querySelector('h1').getBoundingClientRect().right
        const cardLeft = cardCol.current.getBoundingClientRect().left
        setFocus({ x: Math.min(0.75, (textRight + cardLeft) / 2 / window.innerWidth), y: 0.5, scrimTop: null, skyScrim: 0 })
        return
      }
      const gap = window_.current.getBoundingClientRect()
      const horizon = gap.top + gap.height * 0.8 - hero.top
      setFocus({ x: 0.62, y: horizon / hero.height, scrimTop: horizon + 6, skyScrim: gap.top - hero.top + gap.height * 0.35 })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(section.current)
    return () => ro.disconnect()
  }, [])

  // Start the 3D sea only once the page has loaded and the browser is idle, so
  // text, photos and buttons get the CPU first (it costs ~1.5 s on phones).
  useEffect(() => {
    const small = window.matchMedia('(max-width: 768px)').matches
    const lowCpu = (navigator.hardwareConcurrency || 8) <= 4
    if (small || lowCpu) setQuality('low')
    let idle
    const start = () => {
      const run = () => setWebgl(canUseWebGL())
      idle = window.requestIdleCallback ? window.requestIdleCallback(run, { timeout: 2500 }) : window.setTimeout(run, 1200)
    }
    if (document.readyState === 'complete') start()
    else window.addEventListener('load', start, { once: true })
    return () => {
      window.removeEventListener('load', start)
      if (window.cancelIdleCallback && idle) window.cancelIdleCallback(idle)
      else clearTimeout(idle)
    }
  }, [])

  // No entrance fade when pre-rendered HTML is already on screen.
  const still = reduce || isServer || window.__PRERENDERED__
  const fade = (delay) =>
    still ? {} : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay, ease: [0.2, 0.7, 0.2, 1] } }

  return (
    <section id="home" ref={section} className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-scrim text-on">
      {/* Dusk gradient shows while the 3D scene loads, and stays if WebGL is unavailable. */}
      <div className={`absolute inset-0 -z-10 ${FALLBACK[clock.phase]}`} />
      <div className={`absolute inset-0 -z-10 hidden [[data-theme=light]_&]:block ${FALLBACK.light}`} />
      {webgl === false && (
        <img src={img('view-from-homestay')} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-60" />
      )}
      {webgl && clock.now && (
        <motion.div style={{ y: sceneY }} className={`absolute inset-0 -z-10 transition-opacity duration-1000 ${sceneReady ? 'opacity-100' : 'opacity-0'}`}>
          <Suspense fallback={null}>
            <OceanScene animate={!reduce && inView} quality={quality} focusX={focus.x} focusY={focus.y} date={clock.now} appearance={light ? 'light' : 'live'} scroll={heroProgress} onReady={() => setSceneReady(true)} />
          </Suspense>
        </motion.div>
      )}
      {/* legibility scrims */}
      <div className="pointer-events-none absolute inset-0 -z-10 [[data-theme=light]_&]:opacity-60 bg-[linear-gradient(180deg,rgb(var(--scrim)/.55)_0%,rgb(var(--scrim)/0)_28%,rgb(var(--scrim)/0)_60%,rgb(var(--scrim)/.75)_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 hidden bg-[linear-gradient(90deg,rgb(var(--scrim)/.78)_0%,rgb(var(--scrim)/.4)_45%,rgb(var(--scrim)/0)_70%)] lg:block" />
      {focus.scrimTop !== null && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 [[data-theme=light]_&]:opacity-40 bg-[linear-gradient(180deg,rgb(var(--scrim)/.78)_0%,rgb(var(--scrim)/.6)_70%,rgb(var(--scrim)/0)_100%)] lg:hidden"
          style={{ height: focus.skyScrim }}
        />
      )}
      {focus.scrimTop !== null && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 bg-[linear-gradient(180deg,rgb(var(--scrim)/0)_0px,rgb(var(--scrim)/.72)_110px,rgb(var(--scrim)/.8)_100%)] lg:hidden"
          style={{ top: focus.scrimTop }}
        />
      )}

      <div className="mx-auto grid w-full max-w-page flex-1 items-center gap-12 px-4 pb-8 pt-28 sm:px-6 lg:grid-cols-[1.15fr_.85fr] lg:pt-24">
        <motion.div ref={textCol} style={{ y: textY }}>
          <motion.a
            {...fade(0.05)}
            href={GOOGLE_REVIEWS}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-full border border-on/20 bg-on/10 py-1.5 pl-2 pr-4 text-[13px] font-semibold backdrop-blur-md transition-colors hover:bg-on/20 [[data-theme=light]_&]:bg-white/75 [[data-theme=light]_&]:hover:bg-white"
          >
            <span className="grid h-6 w-6 place-items-center rounded-full bg-white"><GoogleG size={14} /></span>
            Best beach homestay in Malvan · {RATING}★ on Google
          </motion.a>

          <motion.h1 {...fade(0.18)} className="text-shadow mt-7 max-w-[15ch] font-display text-[clamp(2.6rem,6.2vw,4.7rem)] font-semibold leading-[0.98] tracking-[-0.025em]">
            <span className="mb-3 block font-body text-[13px] font-extrabold uppercase not-italic tracking-[0.22em] text-accent">Beach homestay in Malvan</span>
            Where the journey to <em className="font-medium italic text-highlight">Sindhudurg Fort</em> begins.
          </motion.h1>
          {/* open sky on phones where the fort and sunset show through */}
          <div ref={window_} aria-hidden="true" className="h-36 sm:h-44 lg:hidden" />
          <motion.p {...fade(0.26)} className="mt-6 max-w-xl text-[17px] leading-relaxed text-on/85 sm:text-lg">
            Sea-view AC rooms, authentic Malvani thalis and our own scuba diving &amp; water sports centre, right by the Sindhudurg Fort jetty.
          </motion.p>

          <motion.div {...fade(0.34)} className="mt-8 flex flex-wrap gap-3">
            <a href={waLink('Hi, I would like to book a stay at Laxmi Beach Homestay, Malvan. Please share availability.')} target="_blank" rel="noopener noreferrer" className="btn-primary">
              <WhatsAppIcon size={20} /> Book on WhatsApp
            </a>
            <a href={`tel:${PHONE}`} className="btn-outline-light">
              <Phone size={18} /> Call {PHONE_DISPLAY}
            </a>
          </motion.div>

          <motion.div {...fade(0.4)} className="mt-6 flex flex-col gap-2 text-[14px] text-on/75">
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-2 underline-offset-4 hover:text-on hover:underline">
              <MapPin size={16} className="mt-0.5 shrink-0 text-accent" />
              {ADDRESS_LINE}, Malvan 416606
            </a>
            <p className={`inline-flex items-center gap-2 transition-opacity duration-500 ${clock.now ? '' : 'opacity-0'}`} title="The sky above is drawn live for Malvan's time of day">
              <SkyIcon size={16} className="shrink-0 text-accent" aria-hidden="true" />
              <span>
                Malvan now <span className="font-semibold tabular-nums text-on">{clock.now ? formatTime(clock.now) : '--:--'}</span>
                <span className="text-on/40"> · </span>
                {!clock.now || clock.now < clock.sunset ? 'Sunset today ' : 'Sun set at '}
                <span className="font-semibold tabular-nums text-on">{clock.now ? formatTime(clock.sunset) : '--:--'}</span>
              </span>
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          ref={cardCol}
          className="hidden md:block"
          {...(still ? {} : { initial: { opacity: 0, y: 40, rotateX: 12 }, animate: { opacity: 1, y: 0, rotateX: 0 }, transition: { duration: 1.1, delay: 0.3, ease: [0.2, 0.7, 0.2, 1] } })}
        >
          <motion.div style={{ y: cardY }}>
            <PhotoStack />
          </motion.div>
        </motion.div>
      </div>

      <div className="mx-auto w-full max-w-page px-4 pb-6 sm:px-6">
        <ul aria-label="Why guests choose us" className="grid grid-cols-2 overflow-hidden rounded-2xl border border-on/15 bg-on/[0.07] backdrop-blur-md [[data-theme=light]_&]:bg-white/75 lg:grid-cols-4">
          {STATS.map(({ icon: Icon, value, label }, i) => (
            <li key={label} className={`flex items-center gap-3 p-4 sm:p-5 ${i % 2 ? 'border-l border-on/10' : ''} ${i > 1 ? 'border-t border-on/10 lg:border-t-0' : ''} ${i === 2 ? 'lg:border-l' : ''}`}>
              <Icon size={22} className="hidden shrink-0 text-accent sm:block" aria-hidden="true" />
              <div className="min-w-0">
                <span className="block font-display text-2xl font-semibold leading-none">{value}</span>
                <span className="mt-1 block text-[13px] leading-snug text-on/70">{label}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <ReviewTicker />
    </section>
  )
}
