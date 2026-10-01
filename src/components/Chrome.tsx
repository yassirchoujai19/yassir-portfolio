import { AnimatePresence, motion, useMotionValue, useScroll, useSpring } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { profile } from '../data'
import { useContact } from './Contact'
import { ThemeToggle, type useTheme } from './theme'
import { ease, Magnetic, Socials } from './ui'

export function Preloader({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    let v = 0
    const id = setInterval(() => {
      v = Math.min(100, v + Math.ceil(Math.random() * 9))
      setN(v)
      if (v === 100) {
        clearInterval(id)
        setTimeout(onDone, 350)
      }
    }, 45)
    return () => clearInterval(id)
  }, [onDone])
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-ink-2 p-6 md:p-10"
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 1, ease }}
      style={{ clipPath: 'inset(0 0 0% 0)' }}
    >
      <div className="flex justify-between text-xs uppercase tracking-[0.3em] text-mute">
        <span>Portfolio</span>
        <span>{new Date().getFullYear()}</span>
      </div>
      <div className="overflow-hidden">
        <motion.h1
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          transition={{ duration: 0.9, ease }}
          className="font-display text-5xl font-semibold tracking-tight md:text-8xl"
        >
          {profile.firstName}<span className="text-accent-2">.</span>
        </motion.h1>
      </div>
      <div className="flex items-end justify-between">
        <div className="h-px flex-1 bg-line">
          <motion.div className="h-px bg-gradient-to-r from-accent to-accent-2" style={{ width: `${n}%` }} />
        </div>
        <span className="ml-6 font-display text-6xl font-semibold tabular-nums md:text-8xl">{n}</span>
      </div>
    </motion.div>
  )
}

export function Cursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40 })
  const sy = useSpring(y, { stiffness: 500, damping: 40 })
  const [hover, setHover] = useState(false)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    setEnabled(true)
    const move = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setHover(!!(e.target as HTMLElement).closest('a,button,[data-cursor]'))
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [x, y])

  if (!enabled) return null
  return (
    <>
      <motion.div className="pointer-events-none fixed left-0 top-0 z-[90] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference" style={{ x, y }} />
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[90] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/50 mix-blend-difference"
        style={{ x: sx, y: sy }}
        animate={{ width: hover ? 64 : 34, height: hover ? 64 : 34, backgroundColor: hover ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0)' }}
        transition={{ duration: 0.25 }}
      />
    </>
  )
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  return <motion.div className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-gradient-to-r from-accent to-accent-2" style={{ scaleX }} />
}

const links = [
  ['About', '#about'],
  ['Experience', '#experience'],
  ['Work', '#work'],
  ['Skills', '#skills'],
  ['Contact', '#contact'],
]

export function Nav({ themeCtl }: { themeCtl: ReturnType<typeof useTheme> }) {
  const contact = useContact()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40)
    f()
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.2, ease }}
        className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8"
      >
        <nav
          className={`mx-auto flex max-w-7xl items-center justify-between rounded-full px-5 py-3 transition-all duration-500 ${scrolled ? 'glass shadow-2xl shadow-black/40' : ''}`}
        >
          <a href="#top" className="font-display text-lg font-bold tracking-tight">
            YC<span className="text-accent-2">.</span>
          </a>
          <ul className="hidden items-center gap-1 md:flex">
            {links.map(([l, h]) => (
              <li key={h}>
                <a href={h} className="group relative block overflow-hidden rounded-full px-4 py-2 text-sm text-fg/70 transition hover:text-fg">
                  <span className="block transition-transform duration-300 group-hover:-translate-y-[130%]">{l}</span>
                  <span className="absolute inset-x-4 top-2 block translate-y-[130%] text-accent-2 transition-transform duration-300 group-hover:translate-y-0">{l}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <ThemeToggle {...themeCtl} />
            <Magnetic>
              <button onClick={() => contact.open()} className="rounded-full bg-fg px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-accent-2 hover:text-white">
                Let's talk
              </button>
            </Magnetic>
            <button className="md:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] flex flex-col bg-ink-2 p-6"
            initial={{ clipPath: 'circle(0% at 100% 0%)' }}
            animate={{ clipPath: 'circle(150% at 100% 0%)' }}
            exit={{ clipPath: 'circle(0% at 100% 0%)' }}
            transition={{ duration: 0.7, ease }}
          >
            <div className="flex justify-between">
              <span className="font-display text-lg font-bold">YC<span className="text-accent-2">.</span></span>
              <button onClick={() => setOpen(false)} aria-label="Close menu">
                <X />
              </button>
            </div>
            <ul className="mt-16 space-y-4">
              {links.map(([l, h], i) => (
                <motion.li key={h} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.07, ease }}>
                  <a href={h} onClick={() => setOpen(false)} className="font-display text-5xl font-semibold">
                    {l}
                  </a>
                </motion.li>
              ))}
            </ul>
            <button
              onClick={() => {
                setOpen(false)
                contact.open()
              }}
              className="mt-auto rounded-full bg-gradient-to-r from-accent to-accent-2 px-6 py-4 font-medium text-white"
            >
              Let's talk
            </button>
            <div className="mt-6 flex justify-center">
              <Socials size="sm" />
            </div>
            <p className="mt-4 text-center text-sm text-mute">{profile.email}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
