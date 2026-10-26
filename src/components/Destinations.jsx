import { Bike, Car, Clock, MapPin, Navigation, ParkingSquare } from 'lucide-react'
import { img, srcset, waLink } from '../site'
import { Reveal, SectionHeader, WhatsAppIcon } from './ui'
import ParallaxImg from './ParallaxImg'

// Sorted by distance from the homestay.
export const PLACES = [
  { name: 'Sindhudurg Fort', km: 0.01, dist: 'Jetty 10 m away', time: 'Ferry to the island fort', image: 'sindhudurg-fort', tag: 'Must visit', desc: 'The 17th-century sea fort built by Chhatrapati Shivaji Maharaj on a rocky island. Ferries leave from the jetty right opposite us; inside is the shrine with his handprint and footprint in stone.' },
  { name: 'Chivla Beach', km: 0.05, dist: '50 m', time: '1 min walk', image: 'chivla-beach', tag: 'Nearest beach', desc: 'A calm, less-crowded stretch of golden sand. Great for morning walks, swimming and watching the fishing boats head out at dawn.' },
  { name: 'Rock Garden', km: 1.2, dist: '1.2 km', time: '4 min drive', image: 'rock-garden', tag: 'Sunset walk', desc: 'A garden among natural rock formations overlooking the sea — lovely for evening strolls and sunset.' },
  { name: 'Golden Ganesh Mandir', km: 1.5, dist: '1.5 km', time: '5 min drive', image: 'golden-ganesh', tag: 'Spiritual', desc: 'A peaceful temple known for its golden Ganesh idol, especially beautiful during the evening aarti.' },
  { name: 'Tarkarli Beach', km: 4.1, dist: '4.1 km', time: '10 min drive', image: 'tarkarli', tag: 'Snorkelling hub', desc: 'Crystal-clear water, white sand and coral reefs — one of the best snorkelling spots in India.' },
  { name: 'Rajkot Fort', km: 8, dist: '8 km', time: '15 min drive', image: 'rajkot-fort', tag: 'Heritage', desc: 'Sea-facing fort with the Chhatrapati Shivaji Maharaj statue and sweeping views of the coast.' },
  { name: 'Devbag Sangam – Tsunami Island', km: 8, dist: '8 km', time: '15 min drive', image: 'tsunami-island', tag: 'Island trip', desc: 'Where the Karli river meets the sea. Boat rides through mangroves, with frequent dolphin sightings.' },
  { name: 'Sarjekot Fort', km: 12, dist: '12 km', time: '20 min drive', image: 'sarjekot', tag: 'Trek', desc: 'A hilltop fort with panoramic views of the Konkan coastline and green valleys — a hidden gem.' },
  { name: 'Bhogave Beach', km: 15, dist: '15 km', time: '25 min drive', image: 'bhogave', tag: 'Quiet beach', desc: 'An unspoilt, peaceful beach with dramatic sunsets and very few crowds.' },
  { name: 'Nivati Fort', km: 22, dist: '22 km', time: '35 min drive', image: 'nivati-fort', tag: 'Sunset point', desc: 'Cliff-top fort ruins with the most stunning sunset views in Sindhudurg district.' },
]

const directions = (name) =>
  `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent('Laxmi Beach Homestay and Restaurant, Malvan')}&destination=${encodeURIComponent(`${name}, Malvan, Maharashtra`)}`

const RENTAL_MSG = 'Hi, I want to rent a scooter or car for sightseeing from Laxmi Beach Homestay, Malvan.'

function Place({ p, big }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl2 bg-white shadow-card ring-1 ring-ink/5">
      <div className={`relative overflow-hidden ${big ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}>
        <ParallaxImg src={img(p.image, !big)} srcSet={big ? undefined : srcset(p.image)} sizes={big ? undefined : '(min-width: 1024px) 290px, (min-width: 640px) 46vw, 92vw'} alt={p.name} amount={big ? 10 : 7} className="transition-transform duration-700 group-hover:scale-105" />
        <span className="chip absolute left-3 top-3 bg-white/95 text-ink">{p.tag}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap gap-2 text-[13px] font-semibold">
          <span className="inline-flex items-center gap-1 text-sea"><MapPin size={14} /> {p.dist}</span>
          <span className="text-ink/25" aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1 text-muted"><Clock size={14} /> {p.time}</span>
        </div>
        <h3 className={`mt-2 font-display font-semibold leading-tight ${big ? 'text-3xl' : 'text-xl'}`}>{p.name}</h3>
        <p className="mt-2 flex-1 text-[14px] leading-relaxed text-muted">{p.desc}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a href={directions(p.name)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-ink px-4 text-[13px] font-bold text-white hover:bg-ink-3">
            <Navigation size={14} /> Directions
          </a>
          <a href={waLink(`Hi, how do I get to *${p.name}* from Laxmi Beach Homestay? Can you arrange transport?`)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-3 text-[13px] font-bold text-sea hover:bg-sea/5">
            <WhatsAppIcon size={14} /> Ask us
          </a>
        </div>
      </div>
    </article>
  )
}

export default function Destinations() {
  const [first, second, ...rest] = PLACES
  return (
    <section id="explore" className="bg-foam py-20 sm:py-28">
      <div className="mx-auto max-w-page px-4 sm:px-6">
        <SectionHeader
          eyebrow="Explore Malvan"
          title="Ten places worth the trip — two of them at our door"
          intro="Distances are measured from the homestay. We rent cars and scooters, so you can set off whenever you like."
        />

        <Reveal className="mt-8">
          <ul className="flex flex-wrap items-center gap-2">
            {[
              [Car, 'Car rental'],
              [Bike, 'Scooter rental'],
              [ParkingSquare, 'CCTV-covered parking'],
            ].map(([Icon, label]) => (
              <li key={label} className="chip bg-wave-soft py-2 text-[13px] text-sea"><Icon size={15} /> {label}</li>
            ))}
            <li>
              <a href={waLink(RENTAL_MSG)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-3 text-[13px] font-bold text-ink underline underline-offset-4 hover:text-sea">
                Book a rental →
              </a>
            </li>
          </ul>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <Place p={first} big />
          <Place p={second} big />
        </div>
        <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {rest.map((p) => (
            <li key={p.name}>
              <Place p={p} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
