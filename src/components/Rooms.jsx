import { useState } from 'react'
import { AirVent, Bath, BedDouble, Car, Clock, Eye, Lightbulb, ShieldCheck, Sparkles, Tv, Wifi, ArrowUpRight } from 'lucide-react'
import { CHECK_IN, CHECK_OUT, TOUR_HOMESTAY, img, srcset, waLink } from '../site'
import { CloseButton, Modal, Reveal, SectionHeader, WhatsAppIcon } from './ui'
import TiltCard from './TiltCard'
import ParallaxImg from './ParallaxImg'

export const ROOMS = [
  {
    id: 'pink-paradise',
    img: 'room2',
    tag: 'Couples’ choice',
    title: 'Pink Paradise Room',
    short: 'Ambient LED mood lighting and ocean-inspired interiors.',
    desc: 'An elegantly lit room with ambient LED mood lighting that turns your stay into a boutique experience. Modern interiors and ocean-inspired décor combine comfort and style at a great price.',
    amenities: [[AirVent, 'Air conditioning'], [BedDouble, 'Queen bed'], [Lightbulb, 'LED ambience'], [Bath, 'Hot water'], [Wifi, 'Free Wi-Fi'], [Eye, 'Beach access']],
  },
  {
    id: 'fresh-blue-sea-view',
    img: 'room1',
    tag: 'Most popular',
    title: 'Fresh Blue Sea View',
    short: 'Panoramic Arabian Sea views with Sindhudurg Fort right outside your window.',
    desc: 'Wake up to panoramic views of the Arabian Sea with the majestic Sindhudurg Fort visible from your window. Plush bedding, ocean breezes and a front-row seat to the sunrise on the Konkan coast. Perfect for couples and families.',
    amenities: [[AirVent, 'Air conditioning'], [Eye, 'Sea view'], [Tv, 'Flat-screen TV'], [Bath, 'Attached bathroom'], [Wifi, 'Free Wi-Fi'], [Sparkles, 'Hot water']],
  },
  {
    id: 'dreamy-pink',
    img: 'room4',
    tag: 'Best value',
    title: 'Dreamy Pink Room',
    short: 'Clean, comfortable base camp for exploring Malvan.',
    desc: 'Clean, comfortable and economical — the perfect base camp for exploring Malvan. Air conditioning, fresh linen and an attached bathroom at a pocket-friendly price. Ideal for solo travellers and groups.',
    amenities: [[AirVent, 'Air conditioning'], [BedDouble, 'Double bed'], [Bath, 'Attached bath'], [Wifi, 'Free Wi-Fi'], [Sparkles, 'Daily housekeeping'], [Car, 'Free parking']],
  },
  {
    id: 'blue-serenity',
    img: 'room3',
    tag: 'Cozy',
    title: 'Blue Serenity Room',
    short: 'Calm coastal ambience with a designer LED ceiling.',
    desc: 'A beautifully designed room with LED ceiling art and a calm coastal ambience. Spacious, well-ventilated and equipped with everything you need for a comfortable stay in Malvan.',
    amenities: [[AirVent, 'Air conditioning'], [BedDouble, 'Double bed'], [Lightbulb, 'LED ceiling'], [Bath, 'Attached bath'], [Wifi, 'Free Wi-Fi'], [Sparkles, 'Daily housekeeping']],
  },
]

const EVERY_ROOM = [
  [AirVent, 'Air conditioning', 'In every room'],
  [Bath, 'Attached bathroom', 'Modern, with hot water'],
  [Wifi, 'Free Wi-Fi', 'Netflix included'],
  [Sparkles, 'Daily housekeeping', 'Fresh and tidy each day'],
  [ShieldCheck, 'CCTV-covered parking', 'Govt. parking outside'],
  [Clock, `Check-in ${CHECK_IN}`, `Check-out ${CHECK_OUT}`],
]

const askFor = (title) =>
  waLink(`Hi, I want to book the *${title}* at Laxmi Beach Homestay, Malvan. Please share availability and pricing.`)

