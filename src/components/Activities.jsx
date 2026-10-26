import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowUpRight, Check, Clock, ShieldCheck, Users, Video } from 'lucide-react'
import { CERTS, TOUR_SCUBA, img, srcset, waLink } from '../site'
import { CloseButton, Modal, Reveal, SectionHeader, WhatsAppIcon } from './ui'
import ParallaxImg from './ParallaxImg'

const CENTRE = 'Om Shiv Moreshwar Scuba Diving Center'

export const ACTIVITIES = {
  parasailing: {
    name: 'Parasailing',
    image: 'parasaili',
    zone: 'sky',
    spec: 'Up to 200 ft high',
    duration: '5–10 min',
    short: 'Fly above the Arabian Sea with aerial views of the Malvan coastline and its forts.',
    about: 'Experience the thrill of flying high above the Arabian Sea while enjoying panoramic views of Malvan’s coastline and historic forts.',
    facts: [['Height', '90 ft (Basic) · 200 ft (Premium)'], ['Best for', 'Couples, families, thrill-seekers'], ['Minimum age', '10 years · max weight 100 kg']],
    includes: ['Safety harness & equipment', 'Life jacket', 'Professional crew', 'Speedboat ride', 'Pre-flight briefing', 'Landing assistance'],
  },
  jetski: {
    name: 'Jet Ski',
    image: 'jet-skis',
    zone: 'surface',
    spec: '100–200 m ride',
    duration: '100 m (Basic) · 200 m (Premium)',
    short: 'A high-speed ride across the open sea. Feel the wind and the waves.',
    about: 'Jet skiing offers a heart-pumping, high-speed ride across the sparkling waters of the Arabian Sea.',
    facts: [['Distance', '100 m (Basic) · 200 m (Premium)'], ['Best for', 'Individuals, couples, thrill-seekers'], ['Minimum age', '8 years (with guardian under 16)']],
    includes: ['Jet ski ride', 'Life jacket', 'Certified instructor', 'Safety briefing', 'Helmet & safety gear'],
  },
  banana: {
    name: 'Banana Ride',
    image: 'banana-ride',
    zone: 'surface',
    spec: '100–200 m ride',
    duration: '100 m (Basic) · 200 m (Premium)',
    short: 'A fun group ride on an inflatable banana boat. Expect splashes!',
    about: 'One of the most popular group activities in Malvan — sit on a large inflatable banana boat pulled at speed by a speedboat.',
    facts: [['Distance', '100 m (Basic) · 200 m (Premium)'], ['Best for', 'Families, friends, groups'], ['Riders', 'Up to 6 per ride · minimum age 6']],
    includes: ['Inflatable banana boat', 'Life jacket for all', 'Professional crew', 'Speedboat tow', 'Safety harness'],
  },
  bumper: {
    name: 'Bumper Ride',
    image: 'bumper-ride',
    zone: 'surface',
    spec: '100–200 m ride',
    duration: '100 m (Basic) · 200 m (Premium)',
    short: 'A bouncy sea ride with big waves and bigger smiles. Hold on tight!',
    about: 'An inflatable bumper boat pulled by a speedboat that skips and bounces across the waves for maximum fun.',
    facts: [['Distance', '100 m (Basic) · 200 m (Premium)'], ['Best for', 'Teenagers, adults, groups'], ['Riders', 'Up to 4 per ride · minimum age 8']],
    includes: ['Inflatable bumper boat', 'Life jacket for all', 'Professional crew', 'High-speed speedboat', 'Safety briefing'],
  },
  scuba: {
    name: 'Scuba Diving',
    image: 'scuba',
    zone: 'under',
    spec: '20–30 ft deep',
    duration: '10–15 min',
    short: 'See Malvan’s marine life with certified instructors. No swimming needed.',
    about: 'Explore marine life, colourful fish and coral formations in the clear waters off Malvan. Our certified instructors give you full training and safety guidance before you enter the water.',
    facts: [['Depth', '20–30 ft'], ['Best for', 'Beginners, couples, families'], ['Minimum age', '8 years · no swimming required']],
    includes: ['PADI-certified instructor', 'Complete scuba equipment', 'Pre-dive safety training', 'Free underwater video', 'Life jacket & safety gear', 'On-site medical support'],
  },
  deepScuba: {
    name: 'Deep Scuba Diving',
    image: 'scuba',
    imgClass: 'object-[34%_30%] scale-[2.3] origin-[36%_26%]',
    zone: 'under',
    spec: '40–50 ft deep',
    duration: '20 min',
    short: 'Our premium dive to deeper reefs, with free HD video.',
    about: 'The premium experience for those who want to explore deeper underwater ecosystems of the Arabian Sea, accompanied every step of the way by an experienced PADI dive master.',
    facts: [['Depth', '40–50 ft'], ['Best for', 'Adventure seekers, repeat divers'], ['Minimum age', '12 years · good health required']],
    includes: ['Senior PADI dive master', 'Advanced scuba equipment', 'Extended safety briefing', 'Free HD video', 'Oxygen tank & regulator', 'Emergency safety equipment'],
  },
}

