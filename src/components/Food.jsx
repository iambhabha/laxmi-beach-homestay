import { useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { img, waLink } from '../site'
import { Reveal, SectionHeader, WhatsAppIcon } from './ui'
import ParallaxImg from './ParallaxImg'

export const THALIS = [
  { img: 'bangda-thali', mr: 'बांगडा थाळी', en: 'Bangda Thali', type: 'nonveg', price: 180, tag: 'Chef’s pick', desc: 'Fresh mackerel fried golden, with steamed rice, sol kadhi, bhakri and seasonal vegetables.' },
  { img: 'paplet-thali', mr: 'पापलेट थाळी', en: 'Paplet Thali', type: 'nonveg', price: 320, tag: 'Most loved', desc: 'Pomfret in Malvani masala or coconut-crusted and shallow fried, with rice, sol kadhi and sides.' },
  { img: 'surmai-thali', mr: 'सुरमई थाळी', en: 'Surmai Thali', type: 'nonveg', price: 280, tag: 'Bestseller', desc: 'Kingfish marinated in Malvani spices, with warm rice, coconut curry and sol kadhi.' },
  { img: 'kolmbi-thali', mr: 'कोळंबी थाळी', en: 'Kolmbi Thali', type: 'nonveg', price: 260, tag: 'Spicy', desc: 'Juicy prawns in a rich red Malvani gravy with fresh coconut, rice and sol kadhi.' },
  { img: 'veg-thali', mr: 'शाकाहारी थाळी', en: 'Veg Thali', type: 'veg', price: 150, tag: 'Pure veg', desc: 'Seasonal sabzi, dal, bhakri, chapati, rice, sol kadhi, papad and pickle.' },
]

const FILTERS = [
  { key: 'all', label: 'All thalis' },
  { key: 'nonveg', label: 'Seafood' },
  { key: 'veg', label: 'Veg' },
]

function DietMark({ type }) {
  const veg = type === 'veg'
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] font-bold" title={veg ? 'Vegetarian' : 'Non-vegetarian'}>
      <span className={`grid h-4 w-4 place-items-center rounded-[3px] border-2 ${veg ? 'border-emerald-600' : 'border-red-700'}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${veg ? 'bg-emerald-600' : 'bg-red-700'}`} />
      </span>
      <span className={veg ? 'text-emerald-700' : 'text-red-800'}>{veg ? 'Veg' : 'Non-veg'}</span>
    </span>
  )
}

/** Two restaurant photos sliding at different speeds while the menu scrolls past. */
function RestaurantPair({ section }) {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: section, offset: ['start end', 'end start'] })
  const front = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [30, -30])
  const back = useTransform(scrollYProgress, [0, 1], reduce ? [24, 24] : [90, -50])
  return (
    <div className="mt-8 grid grid-cols-2 gap-3 pb-6">
      <motion.img style={{ y: front }} src={img('restraurant-1-image', true)} alt="Laxmi Restaurant dining hall" loading="lazy" className="aspect-[4/3] w-full rounded-2xl object-cover shadow-card" />
      <motion.img style={{ y: back }} src={img('restraunt-image-2', true)} alt="Restaurant seating" loading="lazy" className="aspect-[4/3] w-full rounded-2xl object-cover shadow-lift" />
    </div>
  )
}

const menuMsg = 'Hi, please share the full food menu and today’s specials at Laxmi Beach Restaurant, Malvan.'

export default function Food() {
  const [filter, setFilter] = useState('all')
  const section = useRef(null)
  const shown = filter === 'all' ? THALIS : THALIS.filter((t) => t.type === filter)

  return (
    <section id="food" ref={section} className="relative overflow-hidden bg-sand py-20 sm:py-28">
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.25] mix-blend-multiply" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-page gap-12 px-4 sm:px-6 lg:grid-cols-[.8fr_1.2fr]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <SectionHeader
            eyebrow="Laxmi Restaurant"
            title={<>Authentic Malvani food, <span className="font-marathi font-normal text-sand-deep">अस्सल मालवणी जेवण</span></>}
            intro="Homemade Konkan coastal cooking with the day’s fresh catch. Every thali is a complete meal, served with sol kadhi."
          />
          <RestaurantPair section={section} />
          <Reveal delay={0.15} className="mt-12">
            <a href={waLink(menuMsg)} target="_blank" rel="noopener noreferrer" className="btn-dark">
              <WhatsAppIcon size={18} /> Get the full menu
            </a>
            <p className="mt-3 text-[13px] text-ink/60">Group bookings and seasonal specials on request.</p>
          </Reveal>
        </div>

        <div>
          <div role="radiogroup" aria-label="Filter thalis" className="inline-flex rounded-full bg-white/70 p-1 ring-1 ring-ink/10">
            {FILTERS.map((f) => {
              const count = f.key === 'all' ? THALIS.length : THALIS.filter((t) => t.type === f.key).length
              const on = filter === f.key
              return (
                <button
                  key={f.key}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setFilter(f.key)}
                  className={`min-h-[40px] rounded-full px-4 text-[14px] font-bold transition-colors ${on ? 'bg-ink text-white' : 'text-ink/70 hover:text-ink'}`}
                >
                  {f.label} <span className={on ? 'text-saffron' : 'text-ink/40'}>{count}</span>
                </button>
              )
            })}
          </div>

          <ul className="mt-6 grid gap-5 sm:grid-cols-2">
            {shown.map((t, i) => {
              // An odd card out at the end spans both columns, photo beside text.
              const wide = shown.length % 2 === 1 && i === shown.length - 1
              return (
              <li key={t.en} className={`group flex flex-col overflow-hidden rounded-xl2 bg-foam shadow-card ring-1 ring-ink/5 ${wide ? 'sm:col-span-2 sm:grid sm:grid-cols-2' : ''}`}>
                <div className={`relative overflow-hidden ${wide ? 'aspect-[16/10] sm:aspect-auto sm:min-h-[240px]' : 'aspect-[16/10]'}`}>
                  <ParallaxImg src={img(t.img)} alt={t.en} amount={5} className="transition-transform duration-700 group-hover:scale-[1.04]" />
                  <span className="chip absolute left-3 top-3 bg-white/95 text-ink">{t.tag}</span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-xl font-semibold leading-tight">{t.en}</h3>
                      <p lang="mr" className="font-marathi text-[17px] text-sand-deep">{t.mr}</p>
                    </div>
                    <p className="font-display text-2xl font-semibold tabular-nums"><span className="mr-0.5 font-body text-xl">₹</span>{t.price}</p>
                  </div>
                  <p className="mt-2 flex-1 text-[14px] leading-relaxed text-muted">{t.desc}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <DietMark type={t.type} />
                    <a
                      href={waLink(`Hi, I’d like to order the *${t.en}* at Laxmi Beach Restaurant, Malvan.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-3 text-[14px] font-bold text-sea underline-offset-4 hover:bg-sea/5 hover:underline"
                    >
                      <WhatsAppIcon size={15} /> Order
                    </a>
                  </div>
                </div>
              </li>
              )
            })}
          </ul>
          <p className="mt-5 text-[13px] text-ink/60">Prices are per thali. Ask on WhatsApp for today’s specials.</p>
        </div>
      </div>
    </section>
  )
}
