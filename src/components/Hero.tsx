import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowDownRight, MapPin } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { profile } from '../data'
import { ease, Magnetic, Socials } from './ui'

function RoleTicker() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % profile.roles.length), 2600)
    return () => clearInterval(id)
  }, [])
  return (
    <span className="relative inline-flex h-[1.3em] overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.5, ease }}
          className="text-gradient font-medium"
        >
          {profile.roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

const badges = [
  { label: 'Vue · Nuxt', icon: '/tech/vuejs.svg', className: '-left-6 top-[18%]', d: 0 },
  { label: 'React · Next', icon: '/tech/react.svg', className: '-right-8 top-[42%]', d: 0.6 },
  { label: 'Laravel APIs', icon: '/tech/laravel.svg', className: '-left-10 top-[62%]', d: 1.2 },
]

export default function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yText = useTransform(scrollYProgress, [0, 1], [0, 160])
  const yImg = useTransform(scrollYProgress, [0, 1], [0, -90])
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const mx = useMotionValue(50)
  const my = useMotionValue(30)
  const smx = useSpring(mx, { stiffness: 60, damping: 20 })
  const smy = useSpring(my, { stiffness: 60, damping: 20 })
  const spot = useMotionTemplate`radial-gradient(600px circle at ${smx}% ${smy}%, rgba(59,130,246,0.18), transparent 60%)`

  const rx = useSpring(useMotionValue(0), { stiffness: 120, damping: 14 })
  const ry = useSpring(useMotionValue(0), { stiffness: 120, damping: 14 })

  const show = ready ? 'show' : 'hidden'
  const up = { hidden: { y: '110%' }, show: (d: number) => ({ y: 0, transition: { duration: 1.1, delay: d, ease } }) }
  const fadeUp = { hidden: { opacity: 0, y: 24 }, show: (d: number) => ({ opacity: 1, y: 0, transition: { duration: 0.9, delay: d, ease } }) }

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] items-center overflow-hidden px-4 pb-16 pt-32 md:px-8"
      onMouseMove={(e) => {
        mx.set((e.clientX / window.innerWidth) * 100)
        my.set((e.clientY / window.innerHeight) * 100)
      }}
    >
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <motion.div className="pointer-events-none absolute inset-0" style={{ background: spot }} />
      <div className="pointer-events-none absolute -left-40 top-20 h-[480px] w-[480px] rounded-full bg-accent/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-[420px] w-[420px] rounded-full bg-accent-2/10 blur-[120px]" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-[1.25fr_1fr]">
        <motion.div style={{ y: yText, opacity: fade }}>
          <motion.div variants={fadeUp} custom={0.1} initial="hidden" animate={show} className="glass mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-fg/80">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Open to new opportunities
          </motion.div>

          <h1 className="font-display text-[15vw] font-bold leading-[0.88] tracking-[-0.04em] sm:text-8xl lg:text-[8.5rem]">
            <span className="block overflow-hidden pb-2">
              <motion.span className="block" variants={up} custom={0.2} initial="hidden" animate={show}>
                {profile.firstName}
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-2">
              <motion.span className="text-outline block" variants={up} custom={0.32} initial="hidden" animate={show}>
                {profile.lastName}
              </motion.span>
            </span>
          </h1>

          <motion.p variants={fadeUp} custom={0.55} initial="hidden" animate={show} className="mt-8 text-xl text-fg/80 md:text-2xl">
            <RoleTicker />
          </motion.p>

          <motion.p variants={fadeUp} custom={0.65} initial="hidden" animate={show} className="mt-6 max-w-xl text-base leading-relaxed text-mute md:text-lg">
            I design and build complete web products — robust APIs, clean data models and interfaces people love to use. Software Engineer at{' '}
            <span className="text-fg">Cosmic Data</span> and Software Engineering student at <span className="text-fg">ENSI</span>.
          </motion.p>

          <motion.div variants={fadeUp} custom={0.8} initial="hidden" animate={show} className="mt-10 flex flex-wrap items-center gap-4">
            <Magnetic>
              <a href="#work" className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-2 px-7 py-4 font-medium text-white shadow-lg shadow-accent/30">
                See my work
                <ArrowDownRight className="h-5 w-5 transition-transform group-hover:rotate-[-45deg]" />
              </a>
            </Magnetic>
            <Socials />
          </motion.div>
          <motion.p variants={fadeUp} custom={0.9} initial="hidden" animate={show} className="mt-6 inline-flex items-center gap-1.5 text-sm text-mute">
            <MapPin className="h-4 w-4" /> {profile.location}
          </motion.p>
        </motion.div>

        <motion.div
          style={{ y: yImg }}
          initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
          animate={ready ? { opacity: 1, scale: 1, rotate: 0 } : {}}
          transition={{ duration: 1.4, delay: 0.35, ease }}
          className="relative mx-auto w-full max-w-[420px] [perspective:1000px]"
        >
          <motion.div
            data-cursor
            style={{ rotateX: rx, rotateY: ry }}
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect()
              ry.set(((e.clientX - r.left) / r.width - 0.5) * 16)
              rx.set(-((e.clientY - r.top) / r.height - 0.5) * 16)
            }}
            onMouseLeave={() => {
              rx.set(0)
              ry.set(0)
            }}
            className="relative aspect-[4/5]"
          >
            <div className="absolute -inset-[3px] overflow-hidden rounded-[2.2rem]">
              <div className="ring-spin absolute -inset-1/2" />
            </div>
            <div className="absolute inset-0 overflow-hidden rounded-[2rem] bg-ink-2">
              <img src="/img/portrait.webp" alt="Portrait of Yassir Choujai" className="h-full w-full scale-105 object-cover object-[50%_35%]" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between">
                <div>
                  <p className="font-display text-xl font-semibold">{profile.name}</p>
                  <p className="text-sm text-fg/60">{profile.role}</p>
                </div>
                <span className="glass rounded-full px-3 py-1 text-xs">2025 — now</span>
              </div>
            </div>
            {badges.map((b) => (
              <motion.div
                key={b.label}
                className={`glass absolute hidden items-center gap-2 rounded-2xl px-4 py-2 sm:flex text-sm font-medium shadow-xl shadow-black/40 ${b.className}`}
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: b.d, ease: 'easeInOut' }}
                style={{ translateZ: 60 }}
              >
                <img src={b.icon} alt="" className="h-4 w-4" />
                {b.label}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        style={{ opacity: fade }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-mute md:flex"
      >
        Scroll
        <span className="relative h-10 w-px overflow-hidden bg-line">
          <motion.span className="absolute inset-x-0 top-0 h-1/2 bg-accent-2" animate={{ y: ['-100%', '200%'] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }} />
        </span>
      </motion.a>
    </section>
  )
}
