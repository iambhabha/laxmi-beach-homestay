import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, LayoutGroup, MotionConfig, motion } from 'motion/react'
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react'
import { img, srcset } from '../site'
import { SectionHeader } from './ui'
import ParallaxImg from './ParallaxImg'
import VideoShowcase from './VideoShowcase'

// w/h are the photos' real proportions, so the viewer can open each one at its
// true shape. `span` lays out the "All" view as a gap-free 4×5 bento grid.
const PHOTOS = [
  { src: 'view-from-homestay', cat: 'view', w: 4, h: 3, label: 'Sindhudurg Fort on the horizon, from the homestay', span: 'col-span-2 row-span-2' },
  { src: 'room1', cat: 'rooms', w: 2, h: 3, label: 'Fresh Blue Sea View room', span: 'row-span-2' },
  { src: 'restraurant-1-image', cat: 'restaurant', w: 3, h: 2, label: 'Laxmi Restaurant', span: '' },
  { src: 'restraunt-image-2', cat: 'restaurant', w: 3, h: 2, label: 'Restaurant dining hall', span: '' },
  { src: 'room2', cat: 'rooms', w: 2, h: 3, label: 'Pink Paradise Room', span: 'row-span-2' },
  { src: 'homestay-from-sea', cat: 'view', w: 16, h: 9, label: 'The homestay and our scuba centre, seen from the sea', span: 'col-span-2 row-span-2' },
  { src: 'room3', cat: 'rooms', w: 2, h: 3, label: 'Blue Serenity Room', span: 'row-span-2' },
  { src: 'toilet', cat: 'rooms', w: 3, h: 2, label: 'Modern attached bathroom', span: 'col-span-2' },
  { src: 'room4', cat: 'rooms', w: 2, h: 3, label: 'Dreamy Pink Room', span: 'col-span-2', pos: 'object-[50%_78%]' },
]

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'view', label: 'The view' },
  { key: 'rooms', label: 'Rooms' },
  { key: 'restaurant', label: 'Restaurant' },
]

const spring = { type: 'spring', stiffness: 260, damping: 32 }

