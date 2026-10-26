import { useEffect, useRef, useState } from 'react'
import { ChevronDown, ChevronRight, Menu, Moon, Phone, Sun, X } from 'lucide-react'
import { NAV, PHONE, PHONE_DISPLAY, WHATSAPP_DISPLAY, waLink } from '../site'
import { Brand, WhatsAppIcon } from './ui'
import { useTheme } from '../theme'
import { MENUS, MegaPanel } from './MegaMenu'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const { theme, toggle } = useTheme()
  const light = theme === 'light'
  // The light theme has a light hero too, so its bar always uses ink text:
  // see-through over the hero, white glass once scrolled.
  const [mega, setMega] = useState(null) // href of the open photo menu
  const megaTimer = useRef(null)
  const solid = scrolled || open || !!mega
  const inkText = light

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24)
      // Back in the hero, no section link should look current.
      if (window.scrollY < window.innerHeight * 0.5) setActive('')
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Highlight the section currently in the middle of the screen.
  useEffect(() => {
    const ids = NAV.map((n) => n.href.slice(1))
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  // Hover intent: open after a short pause (instantly when switching between
  // menus), and close a moment after the pointer leaves the header.
  const hoverMenu = (href) => {
    clearTimeout(megaTimer.current)
    if (mega) setMega(href)
    else megaTimer.current = setTimeout(() => setMega(href), 90)
  }
  const leaveMenu = () => {
    clearTimeout(megaTimer.current)
    megaTimer.current = setTimeout(() => setMega(null), 160)
  }
  const keepMenu = () => clearTimeout(megaTimer.current)
  const closeMenu = () => {
    clearTimeout(megaTimer.current)
    setMega(null)
  }
  useEffect(() => () => clearTimeout(megaTimer.current), [])

  useEffect(() => {
    if (!mega) return
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      document.getElementById(`mega-toggle-${mega.slice(1)}`)?.focus()
      setMega(null)
    }
    const onScroll = () => setMega(null)
    window.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll)
    }
  }, [mega])

  useEffect(() => {
    if (!open) return
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <header
        onPointerLeave={leaveMenu}
        onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && closeMenu()}
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ${
          !solid
            ? 'border-b border-transparent bg-transparent'
            : light
              ? 'border-b border-ink/10 bg-white/90 shadow-[0_8px_30px_-16px_rgba(11,11,13,.35)] backdrop-blur-xl'
              : 'border-b border-white/10 bg-ink/90 shadow-[0_8px_30px_-12px_rgba(0,0,0,.5)] backdrop-blur-xl'
        }`}
      >
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-lg focus:bg-saffron focus:px-4 focus:py-2 focus:font-bold focus:text-ink">
          Skip to content
        </a>
        <nav className="mx-auto flex h-[68px] max-w-page items-center gap-6 px-4 sm:px-6" aria-label="Main">
          <a href="#home" className="shrink-0 rounded-lg" title="Back to top">
            <Brand onDark={!inkText} />
          </a>

          <ul className="ml-auto hidden items-center gap-1 xl:flex">
            {NAV.map((n) => {
              const isActive = active === n.href.slice(1)
              const hasMenu = !!MENUS[n.href]
              const isOpen = mega === n.href
              return (
                <li
                  key={n.href}
                  className="flex items-center"
                  onPointerEnter={(e) => e.pointerType === 'mouse' && (hasMenu ? hoverMenu(n.href) : leaveMenu())}
                >
                  <a
                    href={n.href}
                    onClick={closeMenu}
                    aria-current={isActive ? 'true' : undefined}
                    className={`relative whitespace-nowrap rounded-full px-3.5 py-2 text-[14px] font-semibold transition-colors ${
                      inkText
                        ? isActive ? 'text-ink' : 'text-ink/65 hover:text-ink'
                        : isActive ? 'text-white' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {n.label}
                    <span className={`absolute inset-x-3.5 -bottom-0.5 h-[2px] rounded-full bg-saffron transition-transform duration-300 ${isActive || isOpen ? 'scale-x-100' : 'scale-x-0'}`} />
                  </a>
                  {hasMenu && (
                    <button
                      type="button"
                      id={`mega-toggle-${n.href.slice(1)}`}
                      aria-expanded={isOpen}
                      aria-controls="mega-panel"
                      aria-label={`${isOpen ? 'Hide' : 'Show'} ${n.label} photos`}
                      onClick={() => (isOpen ? closeMenu() : setMega(n.href))}
                      className={`-ml-2.5 mr-1 grid h-8 w-6 place-items-center rounded-full transition-colors ${inkText ? 'text-ink/50 hover:text-ink' : 'text-white/55 hover:text-white'}`}
                    >
                      <ChevronDown size={15} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                    </button>
                  )}
                </li>
              )
            })}
          </ul>

          <div className="ml-auto flex items-center gap-2 xl:ml-2">
            <a href={`tel:${PHONE}`} className={`hidden h-11 items-center gap-2 rounded-full px-3 whitespace-nowrap text-[14px] font-semibold 2xl:inline-flex ${inkText ? 'text-ink/80 hover:text-ink' : 'text-white/85 hover:text-white'}`}>
              <Phone size={16} /> {PHONE_DISPLAY}
            </a>
            <button
              type="button"
              onClick={toggle}
              aria-label={light ? 'Switch to dark theme' : 'Switch to light theme'}
              title={light ? 'Dark theme' : 'Light theme'}
              className={`grid h-11 w-11 place-items-center rounded-full border transition-colors ${
                inkText ? 'border-ink/15 text-ink hover:bg-ink/5' : 'border-white/25 text-white hover:bg-white/10'
              }`}
            >
              {light ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <a href="#book" className="btn-primary hidden min-h-[44px] whitespace-nowrap px-5 text-[14px] sm:inline-flex">
              Book your stay
            </a>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className={`grid h-11 w-11 place-items-center rounded-full xl:hidden ${inkText ? 'text-ink hover:bg-ink/5' : 'text-white hover:bg-white/10'}`}
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
        <MegaPanel href={mega} light={light} onNavigate={closeMenu} onPointerEnter={keepMenu} onPointerLeave={leaveMenu} />
      </header>

      {/* Outside the header: its backdrop blur would otherwise trap this fixed panel. */}
      <div
        id="mobile-menu"
        className={`fixed inset-x-0 bottom-0 top-[68px] z-[45] ${light ? 'bg-foam' : 'bg-ink'} transition-[opacity,visibility] duration-300 xl:hidden ${open ? 'visible opacity-100' : 'invisible opacity-0'}`}
      >
        <div className="flex h-full flex-col overflow-y-auto px-6 pb-8 pt-4">
          <ul className={`divide-y ${light ? 'divide-ink/10' : 'divide-white/10'}`}>
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} onClick={() => setOpen(false)} className={`flex items-center justify-between py-4 font-display text-2xl font-medium ${light ? 'text-ink' : 'text-white'}`}>
                  {n.label}
                  <ChevronRight size={22} className="text-accent" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-auto grid gap-3 pt-8">
            <a href={waLink('Hi, I would like to book a stay at Laxmi Beach Homestay, Malvan.')} target="_blank" rel="noopener noreferrer" className="btn-primary w-full">
              <WhatsAppIcon size={20} /> WhatsApp {WHATSAPP_DISPLAY}
            </a>
            <a href={`tel:${PHONE}`} className={`${light ? 'btn-outline' : 'btn-outline-light'} w-full`}>
              <Phone size={18} /> Call {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
