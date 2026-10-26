import { useEffect, useRef, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

export function WhatsAppIcon({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.42.25-.69.25-1.29.18-1.41-.08-.13-.28-.2-.57-.35M12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.81 11.81 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.17-1.24-6.16-3.48-8.4" />
    </svg>
  )
}

export function GoogleG({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" fill="#34A853" />
      <path d="M5.84 14.09A6.6 6.6 0 0 1 5.49 12c0-.73.13-1.43.35-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" fill="#EA4335" />
    </svg>
  )
}

export function Stars({ className = 'text-saffron', size = 14, label = '5 out of 5 stars' }) {
  return (
    <span className={`inline-flex ${className}`} role="img" aria-label={label}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L10 14.8l-5.2 2.8 1-5.8L1.5 7.7l5.9-.8z" />
        </svg>
      ))}
    </span>
  )
}

// True while the page is pre-rendered to static HTML at build time.
export const isServer = typeof window === 'undefined'

/** False on the server and while the pre-rendered HTML hydrates, true after. */
export function useHydrated() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false)
}
const noopSubscribe = () => () => {}

// One observer for every Reveal on the page. Its first report says where an
// element starts: content already on screen is left alone, content further
// down is hidden then and faded in when it scrolls up into view. Reading the
// position from the observer (not getBoundingClientRect) avoids forcing the
// browser to lay out the whole page during hydration.
let revealObserver
const seen = new WeakSet()
function observeOnce(el) {
  revealObserver ??= new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const t = e.target
        if (!seen.has(t)) {
          seen.add(t)
          const r = e.boundingClientRect
          const below = r.top > window.innerHeight || (r.width === 0 && r.height === 0)
          if (e.isIntersecting || !below) {
            revealObserver.unobserve(t)
            continue
          }
          t.dataset.reveal = 'hidden'
          continue
        }
        if (!e.isIntersecting) continue
        t.dataset.reveal = 'shown'
        revealObserver.unobserve(t)
      }
    },
    { rootMargin: '0px 0px -12% 0px' },
  )
  revealObserver.observe(el)
  return () => revealObserver.unobserve(el)
}

/**
 * Fades content up once as it scrolls into view. The markup is the same on the
 * server and the client, so the pre-rendered page hydrates without being
 * redrawn, and nothing already on screen ever blinks out. Reduced motion: no
 * effect at all.
 */
export function Reveal({ children, delay = 0, y = 14, className = '', as: Comp = 'div' }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    el.style.setProperty('--reveal-y', `${y}px`)
    el.style.setProperty('--reveal-delay', `${delay}s`)
    return observeOnce(el)
  }, [delay, y])
  return <Comp ref={ref} className={className}>{children}</Comp>
}

export function SectionHeader({ eyebrow, title, intro, tone = 'light', align = 'left', className = '' }) {
  const dark = tone === 'dark'
  return (
    <div className={`${align === 'center' ? 'mx-auto text-center' : ''} max-w-2xl ${className}`}>
      <Reveal>
        <p className={`eyebrow ${dark ? 'text-accent' : 'text-sea-mid'}`}>{eyebrow}</p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className={`h-section mt-3 ${dark ? 'text-on' : 'text-ink'}`}>{title}</h2>
      </Reveal>
      {intro && (
        <Reveal delay={0.1}>
          <p className={`mt-4 text-[17px] leading-relaxed ${dark ? 'text-on/75' : 'text-muted'}`}>{intro}</p>
        </Reveal>
      )}
    </div>
  )
}

/** Accessible dialog: Esc closes, focus moves in and returns, page scroll locks. */
export function Modal({ open, onClose, label, children, className = '' }) {
  const panel = useRef(null)
  const lastFocus = useRef(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    if (!open) return
    lastFocus.current = document.activeElement
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => panel.current?.focus(), 30)
    const onKey = (e) => e.key === 'Escape' && closeRef.current()
    window.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', onKey)
      lastFocus.current?.focus?.()
    }
  }, [open])

  if (!open) return null
  // Portalled to <body> so a section's CSS containment can't trap the overlay.
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-ink/80 p-3 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose}>
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className={`relative my-auto w-full outline-none ${className}`}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}

export function CloseButton({ onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close"
      className={`grid h-11 w-11 place-items-center rounded-full bg-ink/60 text-white backdrop-blur transition-colors hover:bg-ink/80 ${className}`}
    >
      <X size={20} />
    </button>
  )
}

const MARK_PATH =
  'M57 315C110 205 330 162 583 162S1056 205 1109 315L977 875 952 965C935 995 912 1008 896 996 884 988 880 978 882 965L897 710C897 645 840 610 750 610 680 610 625 640 583 680 541 640 486 610 416 610 326 610 269 645 269 710L284 965C286 978 282 988 270 996 254 1008 231 995 214 965L187 875Z'

/** The Laxmi mark: saffron arch with the rising red sun. */
export function LogoMark({ className = 'h-9 w-auto' }) {
  return (
    <svg viewBox="47 152 1072 860" className={className} aria-hidden="true">
      <path fill="#F5B82A" d={MARK_PATH} />
      <circle fill="#E4312A" cx="584" cy="397" r="96" />
      <rect fill="#E4312A" x="492" y="511" width="187" height="11" />
      <rect fill="#E4312A" x="526" y="534" width="113" height="11" />
    </svg>
  )
}

/** Mark plus wordmark. `onDark` picks white or ink lettering. */
export function Brand({ onDark = true, size = 'md' }) {
  const big = size === 'lg'
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark className={big ? 'h-12 w-auto' : 'h-9 w-auto sm:h-10'} />
      <span className="flex flex-col leading-none">
        <span className={`font-display font-bold tracking-[0.06em] ${big ? 'text-[30px]' : 'text-[24px] sm:text-[26px]'} ${onDark ? 'text-white' : 'text-ink'}`}>
          LAXMI
        </span>
        <span className={`mt-1 font-bold uppercase tracking-[0.14em] ${big ? 'text-[10.5px]' : 'text-[9px] sm:text-[9.5px]'} ${onDark ? 'text-saffron' : 'text-sand-deep'}`}>
          Beach Homestay <span className={onDark ? 'text-white/80' : 'text-ink/60'}>&amp;</span> <span className={onDark ? 'text-[#FF6B5E]' : 'text-sindoor'}>Restaurant</span>
        </span>
      </span>
    </span>
  )
}
