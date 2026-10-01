import { AnimatePresence } from 'framer-motion'
import Lenis from 'lenis'
import { useCallback, useEffect, useState } from 'react'
import { Cursor, Nav, Preloader, ScrollProgress } from './components/Chrome'
import { ContactProvider } from './components/Contact'
import Hero from './components/Hero'
import { useTheme } from './components/theme'
import { About, Contact, Education, Experience, Projects, Skills } from './components/Sections'

export default function App() {
  const [loading, setLoading] = useState(true)
  const done = useCallback(() => setLoading(false), [])
  const themeCtl = useTheme()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true })
    let raf = 0
    const loop = (t: number) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!a) return
      const id = a.getAttribute('href')!
      const el = id === '#top' ? 0 : document.querySelector<HTMLElement>(id)
      if (el === null) return
      e.preventDefault()
      lenis.scrollTo(el, { offset: -20 })
    }
    document.addEventListener('click', onClick)
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('click', onClick)
      lenis.destroy()
    }
  }, [])

  useEffect(() => {
    document.documentElement.style.overflow = loading ? 'hidden' : ''
  }, [loading])

  return (
    <ContactProvider>
      <div className="grain">
        <AnimatePresence>{loading && <Preloader onDone={done} />}</AnimatePresence>
        <Cursor />
        <ScrollProgress />
        <Nav themeCtl={themeCtl} />
        <main>
          <Hero ready={!loading} />
          <About />
          <Experience />
          <Projects />
          <Skills />
          <Education />
          <Contact />
        </main>
      </div>
    </ContactProvider>
  )
}
