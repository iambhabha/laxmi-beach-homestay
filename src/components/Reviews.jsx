import { useRef } from 'react'
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { GOOGLE_REVIEWS, RATING, REVIEWS } from '../site'
import { GoogleG, Reveal, Stars } from './ui'

const AVATAR_TONES = ['bg-saffron text-ink', 'bg-wave text-ink', 'bg-sindoor text-white', 'bg-sea-light text-ink']

export default function Reviews() {
  const track = useRef(null)
  const scroll = (dir) => {
    const el = track.current
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.85, 760), behavior: 'smooth' })
  }

  return (
    <section id="reviews" className="relative overflow-hidden bg-surface-reviews py-20 text-on sm:py-28">
      <div className="relative mx-auto max-w-page px-4 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <Reveal>
            <p className="eyebrow text-accent">Guest reviews</p>
            <h2 className="h-section mt-3 max-w-[18ch]">“Felt like a slice of paradise.”</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <a href={GOOGLE_REVIEWS} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-2xl bg-white p-4 pr-5 text-ink shadow-lift ring-2 ring-transparent transition-shadow hover:ring-saffron">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-foam"><GoogleG size={26} /></span>
              <span>
                <span className="flex items-baseline gap-2">
                  <span className="font-display text-3xl font-semibold leading-none">{RATING}</span>
                  <Stars size={14} />
                </span>
                <span className="mt-1 flex items-center gap-1 text-[13px] font-semibold text-muted">100+ Google reviews <ArrowUpRight size={14} /></span>
              </span>
            </a>
          </Reveal>
        </div>

        <div className="relative mt-12">
          <ul ref={track} className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 sm:-mx-6 sm:scroll-px-6 sm:px-6" tabIndex={0} aria-label="Guest reviews, scroll sideways">
            {REVIEWS.map((r, i) => (
              <li key={r.name} className="flex w-[85%] shrink-0 snap-start flex-col rounded-xl2 bg-on/[0.05] p-6 ring-1 ring-on/10 sm:w-[360px] [[data-theme=light]_&]:bg-white [[data-theme=light]_&]:shadow-card">
                <Stars size={15} className="text-star" />
                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-on/85">“{r.text}”</blockquote>
                <div className="mt-6 flex items-center gap-3 border-t border-on/10 pt-4">
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full font-bold ${AVATAR_TONES[i % AVATAR_TONES.length]}`}>{r.name[0]}</span>
                  <span className="min-w-0">
                    <span className="block truncate font-bold">{r.name}</span>
                    <span className="flex items-center gap-1.5 text-[12px] text-on/60"><GoogleG size={12} /> Google review · {r.ago}</span>
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex gap-2">
            <button type="button" onClick={() => scroll(-1)} aria-label="Previous reviews" className="grid h-12 w-12 place-items-center rounded-full border border-on/25 text-on transition-colors hover:bg-on/10">
              <ChevronLeft size={22} />
            </button>
            <button type="button" onClick={() => scroll(1)} aria-label="Next reviews" className="grid h-12 w-12 place-items-center rounded-full border border-on/25 text-on transition-colors hover:bg-on/10">
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