const ZONES = [
  { id: 'sky', label: 'Above the sea', level: '+200 ft', ids: ['parasailing'], bg: 'bg-[linear-gradient(180deg,#1b2b52_0%,#3f5f8f_70%,#86bcd2_100%)]' },
  { id: 'surface', label: 'On the sea', level: '0 ft', ids: ['jetski', 'banana', 'bumper'], bg: 'bg-[linear-gradient(180deg,#0e7490_0%,#0b4a63_100%)]' },
  { id: 'under', label: 'Under the sea', level: '−50 ft', ids: ['scuba', 'deepScuba'], bg: 'bg-[linear-gradient(180deg,#0b4a63_0%,#062a3c_55%,#03141f_100%)]' },
]

const PACKAGES = [
  {
    id: 'basic',
    name: 'Basic package',
    note: '5 activities',
    rows: ['Parasailing up to 90 ft', 'Scuba diving up to 10 min', 'Jet ski 100 m', 'Banana ride 100 m', 'Bumper ride 100 m'],
    extra: 'Free video shoot',
  },
  {
    id: 'premium',
    name: 'Premium package',
    note: '5 activities · deeper, longer, higher',
    badge: 'Best value',
    rows: ['Parasailing up to 200 ft', 'Deep scuba diving up to 20 min', 'Jet ski 200 m', 'Banana ride 200 m', 'Bumper ride 200 m'],
    extra: 'Free HD video shoot',
  },
]

const book = (what) => waLink(`Hi, I want to book *${what}* at ${CENTRE}, Malvan. Please share pricing and schedule.`)

function ActivityCard({ a, onOpen, wide }) {
  const zoom = a.imgClass ? a.imgClass : 'transition-transform duration-700 group-hover:scale-105'
  return (
    <article className="group relative h-full overflow-hidden rounded-xl2 bg-ink-2 ring-1 ring-white/10 transition-shadow duration-300 hover:ring-white/25">
      <button type="button" onClick={() => onOpen(a)} className={`h-full w-full text-left ${wide ? 'grid sm:grid-cols-[1.3fr_1fr]' : 'block'}`}>
        <div className={`relative overflow-hidden ${wide ? 'aspect-[4/3] sm:aspect-auto sm:min-h-[280px]' : 'aspect-[4/3]'}`}>
          {a.imgClass ? (
            <img src={img(a.image)} alt="" loading="lazy" className={`absolute inset-0 h-full w-full object-cover ${zoom}`} />
          ) : (
            <ParallaxImg src={img(a.image, true)} srcSet={wide ? undefined : srcset(a.image)} sizes="(min-width: 1024px) 320px, (min-width: 640px) 46vw, 92vw" amount={wide ? 10 : 7} className={`!absolute inset-0 ${zoom}`} />
          )}
          <div className={`absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent ${wide ? 'sm:hidden' : ''}`} />
          <span className="chip absolute left-3 top-3 bg-ink/70 text-white backdrop-blur">{a.spec}</span>
        </div>
        <div className={`relative p-5 ${wide ? '-mt-12 pt-0 sm:mt-0 sm:flex sm:flex-col sm:justify-center sm:p-8' : '-mt-12 pt-0'}`}>
          <h3 className={`font-display font-semibold text-white ${wide ? 'text-2xl sm:text-4xl' : 'text-2xl'}`}>{a.name}</h3>
          <p className="mt-1.5 text-[14px] leading-relaxed text-white/70">{wide ? a.about : a.short}</p>
          <span className="mt-3 inline-flex items-center gap-1 text-[14px] font-bold text-saffron">
            Details &amp; safety <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </button>
    </article>
  )
}

