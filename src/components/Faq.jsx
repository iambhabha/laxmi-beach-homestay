import { ChevronDown } from 'lucide-react'
import { ADDRESS_CITY, ADDRESS_LINE, CHECK_IN, CHECK_OUT, PHONE_DISPLAY, WHATSAPP_DISPLAY } from '../site'
import { Reveal, SectionHeader } from './ui'

// Answers only use facts already stated elsewhere on the site.
const FAQS = [
  {
    q: 'Where is Laxmi Beach Homestay in Malvan?',
    a: `${ADDRESS_LINE}, ${ADDRESS_CITY}. We are about 10 m from Malvan beach and the Sindhudurg Fort ferry jetty.`,
  },
  {
    q: 'How far is Sindhudurg Fort from the homestay?',
    a: 'The ferry jetty for Sindhudurg Fort is right opposite us, about 10 m away. Ferries take you across to the island fort, and Chivla Beach is a one-minute walk.',
  },
  {
    q: 'How do I reach Malvan?',
    a: 'Sindhudurg Airport (Chipi) is about 21 km away and Kudal railway station about 30 km away (45–60 minutes by taxi or bus). MSRTC buses run to Malvan from Mumbai, Pune and nearby towns.',
  },
  {
    q: 'When are scuba diving and water sports open in Malvan?',
    a: 'Usually from October to May. They close for the monsoon, roughly June to September, on dates set each year by the port authorities. December to February has the clearest water for diving.',
  },
  {
    q: 'What are the check-in and check-out times?',
    a: `Check-in is from ${CHECK_IN} and check-out is by ${CHECK_OUT}. Ask us on WhatsApp if you need an early check-in.`,
  },
  {
    q: 'Do the rooms have AC and Wi-Fi?',
    a: 'Yes. All four rooms are air-conditioned, with an attached bathroom, hot water, daily housekeeping and free Wi-Fi with Netflix. The Fresh Blue Sea View room looks out over the sea.',
  },
  {
    q: 'Can we book scuba diving and water sports at the homestay?',
    a: 'Yes. Our own Om Shiv Moreshwar centre runs scuba diving, deep scuba diving, parasailing, jet ski, banana and bumper rides, with PADI-certified instructors and MMB Maharashtra approval. The Basic and Premium packages both include a free video shoot.',
  },
  {
    q: 'Is there parking for cars?',
    a: 'Yes, there is CCTV-covered government parking right outside the homestay.',
  },
  {
    q: 'Do you serve food?',
    a: 'Yes. Laxmi Restaurant serves homemade Malvani thalis, including Bangda, Paplet, Surmai and Kolmbi (prawn) thalis and a pure veg thali, each with sol kadhi.',
  },
  {
    q: 'How do I book a room?',
    a: `Send your dates on WhatsApp at ${WHATSAPP_DISPLAY} or call ${PHONE_DISPLAY}. You can also fill in the booking form on this page; we usually confirm on WhatsApp within 30 minutes.`,
  },
]

const schema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
}

export default function Faq() {
  return (
    <section id="faq" className="bg-foam py-20 sm:py-28">
      <div className="mx-auto grid max-w-page gap-10 px-4 sm:px-6 lg:grid-cols-[.8fr_1.2fr]">
        <SectionHeader
          eyebrow="Good to know"
          title="Questions guests ask before booking"
          intro="Everything about location, rooms, water sports and food at our beach homestay in Malvan."
        />
        <Reveal>
          <ul className="divide-y divide-ink/10 rounded-xl3 bg-white shadow-card ring-1 ring-ink/5">
            {FAQS.map(({ q, a }) => (
              <li key={q}>
                <details className="group">
                  <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[16px] font-bold transition-colors hover:text-sea [&::-webkit-details-marker]:hidden">
                    <h3 className="text-left">{q}</h3>
                    <ChevronDown size={20} className="shrink-0 text-sea transition-transform duration-200 group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <p className="px-5 pb-5 text-[15px] leading-relaxed text-muted">{a}</p>
                </details>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </section>
  )
}
