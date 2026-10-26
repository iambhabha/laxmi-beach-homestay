import { useRef } from 'react'
import { MapPin, Phone } from 'lucide-react'
import {
  ADDRESS_CITY, ADDRESS_LINE, CERTS, CHECK_IN, CHECK_OUT, GOOGLE_REVIEWS, MAPS_URL, PHONE, PHONE_DISPLAY,
  RATING, WHATSAPP_DISPLAY, waLink,
} from '../site'
import { Brand, GoogleG, Stars, WhatsAppIcon } from './ui'
import { ROOMS } from './Rooms'
import { useTheme } from '../theme'

const COLUMNS = [
  { title: 'Stay', links: ROOMS.map((r) => [r.title, '#rooms']) },
  {
    title: 'Experiences',
    links: [
      ['Scuba diving', '#water-sports'],
      ['Parasailing', '#water-sports'],
      ['Jet ski & rides', '#water-sports'],
      ['Packages', '#water-sports'],
      ['Malvani thalis', '#food'],
    ],
  },
  {
    title: 'Plan',
    links: [
      ['Explore Malvan', '#explore'],
      ['How to reach', '#plan'],
      ['Gallery', '#gallery'],
      ['FAQ', '#faq'],
      ['Book your stay', '#book'],
    ],
  },
]

const QUICK = [
  { label: `WhatsApp ${WHATSAPP_DISPLAY}`, href: waLink(), icon: <WhatsAppIcon size={18} />, external: true },
  { label: `Call ${PHONE_DISPLAY}`, href: `tel:${PHONE}`, icon: <Phone size={18} /> },
  { label: 'Directions on Google Maps', href: MAPS_URL, icon: <MapPin size={18} />, external: true },
  { label: 'Our Google reviews', href: GOOGLE_REVIEWS, icon: <GoogleG size={16} />, external: true },
]

const ext = { target: '_blank', rel: 'noopener noreferrer' }

export default function Footer() {
  const light = useTheme().theme === 'light'
  const mark = useRef(null)
  // The colour on the big name follows the mouse across the letters.
  const follow = (e) => {
    if (e.pointerType !== 'mouse') return
    const r = mark.current.getBoundingClientRect()
    mark.current.style.setProperty('--mx', `${Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100))}%`)
  }
  const rest = () => mark.current.style.removeProperty('--mx')
  return (
    <footer onPointerMove={follow} onPointerLeave={rest} className="relative isolate overflow-hidden bg-surface-footer pb-28 text-on/75 md:pb-10">
      {/* dot grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(rgb(var(--on)/0.09)_1px,transparent_1.2px)] [background-size:22px_22px] [mask-image:linear-gradient(180deg,transparent,#000_18%,#000_80%,transparent)]"
      />

      <div className="mx-auto max-w-page px-4 sm:px-6">
        {/* The name, set large behind the card; its glow follows the mouse (see .footer-mark). */}
        <p ref={mark} aria-hidden="true" className="footer-mark select-none pt-12 text-center font-display text-[clamp(5rem,25vw,19rem)] font-bold leading-none tracking-[-0.04em] sm:pt-16">
          LAXMI
        </p>

        <div className="relative rounded-[28px] bg-ink-2 p-6 ring-1 ring-on/10 [[data-theme=light]_&]:bg-sand sm:p-10">
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-[1.8fr_1fr_1fr_1fr_1.4fr]">
            <div className="col-span-2 md:col-span-3 lg:col-span-1">
              <Brand onDark={!light} />
              <p className="mt-5 max-w-xs text-[14px] leading-relaxed">
                Sea-view AC rooms, homemade Malvani food and our own scuba &amp; water sports centre, at the Sindhudurg Fort jetty.
              </p>
              <ul className="mt-6 flex gap-2.5" aria-label="Contact us">
                {QUICK.map((q) => (
                  <li key={q.label}>
                    <a
                      href={q.href}
                      {...(q.external ? ext : {})}
                      aria-label={q.label}
                      title={q.label}
                      className="grid h-11 w-11 place-items-center rounded-xl text-on ring-1 ring-on/15 transition-colors hover:bg-on/[0.08] hover:text-accent"
                    >
                      {q.icon}
                    </a>
                  </li>
                ))}
              </ul>
              <a href={GOOGLE_REVIEWS} {...ext} className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-on hover:text-accent">
                {RATING} <Stars size={12} className="text-star" /> on Google
              </a>
            </div>

            <nav aria-label="Footer" className="contents">
              {COLUMNS.map((col) => (
                <div key={col.title}>
                  <h2 className="text-[13px] font-medium text-on/55">{col.title}</h2>
                  <ul className="mt-4 space-y-3 text-[14px] font-semibold text-on/90">
                    {col.links.map(([label, href]) => (
                      <li key={label}><a href={href} className="transition-colors hover:text-accent">{label}</a></li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>

            <div className="col-span-2 md:col-span-1">
              <h2 className="text-[13px] font-medium text-on/55">Visit</h2>
              <address className="mt-4 space-y-3 text-[14px] not-italic">
                <a href={MAPS_URL} {...ext} className="block font-semibold text-on/90 hover:text-accent">
                  {ADDRESS_LINE}, {ADDRESS_CITY}
                </a>
                <a href={`tel:${PHONE}`} className="block font-semibold text-on/90 hover:text-accent">{PHONE_DISPLAY}</a>
                <p>Check-in {CHECK_IN}<br />Check-out {CHECK_OUT}</p>
              </address>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-on/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[13px] font-medium text-on/55">Certified &amp; government approved</p>
            <ul className="flex flex-wrap gap-2.5">
              {CERTS.map((c) => (
                <li key={c.name} className="flex items-center gap-2.5 rounded-xl bg-white py-1.5 pl-1.5 pr-3.5 text-[13px] font-bold text-ink ring-1 ring-ink/10">
                  <img src={c.src} alt="" loading="lazy" className="h-9 w-9 rounded-lg object-contain" />
                  {c.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p suppressHydrationWarning className="px-2 pt-6 text-[12px] text-on/55">
          © {new Date().getFullYear()} Laxmi Beach Homestay &amp; Restaurant, Malvan, Sindhudurg.
        </p>
      </div>
    </footer>
  )
}
