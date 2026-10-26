import { createContext, useContext, useLayoutEffect, useState } from 'react'
import { flushSync } from 'react-dom'

// 'dark' keeps the water sports, reviews and footer sections black;
// 'light' turns them white/sand. The 3D hero looks the same in both.
const ThemeContext = createContext({ theme: 'dark', toggle: () => {} })

const KEY = 'laxmi-theme'

export function ThemeProvider({ children }) {
  // The pre-rendered HTML is always dark. A tiny script in index.html applies a
  // saved (or ?theme=) choice to <html> before first paint; React picks it up
  // here, after hydration, so the server and client markup stay identical.
  const [theme, setTheme] = useState('dark')
  useLayoutEffect(() => {
    if (document.documentElement.dataset.theme === 'light') setTheme('light')
  }, [])

  // Only a deliberate switch is remembered; a ?theme= preview link is not.
  const apply = (next) => {
    document.documentElement.dataset.theme = next
    setTheme(next)
    try {
      localStorage.setItem(KEY, next)
    } catch {
      // not persisted; the choice still applies for this visit
    }
  }

  /**
   * Switches theme with the new one spreading out in a circle from the point
   * that was clicked. Falls back to an instant switch where View Transitions
   * are unsupported or the visitor prefers reduced motion.
   */
  const toggle = (event) => {
    const next = theme === 'dark' ? 'light' : 'dark'
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!document.startViewTransition || reduce) {
      apply(next)
      return
    }
    const x = event?.clientX ?? window.innerWidth - 60
    const y = event?.clientY ?? 34
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
    const transition = document.startViewTransition(() => flushSync(() => apply(next)))
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 650, easing: 'cubic-bezier(.2,.7,.2,1)', pseudoElement: '::view-transition-new(root)' },
      )
    })
  }

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
