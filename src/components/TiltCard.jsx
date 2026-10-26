import { useRef } from 'react'
import { useReducedMotion } from 'motion/react'

/**
 * Leans towards the pointer in 3D with a soft light glare. Touch and
 * reduced-motion users get a flat card.
 */
export default function TiltCard({ children, className = '', max = 9 }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()

  const onMove = (e) => {
    if (reduce || e.pointerType !== 'mouse') return
    const el = ref.current
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    el.style.setProperty('--rx', `${(0.5 - py) * max}deg`)
    el.style.setProperty('--ry', `${(px - 0.5) * max}deg`)
    el.style.setProperty('--gx', `${px * 100}%`)
    el.style.setProperty('--gy', `${py * 100}%`)
    el.style.setProperty('--glare', '1')
  }
  const reset = () => {
    const el = ref.current
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
    el.style.setProperty('--glare', '0')
  }

  return (
    <div className="h-full [perspective:1000px]">
      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={reset}
        className={`relative transition-transform duration-300 ease-out [transform-style:preserve-3d] [transform:rotateX(var(--rx,0))_rotateY(var(--ry,0))] ${className}`}
      >
        {children}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-[var(--glare,0)] mix-blend-soft-light transition-opacity duration-300"
          style={{ background: 'radial-gradient(circle at var(--gx,50%) var(--gy,50%), rgba(255,255,255,.55), transparent 55%)' }}
        />
      </div>
    </div>
  )
}