/** Full-screen viewer: opens from the tapped tile, swipes and arrow-keys between photos. */
function Viewer({ photos, index, openedSrc, onClose, onGo }) {
  const photo = photos[index]
  const [dir, setDir] = useState(0)
  const closeBtn = useRef(null)
  const thumbs = useRef(null)
  // Only the photo that was tapped morphs from/to its tile; others slide.
  const linked = photo.src === openedSrc

  const go = useCallback((d) => {
    setDir(d)
    onGo(d)
  }, [onGo])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    closeBtn.current?.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
    }
  }, [go, onClose])

  useEffect(() => {
    thumbs.current?.querySelector('[aria-current="true"]')?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [index])

  // Portalled to <body> so the section's CSS containment can't trap the overlay.
  return createPortal(
    <div role="dialog" aria-modal="true" aria-label="Photo viewer" className="fixed inset-0 z-[100] flex flex-col">
      <motion.div
        className="absolute inset-0 bg-ink/90 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <div className="relative flex items-center justify-between px-4 py-3 text-white sm:px-6">
        <span className="text-[14px] tabular-nums text-white/70">{index + 1} / {photos.length}</span>
        <button ref={closeBtn} type="button" onClick={onClose} aria-label="Close photo viewer" className="grid h-11 w-11 place-items-center rounded-full bg-white/10 hover:bg-white/20">
          <X size={22} />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.figure
            key={photo.src}
            custom={dir}
            layoutId={linked ? `tile-${photo.src}` : undefined}
            initial={linked ? false : (d) => ({ opacity: 0, x: d * 80 })}
            animate={{ opacity: 1, x: 0 }}
            exit={(d) => ({ opacity: 0, x: d * -80 })}
            transition={spring}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.5}
            onDragEnd={(_, info) => {
              if (info.offset.x < -70 || info.velocity.x < -500) go(1)
              else if (info.offset.x > 70 || info.velocity.x > 500) go(-1)
            }}
            className="relative max-h-full cursor-grab overflow-hidden rounded-2xl shadow-lift active:cursor-grabbing"
            style={{ aspectRatio: `${photo.w} / ${photo.h}`, width: `min(100%, calc((100dvh - 200px) * ${photo.w / photo.h}), 1200px)` }}
          >
            <img src={img(photo.src)} alt={photo.label} draggable="false" className={`h-full w-full select-none object-cover ${photo.pos || ''}`} />
          </motion.figure>
        </AnimatePresence>

        <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-lift hover:bg-white sm:grid">
          <ChevronLeft size={24} />
        </button>
        <button type="button" onClick={() => go(1)} aria-label="Next photo" className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-lift hover:bg-white sm:grid">
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="relative px-4 pb-4 pt-3 text-center sm:px-6">
        <p className="text-[15px] font-semibold text-white" aria-live="polite">{photo.label}</p>
        <p className="mt-0.5 text-[12px] text-white/50 sm:hidden">Swipe to see more</p>
        <ul ref={thumbs} className="scrollbar-none mx-auto mt-3 flex max-w-full justify-start gap-2 overflow-x-auto pb-1 sm:justify-center">
          {photos.map((p, i) => (
            <li key={p.src} className="shrink-0">
              <button
                type="button"
                onClick={() => go(i - index)}
                aria-label={`Show ${p.label}`}
                aria-current={i === index}
                className={`block h-12 w-16 overflow-hidden rounded-lg ring-2 transition-[opacity,box-shadow] ${i === index ? 'opacity-100 ring-saffron' : 'opacity-50 ring-transparent hover:opacity-80'}`}
              >
                <img src={img(p.src, true)} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>,
    document.body,
  )
}

export default function Gallery() {
  const [filter, setFilter] = useState('all')
  const [open, setOpen] = useState(null) // { index, src } of the viewer, or null
  const lastTile = useRef(null)
  const shown = filter === 'all' ? PHOTOS : PHOTOS.filter((p) => p.cat === filter)
  const bento = filter === 'all'

  const close = useCallback(() => {
    setOpen(null)
    // Give focus back to the tile the viewer was opened from.
    requestAnimationFrame(() => lastTile.current?.focus())
  }, [])
  const goBy = useCallback((d) => setOpen((o) => o && { ...o, index: (o.index + d + shown.length) % shown.length }), [shown.length])

  return (
    <MotionConfig reducedMotion="user">
      <section id="gallery" className="bg-foam py-20 sm:py-28">
        <div className="mx-auto max-w-page px-4 sm:px-6">
          <SectionHeader eyebrow="Gallery" title="Inside Laxmi" intro="The homestay, our rooms and restaurant, and the view over the bay to Sindhudurg Fort. Tap a photo to see it full size." />

          <VideoShowcase />

          <LayoutGroup>
            <div role="radiogroup" aria-label="Filter photos" className="mt-16 inline-flex rounded-full bg-white p-1 shadow-card ring-1 ring-ink/5">
              {FILTERS.map((f) => {
                const on = filter === f.key
                return (
                  <button
                    key={f.key}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setFilter(f.key)}
                    className={`relative min-h-[40px] rounded-full px-4 text-[14px] font-bold transition-colors ${on ? 'text-white' : 'text-ink/70 hover:text-ink'}`}
                  >
                    {on && <motion.span layoutId="gallery-filter" transition={spring} className="absolute inset-0 rounded-full bg-ink" />}
                    <span className="relative">{f.label}</span>
                  </button>
                )
              })}
            </div>

            <motion.ul
              layout
              className={`mt-6 grid gap-3 ${bento ? 'grid-flow-dense auto-rows-[150px] grid-cols-2 sm:auto-rows-[190px] md:grid-cols-4' : 'auto-rows-[220px] grid-cols-2 sm:auto-rows-[260px] md:grid-cols-3'}`}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {shown.map((p, i) => (
                  <motion.li
                    key={p.src}
                    layout
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={spring}
                    className={bento ? p.span : ''}
                  >
                    <motion.button
                      type="button"
                      layoutId={`tile-${p.src}`}
                      onClick={(e) => {
                        lastTile.current = e.currentTarget
                        setOpen({ index: i, src: p.src })
                      }}
                      transition={spring}
                      className="group relative h-full w-full overflow-hidden rounded-xl2 bg-sand text-left"
                      aria-label={`Open photo: ${p.label}`}
                    >
                      <ParallaxImg
                        src={img(p.src, !(bento && p.span.includes('col-span-2')))}
                        srcSet={bento && p.span.includes('col-span-2') ? undefined : srcset(p.src)}
                        sizes="(min-width: 768px) 400px, 50vw"
                        amount={bento && p.span.includes('row-span-2') ? 9 : 6}
                        imgClassName={p.pos || ''}
                        className="transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <span className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
                      <span className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 text-[13px] font-semibold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                        {p.label}
                        <Expand size={16} className="shrink-0" />
                      </span>
                    </motion.button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>

            <AnimatePresence>
              {open && <Viewer key="viewer" photos={shown} index={open.index} openedSrc={open.src} onClose={close} onGo={goBy} />}
            </AnimatePresence>
          </LayoutGroup>
        </div>
      </section>
    </MotionConfig>
  )
}
