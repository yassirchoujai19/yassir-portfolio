import { animate, motion, useInView, useMotionValue, useSpring, type Variants } from 'framer-motion'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { profile } from '../data'

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

export function LinkedinIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  )
}

export function MediumIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12Zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42ZM24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12Z" />
    </svg>
  )
}

export const socials = [
  { label: 'GitHub', href: profile.github, Icon: GithubIcon },
  { label: 'LinkedIn', href: profile.linkedin, Icon: LinkedinIcon },
  { label: 'Medium', href: profile.medium, Icon: MediumIcon },
]

export function Socials({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const box = size === 'md' ? 'h-14 w-14' : 'h-10 w-10'
  const icon = size === 'md' ? 'h-5 w-5' : 'h-4 w-4'
  return (
    <div className="flex items-center gap-3">
      {socials.map(({ label, href, Icon }) => (
        <Magnetic key={label} strength={0.4}>
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            title={label}
            className={`glass group relative flex ${box} items-center justify-center overflow-hidden rounded-full transition hover:border-transparent`}
          >
            <span className="absolute inset-0 translate-y-full rounded-full bg-gradient-to-br from-accent to-accent-2 transition-transform duration-500 group-hover:translate-y-0" />
            <Icon className={`relative ${icon} transition-colors group-hover:text-white`} />
          </a>
        </Magnetic>
      ))}
    </div>
  )
}