function RoomModal({ room, onClose }) {
  return (
    <Modal open={!!room} onClose={onClose} label={room?.title} className="max-w-4xl">
      {room && (
        <div className="grid overflow-hidden rounded-xl3 bg-white shadow-lift md:grid-cols-[1fr_1.1fr]">
          <div className="relative aspect-[4/3] md:aspect-auto">
            <img src={img(room.img)} alt={room.title} className="absolute inset-0 h-full w-full object-cover" />
            <CloseButton onClick={onClose} className="absolute right-3 top-3 md:hidden" />
          </div>
          <div className="relative p-6 sm:p-8">
            <CloseButton onClick={onClose} className="absolute right-4 top-4 hidden bg-ink/5 !text-ink hover:bg-ink/10 md:grid" />
            <span className="chip bg-saffron-soft text-sand-deep">{room.tag}</span>
            <h3 className="mt-3 pr-10 font-display text-3xl font-semibold leading-tight">{room.title}</h3>
            <p className="mt-3 leading-relaxed text-muted">{room.desc}</p>
            <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3">
              {room.amenities.map(([Icon, label]) => (
                <li key={label} className="flex items-center gap-2.5 text-[14px] font-medium">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-wave-soft text-sea"><Icon size={16} /></span>
                  {label}
                </li>
              ))}
            </ul>
            <p className="mt-6 flex items-center gap-2 text-[13px] text-muted">
              <Clock size={14} /> Check-in {CHECK_IN} · Check-out {CHECK_OUT}
            </p>
            <a href={askFor(room.title)} target="_blank" rel="noopener noreferrer" className="btn-primary mt-6 w-full">
              <WhatsAppIcon size={20} /> Check availability
            </a>
          </div>
        </div>
      )}
    </Modal>
  )
}

export default function Rooms() {
  const [open, setOpen] = useState(null)

  return (
    <section id="rooms" className="relative bg-foam py-20 sm:py-28">
      <div className="mx-auto max-w-page px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader
            eyebrow="Accommodation"
            title="Wake up to stunning Sindhudurg Fort views"
            intro="Your perfect beachside stay awaits. Four air-conditioned rooms, each with an attached bathroom, hot water and free Wi-Fi. Tap a room to see everything it includes."
          />
          <Reveal delay={0.1}>
            <a href={TOUR_HOMESTAY} target="_blank" rel="noopener noreferrer" className="btn-outline">
              Take the 360° homestay tour <ArrowUpRight size={18} />
            </a>
          </Reveal>
        </div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ROOMS.map((room) => (
            <li key={room.id} className="h-full">
              <TiltCard className="h-full rounded-xl3">
                <article className="group flex h-full flex-col overflow-hidden rounded-xl3 bg-white shadow-card ring-1 ring-ink/5 transition-shadow duration-300 hover:shadow-lift">
                  <button type="button" onClick={() => setOpen(room)} className="relative block aspect-[4/5] overflow-hidden text-left" aria-label={`${room.tag}. View details: ${room.title}`}>
                    <ParallaxImg src={img(room.img, true)} srcSet={srcset(room.img)} sizes="(min-width: 1024px) 290px, (min-width: 640px) 46vw, 92vw" amount={7} className="transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
                    <span className="chip absolute left-3 top-3 bg-white/95 text-ink shadow-sm">{room.tag}</span>
                    <span className="absolute bottom-3 right-3 rounded-full bg-ink/70 px-3 py-1.5 text-[12px] font-bold text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                      View details
                    </span>
                  </button>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-[22px] font-semibold leading-tight">{room.title}</h3>
                    <p className="mt-2 flex-1 text-[14px] leading-relaxed text-muted">{room.short}</p>
                    <ul className="mt-4 flex gap-2" aria-label="Highlights">
                      {room.amenities.slice(0, 4).map(([Icon, label]) => (
                        <li key={label} title={label} className="grid h-9 w-9 place-items-center rounded-lg bg-wave-soft text-sea">
                          <Icon size={17} aria-hidden="true" />
                          <span className="sr-only">{label}</span>
                        </li>
                      ))}
                    </ul>
                    <a href={askFor(room.title)} target="_blank" rel="noopener noreferrer" className="btn-dark mt-5 min-h-[44px] w-full px-4 text-[14px]">
                      <WhatsAppIcon size={16} /> Check availability
                    </a>
                    <button type="button" onClick={() => setOpen(room)} className="mt-1 inline-flex min-h-[40px] items-center justify-center gap-1 text-[14px] font-bold text-sea underline-offset-4 hover:underline">
                      See room details →
                    </button>
                  </div>
                </article>
              </TiltCard>
            </li>
          ))}
        </ul>

        <Reveal className="mt-10">
          <div className="grid gap-6 rounded-xl3 bg-sand p-6 sm:p-8 lg:grid-cols-[240px_1fr] lg:items-center">
            <div>
              <h3 className="font-display text-2xl font-semibold leading-tight">Every room includes</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink/70">The basics are covered in all four room types, whichever you choose.</p>
            </div>
            <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {EVERY_ROOM.map(([Icon, title, note]) => (
                <li key={title} className="flex flex-col items-start gap-2.5 rounded-2xl bg-white/80 p-3.5 ring-1 ring-ink/5 sm:flex-row sm:items-center sm:gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-wave-soft text-sea"><Icon size={20} aria-hidden="true" /></span>
                  <span className="min-w-0">
                    <span className="block text-[14px] font-bold leading-tight">{title}</span>
                    <span className="block text-[12px] leading-snug text-muted">{note}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      <RoomModal room={open} onClose={() => setOpen(null)} />
    </section>
  )
}
