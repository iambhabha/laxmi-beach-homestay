import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { Play, Volume2, VolumeX } from 'lucide-react'

const CLIPS = [
  {
    id: 'balcony',
    src: '/videos/balcony-view.mp4',
    poster: '/videos/balcony-view.webp',
    title: 'From our balcony',
    text: 'Malvan bay, the fort jetty and Sindhudurg Fort on the horizon.',
  },
  {
    id: 'parking',
    src: '/videos/night-parking.mp4',
    poster: '/videos/night-parking.webp',
    title: 'Parking at night',
    text: 'Well-lit, CCTV-covered government parking right outside.',
  },
]

/**
 * A portrait clip that plays silently while on screen and pauses off screen.
 * With reduced motion it waits for a tap instead of playing on its own.
 */
function Clip({ clip, soundOn, onSound }) {
  const video = useRef(null)
  const reduce = useReducedMotion()
  const [playing, setPlaying] = useState(false)
  const soundRef = useRef(soundOn)
  soundRef.current = soundOn
  const onSoundRef = useRef(onSound)
  onSoundRef.current = onSound

  useEffect(() => {
    const el = video.current
    if (!el || reduce) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) el.play().catch(() => {})
        else {
          el.pause()
          // Leaving the clip also turns its music off, so coming back is quiet.
          if (soundRef.current) onSoundRef.current(null)
        }
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduce])

  useEffect(() => {
    if (video.current) video.current.muted = !soundOn
  }, [soundOn])

  const toggleSound = () => {
    const el = video.current
    if (soundOn) return onSound(null)
    onSound(clip.id)
    el.play().catch(() => {})
  }

  return (
    <figure className="flex flex-col">
      <div className="relative aspect-[9/16] overflow-hidden rounded-[1.6rem] bg-ink shadow-lift ring-1 ring-ink/10">
        <video
          ref={video}
          src={clip.src}
          muted
          loop
          playsInline
          preload="none"
          aria-label={`${clip.title}: ${clip.text}`}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className="h-full w-full object-cover"
        />
        {!playing && (
          <img src={clip.poster} alt="" loading="lazy" className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
        )}
        {!playing && (
          <button
            type="button"
            onClick={() => video.current.play()}
            aria-label={`Play video: ${clip.title}`}
            className="absolute inset-0 grid place-items-center bg-ink/20 transition-colors hover:bg-ink/30"
          >
            <span className="grid h-14 w-14 place-items-center rounded-full bg-white/90 text-ink shadow-lift">
              <Play size={24} className="translate-x-0.5" />
            </span>
          </button>
        )}
        <button
          type="button"
          onClick={toggleSound}
          aria-pressed={soundOn}
          aria-label={soundOn ? `Sound on. Mute ${clip.title}` : `Sound off. Play ${clip.title} with music`}
          className="absolute bottom-3 right-3 inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-ink/70 px-3 text-[12px] font-bold text-white backdrop-blur transition-colors hover:bg-ink/85"
        >
          {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
          <span className="hidden sm:inline">{soundOn ? 'Sound on' : 'Sound off'}</span>
        </button>
      </div>
      <figcaption className="mt-3">
        <span className="block font-display text-lg font-semibold leading-tight">{clip.title}</span>
        <span className="mt-1 block text-[13px] leading-snug text-muted">{clip.text}</span>
      </figcaption>
    </figure>
  )
}

export default function VideoShowcase() {
  const [sound, setSound] = useState(null)
  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
      <div className="max-w-md">
        <h3 className="font-display text-3xl font-semibold leading-tight">See it for yourself</h3>
        <p className="mt-3 leading-relaxed text-muted">
          Two short clips shot at the homestay: the view you wake up to, and the parking right outside after dark. Tap
          the speaker for a little beach music.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:w-[540px]">
        {CLIPS.map((c) => (
          <Clip key={c.id} clip={c} soundOn={sound === c.id} onSound={setSound} />
        ))}
      </div>
    </div>
  )
}
