import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'

/**
 * A photo that drifts slightly inside its frame as the page scrolls, like
 * looking through a window. `amount` is the drift in percent of the frame.
 * The frame (this wrapper) takes `className`, so hover zoom etc. go there.
 */
export default function ParallaxImg({ src, srcSet, sizes, alt = '', amount = 8, className = '', imgClassName = '', loading = 'lazy' }) {
  const frame = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: frame, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : [`-${amount}%`, `${amount}%`])

  return (
    <div ref={frame} className={`relative h-full w-full overflow-hidden ${className}`}>
      <motion.img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={loading}
        style={{ y, scale: reduce ? 1 : 1 + (amount * 2.2) / 100 }}
        className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`}
      />
    </div>
  )
}
