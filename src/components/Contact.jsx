import { useId, useState } from 'react'
import { CheckCircle2, Clock, MapPin, Phone } from 'lucide-react'
import {
  ADDRESS_CITY, ADDRESS_LINE, CHECK_IN, CHECK_OUT, MAPS_EMBED, MAPS_URL, PHONE, PHONE_DISPLAY,
  WHATSAPP_DISPLAY, img, waLink,
} from '../site'
import { ROOMS } from './Rooms'
import { Reveal, SectionHeader, WhatsAppIcon } from './ui'

const GUESTS = ['1 guest', '2 guests', '3 guests', '4 guests', '5+ guests']
const today = () => new Date().toISOString().split('T')[0]

function Field({ label, error, hint, children, className = '' }) {
  const id = useId()
  const describedBy = error ? `${id}-err` : hint ? `${id}-hint` : undefined
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-bold text-ink">{label}</label>
      {children({ id, 'aria-invalid': !!error, 'aria-describedby': describedBy })}
      {error ? (
        <p id={`${id}-err`} className="mt-1.5 text-[13px] font-semibold text-sindoor">{error}</p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-[12px] text-muted">{hint}</p>
      ) : null}
    </div>
  )
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', checkin: '', checkout: '', room: '', guests: '2 guests', msg: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }))
  }

  const validate = () => {
    const er = {}
    if (!form.name.trim()) er.name = 'Please enter your name.'
    if (form.phone.replace(/\D/g, '').length < 10) er.phone = 'Please enter a 10-digit mobile number.'
    if (!form.checkin) er.checkin = 'Choose a check-in date.'
    if (!form.checkout) er.checkout = 'Choose a check-out date.'
    else if (form.checkin && form.checkout <= form.checkin) er.checkout = 'Check-out must be after check-in.'
    if (!form.room) er.room = 'Choose a room type.'
    return er
  }

  const submit = (e) => {
    e.preventDefault()
    const er = validate()
    setErrors(er)
    if (Object.keys(er).length) {
      // Wait for the error state to render, then bring the first problem into view.
      requestAnimationFrame(() => {
        const first = document.getElementById('booking-form')?.querySelector('[aria-invalid="true"]')
        first?.scrollIntoView({ block: 'center', behavior: 'smooth' })
        first?.focus({ preventScroll: true })
      })
      return
    }
    const text = [
      '*Booking request – Laxmi Beach Homestay, Malvan*',
      '',
      `Name: ${form.name.trim()}`,
      `Mobile: ${form.phone.trim()}`,
      `Check-in: ${form.checkin} (from ${CHECK_IN})`,
      `Check-out: ${form.checkout} (by ${CHECK_OUT})`,
      `Room: ${form.room}`,
      `Guests: ${form.guests}`,
      form.msg.trim() ? `Requests: ${form.msg.trim()}` : null,
      '',
      'Please confirm availability and pricing. Thank you!',
    ].filter((l) => l !== null).join('\n')
    setSent(true)
    window.open(waLink(text), '_blank', 'noopener')
  }

  return (
    <section id="book" className="relative bg-sand py-20 sm:py-28">
      <div className="mx-auto max-w-page px-4 sm:px-6">
        <SectionHeader
          eyebrow="Reservations"
          title="Book your stay"
          intro="Send your dates and we’ll confirm availability and price on WhatsApp — usually within 30 minutes."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
          <Reveal>
            <form id="booking-form" noValidate onSubmit={submit} className="rounded-xl3 bg-white p-6 shadow-lift sm:p-8">
              <div className="flex flex-wrap gap-x-6 gap-y-2 rounded-xl bg-wave-soft px-4 py-3 text-[14px] font-semibold text-sea">
                <span className="inline-flex items-center gap-2"><Clock size={16} /> Check-in {CHECK_IN}</span>
                <span className="inline-flex items-center gap-2"><Clock size={16} /> Check-out {CHECK_OUT}</span>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Field label="Full name" error={errors.name}>
                  {(p) => <input {...p} type="text" autoComplete="name" className="field" value={form.name} onChange={set('name')} />}
                </Field>
                <Field label="Mobile number" error={errors.phone}>
                  {(p) => <input {...p} type="tel" inputMode="tel" autoComplete="tel" placeholder="98765 43210" className="field" value={form.phone} onChange={set('phone')} />}
                </Field>
                <Field label="Check-in" error={errors.checkin}>
                  {(p) => <input {...p} type="date" min={today()} className="field" value={form.checkin} onChange={set('checkin')} />}
                </Field>
                <Field label="Check-out" error={errors.checkout}>
                  {(p) => <input {...p} type="date" min={form.checkin || today()} className="field" value={form.checkout} onChange={set('checkout')} />}
                </Field>
                <Field label="Room type" error={errors.room}>
                  {(p) => (
                    <select {...p} className="field" value={form.room} onChange={set('room')}>
                      <option value="">Select a room</option>
                      {ROOMS.map((r) => <option key={r.id}>{r.title}</option>)}
                    </select>
                  )}
                </Field>
                <Field label="Guests">
                  {(p) => (
                    <select {...p} className="field" value={form.guests} onChange={set('guests')}>
                      {GUESTS.map((g) => <option key={g}>{g}</option>)}
                    </select>
                  )}
                </Field>
                <Field label="Special requests (optional)" hint="Scuba booking, early check-in, thali for dinner, scooter rental…" className="sm:col-span-2">
                  {(p) => <textarea {...p} rows={3} className="field resize-none" value={form.msg} onChange={set('msg')} />}
                </Field>
              </div>

              <button type="submit" className="btn-primary mt-6 w-full text-base">
                <WhatsAppIcon size={20} /> Send booking request on WhatsApp
              </button>
              <p className="mt-3 text-center text-[13px] text-muted">Opens WhatsApp with your details filled in. Nothing is booked until we confirm.</p>
              {sent && (
                <p role="status" className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-[14px] font-semibold text-emerald-800">
                  <CheckCircle2 size={18} /> WhatsApp opened — just press send there.
                </p>
              )}
            </form>
          </Reveal>

          <Reveal delay={0.08} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="flex flex-col gap-2 rounded-xl2 bg-white p-4 shadow-card ring-1 ring-ink/5 transition-colors hover:ring-ink/20">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#25D366] text-white"><WhatsAppIcon size={20} /></span>
                <span className="text-[13px] font-bold text-muted">WhatsApp</span>
                <span className="font-bold">{WHATSAPP_DISPLAY}</span>
              </a>
              <a href={`tel:${PHONE}`} className="flex flex-col gap-2 rounded-xl2 bg-white p-4 shadow-card ring-1 ring-ink/5 transition-colors hover:ring-ink/20">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink text-saffron"><Phone size={18} /></span>
                <span className="text-[13px] font-bold text-muted">Call us</span>
                <span className="font-bold">{PHONE_DISPLAY}</span>
              </a>
            </div>

            <div className="overflow-hidden rounded-xl2 bg-white shadow-card ring-1 ring-ink/5">
              <iframe src={MAPS_EMBED} title="Laxmi Beach Homestay on Google Maps" loading="lazy" className="h-60 w-full border-0" allowFullScreen referrerPolicy="no-referrer-when-downgrade" />
              <div className="flex items-start justify-between gap-4 p-4">
                <p className="flex gap-2 text-[14px] leading-relaxed">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-sindoor" />
                  <span>{ADDRESS_LINE},<br />{ADDRESS_CITY}</span>
                </p>
                <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="btn-dark min-h-[40px] shrink-0 px-4 text-[13px]">Open map</a>
              </div>
            </div>

            <figure className="overflow-hidden rounded-xl2 bg-white shadow-card ring-1 ring-ink/5">
              <img src={img('homestay-from-sea', true)} alt="Laxmi Beach Homestay seen from the sea" loading="lazy" className="aspect-[16/9] w-full object-cover" />
              <figcaption className="p-4 text-[14px] leading-relaxed">
                <span className="font-bold">How to spot us:</span> the peach building with the LAXMI sign, just above our Om Shiv Moreshwar scuba counter on the shore.
              </figcaption>
            </figure>

            <a href={img('location-map')} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 rounded-xl2 bg-ink p-3 text-white">
              <img src={img('location-map', true)} alt="" loading="lazy" className="h-24 w-16 rounded-lg object-cover object-top" />
              <span>
                <span className="block font-bold">Official location map</span>
                <span className="text-[13px] text-white/70">From our door to the Sindhudurg Fort jetty — tap to view</span>
              </span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