function ActivityModal({ a, onClose }) {
  return (
    <Modal open={!!a} onClose={onClose} label={a?.name} className="max-w-3xl">
      {a && (
        <div className="overflow-hidden rounded-xl3 bg-white shadow-lift">
          <div className="relative aspect-[16/8]">
            <img src={img(a.image)} alt={a.name} className={`h-full w-full object-cover ${a.imgClass || ''}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
            <CloseButton onClick={onClose} className="absolute right-3 top-3" />
            <div className="absolute bottom-4 left-5 right-5 text-white">
              <h3 className="font-display text-3xl font-semibold">{a.name}</h3>
              <p className="mt-1 flex items-center gap-2 text-[14px] text-white/80"><Clock size={14} /> {a.duration}</p>
            </div>
          </div>
          <div className="p-6 sm:p-8">
            <p className="leading-relaxed text-muted">{a.about}</p>
            <dl className="mt-5 grid gap-3 sm:grid-cols-3">
              {a.facts.map(([k, v]) => (
                <div key={k} className="rounded-xl bg-wave-soft/60 p-3">
                  <dt className="text-[12px] font-bold uppercase tracking-wider text-sea">{k}</dt>
                  <dd className="mt-1 text-[14px] font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
            <h4 className="mt-6 font-bold">What’s included</h4>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {a.includes.map((t) => (
                <li key={t} className="flex items-center gap-2 text-[14px]"><Check size={16} className="shrink-0 text-emerald-600" /> {t}</li>
              ))}
            </ul>
            <p className="mt-6 flex gap-2 rounded-xl bg-sand p-3 text-[13px] leading-relaxed text-ink/80">
              <ShieldCheck size={18} className="shrink-0 text-sea" />
              Conducted by PADI-certified professionals, approved by MMB Maharashtra (Maharashtra Maritime Board). Full safety equipment for every guest.
            </p>
            <a href={book(a.name)} target="_blank" rel="noopener noreferrer" className="btn-primary mt-6 w-full">
              <WhatsAppIcon size={20} /> Book {a.name}
            </a>
          </div>
        </div>
      )}
    </Modal>
  )
}

/**
 * Reads out altitude and depth as the chart scrolls past the middle of the
 * screen: +200 ft over the parasailing, 0 ft on the surface, −50 ft at the
 * bottom of the dive zone.
 */
function DepthGauge({ chart, zones }) {
  const bounds = useRef({ sky: 1, surface: 2, total: 3 })
  const { scrollYProgress } = useScroll({ target: chart, offset: ['start center', 'end center'] })

  useEffect(() => {
    const measure = () => {
      const [sky, surface, under] = zones.current
      if (!sky || !surface || !under) return
      bounds.current = {
        sky: sky.offsetHeight,
        surface: sky.offsetHeight + surface.offsetHeight,
        total: sky.offsetHeight + surface.offsetHeight + under.offsetHeight,
      }
    }
    measure()
    const ro = new ResizeObserver(measure)
    zones.current.forEach((z) => z && ro.observe(z))
    return () => ro.disconnect()
  }, [zones])

  const feet = (p) => {
    const { sky, surface, total } = bounds.current
    const y = p * total
    if (y <= sky) return Math.round(200 * (1 - y / sky))
    if (y <= surface) return 0
    return -Math.round((50 * (y - surface)) / (total - surface))
  }
  const value = useTransform(scrollYProgress, (p) => {
    const f = feet(p)
    return `${f > 0 ? '+' : f < 0 ? '−' : ''}${Math.abs(f)} ft`
  })
  const label = useTransform(scrollYProgress, (p) => {
    const f = feet(p)
    return f > 0 ? 'Altitude' : f < 0 ? 'Depth' : 'Sea level'
  })
  const fill = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  // Reduced motion: hidden with CSS, so the markup matches the pre-rendered page.
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 hidden w-28 lg:block motion-reduce:!hidden">
      <div className="absolute inset-y-6 right-8 w-px bg-white/25">
        <motion.div style={{ height: fill }} className="w-px bg-saffron" />
      </div>
      <div className="sticky top-[calc(50%-28px)] mt-6 flex justify-end pr-3">
        <div className="relative rounded-xl bg-ink/80 px-3 py-2 text-right shadow-lift ring-1 ring-white/15 backdrop-blur">
          <motion.p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-saffron">{label}</motion.p>
          <motion.p className="font-display text-xl font-semibold tabular-nums leading-tight text-white">{value}</motion.p>
        </div>
      </div>
    </div>
  )
}

export default function Activities() {
  const [open, setOpen] = useState(null)
  const chart = useRef(null)
  const zoneEls = useRef([])

  return (
    <section id="water-sports" className="relative overflow-clip bg-surface-sports py-20 text-on sm:py-28">
      <div className="mx-auto max-w-page px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
          <SectionHeader
            tone="dark"
            eyebrow="Water sports & diving"
            title="Every water adventure, from our own centre"
            intro="Book straight from your room: our scuba diving and water sports centre runs every activity below, with certified instructors and full safety gear."
          />
          <Reveal delay={0.1}>
            <div className="rounded-xl3 border border-on/10 bg-on/[0.04] p-5 sm:p-6 [[data-theme=light]_&]:bg-white [[data-theme=light]_&]:shadow-card">
              <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-accent">Om Shiv Moreshwar</p>
              <p className="mt-1 font-display text-xl font-semibold leading-snug">Super Scuba Diving, Deep Diving &amp; Snorkelling Center</p>
              <p className="mt-2 text-[14px] text-on/70">The first scuba diving &amp; water sports centre in Maharashtra — approved by MMB Maharashtra (Maharashtra Maritime Board).</p>
              <ul className="mt-4 flex flex-wrap gap-3">
                {CERTS.map((c) => (
                  <li key={c.name} className="flex items-center gap-2 rounded-xl bg-white py-1.5 pl-1.5 pr-3 text-[12px] font-bold text-ink ring-1 ring-ink/10">
                    <img src={c.src} alt="" loading="lazy" className="h-8 w-8 rounded-lg object-contain" />
                    {c.name}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* Altitude → depth chart */}
        <div ref={chart} className="relative mt-14 overflow-clip rounded-[2rem] ring-1 ring-white/10">
          <div className="grid">
            {ZONES.map((zone, zi) => (
              <div key={zone.id} ref={(el) => (zoneEls.current[zi] = el)} className={`relative grid gap-5 px-4 py-8 sm:px-8 sm:py-10 lg:grid-cols-[150px_1fr] lg:pr-32 ${zone.bg} ${zone.id === 'surface' ? 'border-t-2 border-dashed border-white/60' : ''}`}>
                <div className="flex items-baseline gap-3 lg:block">
                  <p className="font-display text-3xl font-semibold tabular-nums text-white lg:text-4xl">{zone.level}</p>
                  <p className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-white/75 lg:mt-1">{zone.label}</p>
                </div>
                <div className={`grid gap-4 ${zone.ids.length === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2'}`}>
                  {zone.ids.map((id) => (
                    <div key={id} className={zone.ids.length === 1 ? 'sm:col-span-2' : ''}>
                      <ActivityCard a={ACTIVITIES[id]} onOpen={setOpen} wide={zone.ids.length === 1} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <DepthGauge chart={chart} zones={zoneEls} />
        </div>

        {/* Packages */}
        <div className="mt-20">
          <SectionHeader tone="dark" eyebrow="Packages" title="Two ways to do it all" intro="Both packages include five activities. Premium takes you higher in the sky and deeper under the sea." />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {PACKAGES.map((p) => {
              const premium = p.id === 'premium'
              return (
                <div key={p.id}>
                  <div className={`relative flex h-full flex-col rounded-xl3 p-6 sm:p-8 ${premium ? 'bg-saffron text-ink' : 'bg-on/[0.04] text-on ring-1 ring-on/10 [[data-theme=light]_&]:bg-white [[data-theme=light]_&]:shadow-card'}`}>
                    {p.badge && <span className="chip absolute right-5 top-5 bg-ink text-saffron">{p.badge}</span>}
                    <h3 className="font-display text-3xl font-semibold">{p.name}</h3>
                    <p className={`mt-1 text-[14px] ${premium ? 'text-ink/70' : 'text-on/65'}`}>{p.note}</p>
                    <ul className="mt-6 space-y-3">
                      {p.rows.map((r) => (
                        <li key={r} className="flex items-center gap-3 text-[15px] font-medium">
                          <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${premium ? 'bg-ink text-saffron' : 'bg-on/10 text-accent'}`}><Check size={14} /></span>
                          {r}
                        </li>
                      ))}
                      {p.extra && (
                        <li className="flex items-center gap-3 text-[15px] font-bold">
                          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink text-saffron"><Video size={13} /></span>
                          {p.extra}
                        </li>
                      )}
                    </ul>
                    <div className="mt-auto pt-8">
                      <a href={book(p.name)} target="_blank" rel="noopener noreferrer" className={premium ? 'btn-dark w-full' : 'btn-primary w-full'}>
                        <WhatsAppIcon size={18} /> Book {p.name.toLowerCase()}
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-[14px] text-on/70">
            <p className="flex items-center gap-2"><Users size={16} className="text-accent" /> Pricing depends on season and group size — we reply on WhatsApp within minutes.</p>
            <a href={TOUR_SCUBA} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold text-on underline-offset-4 hover:underline">
              360° tour of the scuba centre <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </div>

      <ActivityModal a={open} onClose={() => setOpen(null)} />
    </section>
  )
}
