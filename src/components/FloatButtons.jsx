import { useEffect, useState } from 'react'
import { Navigation, Phone } from 'lucide-react'
import { MAPS_URL, PHONE, waLink } from '../site'
import { WhatsAppIcon } from './ui'

/** Quick contact once the visitor has scrolled past the hero (which has its own CTAs). */
export default function FloatButtons() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const hidden = show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'

  return (
    <>
      {/* desktop / tablet */}
      <a
        href={waLink('Hi, I have a question about Laxmi Beach Homestay, Malvan.')}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className={`fixed bottom-6 right-6 z-40 hidden h-14 items-center gap-2 rounded-full bg-[#25D366] pl-4 pr-5 font-bold text-white shadow-lift transition-[transform,opacity,background-color] duration-300 hover:bg-[#1fb257] md:inline-flex ${hidden}`}
        tabIndex={show ? 0 : -1}
      >
        <WhatsAppIcon size={24} /> Chat with us
      </a>

      {/* phones */}
      <nav
        aria-label="Quick contact"
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg transition-[transform,opacity] duration-300 md:hidden ${hidden}`}
      >
        <div className="grid grid-cols-3">
          <a href={`tel:${PHONE}`} tabIndex={show ? 0 : -1} className="flex min-h-[60px] flex-col items-center justify-center gap-1 text-[12px] font-bold text-ink">
            <Phone size={20} /> Call
          </a>
          <a href={waLink('Hi, I would like to book a stay at Laxmi Beach Homestay, Malvan.')} target="_blank" rel="noopener noreferrer" tabIndex={show ? 0 : -1} className="flex min-h-[60px] flex-col items-center justify-center gap-1 bg-saffron text-[12px] font-bold text-ink">
            <WhatsAppIcon size={20} /> Book on WhatsApp
          </a>
          <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" tabIndex={show ? 0 : -1} className="flex min-h-[60px] flex-col items-center justify-center gap-1 text-[12px] font-bold text-ink">
            <Navigation size={20} /> Directions
          </a>
        </div>
      </nav>
    </>
  )
}
