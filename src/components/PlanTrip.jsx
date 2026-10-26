import { Bus, Plane, TrainFront } from 'lucide-react'
import { waLink } from '../site'
import { Reveal, SectionHeader, WhatsAppIcon } from './ui'

// Distances are approximate road distances to Malvan town.
const ROUTES = [
  { icon: Plane, title: 'By air', main: 'Sindhudurg Airport (Chipi)', detail: 'About 21 km from Malvan. Taxis are available at the airport; we can help arrange one.' },
  { icon: TrainFront, title: 'By train', main: 'Kudal station', detail: 'About 30 km away, 45–60 minutes by taxi or bus. Most Konkan Railway express trains stop here.' },
  { icon: Bus, title: 'By bus', main: 'MSRTC to Malvan', detail: 'State Transport buses run to Malvan bus stand from Mumbai, Pune and nearby towns, and Kadamba buses from Goa.' },
]

// Water sports and scuba close for the monsoon (roughly June–September) by
// order of the port authorities; Dec–Feb has the clearest water.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const season = (i) => (i >= 5 && i <= 8 ? 'closed' : i <= 1 || i === 11 ? 'best' : 'open')
const TONE = {
  best: 'bg-sea-mid text-white',
  open: 'bg-wave-soft text-sea',
  closed: 'bg-sand-2 text-ink/70',
}

export default function PlanTrip() {
  return (
    <section id="plan" className="bg-sand py-20 sm:py-28">
      <div className="mx-auto max-w-page px-4 sm:px-6">
        <SectionHeader
          eyebrow="Plan your trip"
          title="How to reach Malvan, and when to come"
          intro="Malvan is easy to reach by air, rail or road. Plan around the monsoon if water sports are on your list."
        />

        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {ROUTES.map(({ icon: Icon, title, main, detail }) => (
            <li key={title} className="rounded-xl2 bg-white p-6 shadow-card ring-1 ring-ink/5">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-wave-soft text-sea"><Icon size={24} aria-hidden="true" /></span>
              <p className="mt-4 text-[12px] font-extrabold uppercase tracking-[0.16em] text-sea-mid">{title}</p>
              <h3 className="mt-1 font-display text-xl font-semibold">{main}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">{detail}</p>
            </li>
          ))}
        </ul>

        <Reveal className="mt-10">
          <div className="rounded-xl3 bg-white p-6 shadow-card ring-1 ring-ink/5 sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h3 className="font-display text-2xl font-semibold">When to visit</h3>
                <p className="mt-1 text-[14px] text-muted">The homestay and restaurant are open all year. Water sports follow the sea.</p>
              </div>
              <ul className="flex flex-wrap gap-3 text-[13px] font-semibold" aria-label="Legend">
                <li className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-sea-mid" /> Best for diving</li>
                <li className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-wave-soft ring-1 ring-sea/20" /> Water sports open</li>
                <li className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-sand-2" /> Monsoon: water sports closed</li>
              </ul>
            </div>
            <ol className="mt-6 grid grid-cols-6 gap-1.5 sm:grid-cols-12" aria-label="Water sports season by month">
              {MONTHS.map((m, i) => {
                const s = season(i)
                const label = s === 'best' ? 'best for diving' : s === 'open' ? 'water sports open' : 'water sports closed'
                return (
                  <li key={m} className={`rounded-lg py-3 text-center text-[13px] font-bold ${TONE[s]}`}>
                    {m}
                    <span className="sr-only">: {label}</span>
                  </li>
                )
              })}
            </ol>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 text-[14px] text-muted">
              <p>Closing and reopening dates are set by the port authorities each year (usually June to September).</p>
              <a
                href={waLink('Hi, are water sports and scuba diving open on my travel dates? Please share details.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full px-3 font-bold text-sea underline-offset-4 hover:underline"
              >
                <WhatsAppIcon size={16} /> Check your dates
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
