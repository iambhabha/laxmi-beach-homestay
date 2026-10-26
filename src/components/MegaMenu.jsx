import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { srcset } from '../site'
import { ROOMS } from './Rooms'
import { ACTIVITIES } from './Activities'
import { THALIS } from './Food'
import { PLACES } from './Destinations'

const thumb = (name) => `/images/${name}-xs.webp`
const { parasailing, jetski, banana, bumper, scuba } = ACTIVITIES

/**
 * Photo previews for the desktop nav. Keyed by the nav link they belong to;
 * links without an entry (Gallery, Contact) stay plain links.
 */
export const MENUS = {
  '#rooms': {
    title: 'Our rooms',
    blurb: 'Four air-conditioned rooms with attached bathrooms, a minute from the beach.',
    all: 'See all rooms',
    items: ROOMS.map((r) => ({ img: r.img, name: r.title, sub: r.tag })),
  },
  '#water-sports': {
    title: 'Water sports',
    blurb: 'Run by our own PADI-certified scuba centre at the Sindhudurg Fort jetty.',
    all: 'See activities & packages',
    items: [
      { img: scuba.image, name: 'Scuba diving', sub: '20–50 ft deep' },
      { img: parasailing.image, name: parasailing.name, sub: parasailing.spec },
      { img: jetski.image, name: jetski.name, sub: jetski.spec },
      { img: banana.image, name: banana.name, sub: banana.spec },
      { img: bumper.image, name: bumper.name, sub: bumper.spec },
    ],
  },
  '#food': {
    title: 'Laxmi Restaurant',
    blurb: 'Homemade Malvani thalis, each served with sol kadhi.',
    all: 'See the menu',
    items: THALIS.map((t) => ({ img: t.img, name: t.en, sub: `₹${t.price}` })),
  },
  '#explore': {
    title: 'Explore Malvan',
    blurb: 'Forts, beaches and islands, most within a 15-minute drive.',
    all: 'See all 10 places',
    items: PLACES.slice(0, 5).map((p) => ({ img: p.image, name: p.name, sub: p.dist })),
  },
}

const ease = [0.2, 0.7, 0.2, 1]

/** The panel under the header. `href` picks the menu; null closes it. */
export function MegaPanel({ href, light, onNavigate, onPointerEnter, onPointerLeave }) {
  const menu = href && MENUS[href]
  return (
    <AnimatePresence>
      {menu && (
        <motion.div
          id="mega-panel"
          key="panel"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease }}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          className={`absolute inset-x-0 top-full hidden border-b xl:block ${
            light ? 'border-ink/10 bg-white text-ink' : 'border-white/10 bg-ink-2 text-white'
          } shadow-[0_24px_48px_-24px_rgba(11,11,13,.45)]`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={href}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.16, ease }}
              className="mx-auto grid max-w-page grid-cols-[230px_1fr] gap-8 px-6 py-7"
            >
              <div className="flex flex-col">
                <p className="font-display text-2xl font-semibold leading-tight">{menu.title}</p>
                <p className={`mt-2 text-[14px] leading-relaxed ${light ? 'text-muted' : 'text-white/65'}`}>{menu.blurb}</p>
                <a
                  href={href}
                  onClick={onNavigate}
                  className={`group mt-auto inline-flex min-h-[44px] items-center gap-2 pt-4 text-[14px] font-bold ${light ? 'text-sea' : 'text-accent'}`}
                >
                  {menu.all}
                  <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                </a>
              </div>
              <ul className={`grid gap-4 ${menu.items.length === 4 ? 'grid-cols-4' : 'grid-cols-5'}`}>
                {menu.items.map((it) => (
                  <li key={it.name}>
                    <a href={href} onClick={onNavigate} className="group block rounded-xl focus-visible:outline-offset-4">
                      <span className="block aspect-[4/3] overflow-hidden rounded-xl bg-ink/10">
                        <img
                          src={thumb(it.img)}
                          srcSet={srcset(it.img)}
                          sizes="220px"
                          alt=""
                          width="420"
                          height="315"
                          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                      </span>
                      <span className="mt-2.5 block text-[15px] font-semibold leading-snug group-hover:underline group-hover:underline-offset-4">{it.name}</span>
                      <span className={`mt-0.5 block text-[13px] ${light ? 'text-muted' : 'text-white/60'}`}>{it.sub}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
