import { animate, motion, useInView, useMotionValue, useSpring, type Variants } from 'framer-motion'
import { useEffect, useRef, useState, type ReactNode } from 'react'

export const ease = [0.22, 1, 0.36, 1] as const

export function Reveal({ children, delay = 0, y = 40, className = '' }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

const wordVariants: Variants = {
  hidden: { y: '110%', rotate: 4 },
  show: (i: number) => ({ y: '0%', rotate: 0, transition: { duration: 1, delay: i * 0.06, ease } }),
}

export function SplitText({ text, className = '', delay = 0, once = true }: { text: string; className?: string; delay?: number; once?: boolean }) {
  const words = text.split(' ')
  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: '-60px' }}
      aria-label={text}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom" aria-hidden>
          <motion.span className="inline-block" custom={i + delay / 0.06} variants={wordVariants}>
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}

export function Magnetic({ children, strength = 0.35, className = '' }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 15, mass: 0.4 })
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 15, mass: 0.4 })
  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      style={{ x, y }}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect()
        x.set((e.clientX - r.left - r.width / 2) * strength)
        y.set((e.clientY - r.top - r.height / 2) * strength)
      }}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}

export function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, { duration: 1.8, ease, onUpdate: (v) => setVal(Math.round(v)) })
    return () => c.stop()
  }, [inView, to])
  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  )
}

export function SectionTitle({ index, kicker, title }: { index: string; kicker: string; title: string }) {
  return (
    <div className="mb-14 md:mb-20">
      <Reveal>
        <div className="mb-5 flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-mute">
          <span className="font-display text-accent-2">{index}</span>
          <span className="h-px w-10 bg-gradient-to-r from-accent to-transparent" />
          {kicker}
        </div>
      </Reveal>
      <h2 className="font-display text-4xl font-semibold leading-[1.02] tracking-tight md:text-7xl">
        <SplitText text={title} />
      </h2>
    </div>
  )
}

export function GithubIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.9 1.2 1.9 1.2 1.1 1.9 2.9 1.3 3.6 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.6 18.3 5 18.3 5c.7 1.7.3 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" />
    </svg>
  )
}
