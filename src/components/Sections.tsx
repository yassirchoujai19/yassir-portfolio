import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowUpRight, Check, Copy, GraduationCap, Lock, Mail, MessageSquare, Phone, Sparkles } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { education, experience, languages, marquee, profile, projects, skillGroups, stats, strengths, type Project, type Tech } from '../data'
import { useContact } from './Contact'
import { Counter, ease, GithubIcon, Magnetic, Reveal, SectionTitle, SplitText } from './ui'

/* ───────────────────────── About ───────────────────────── */

export function About() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  const clip = useTransform(scrollYProgress, [0.05, 0.4], ['inset(18% 10% 18% 10% round 2rem)', 'inset(0% 0% 0% 0% round 2rem)'])

  return (
    <section id="about" className="relative px-4 py-28 md:px-8 md:py-40">
      <div className="mx-auto max-w-7xl">
        <SectionTitle index="01" kicker="About me" title="Curious mind, complete products." />
        <div className="grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <div ref={ref} className="relative">
            <motion.div style={{ clipPath: clip }} className="relative aspect-[3/4] overflow-hidden rounded-[2rem]">
              <motion.img style={{ y, scale: 1.18 }} src="/img/graduation.webp" alt="Yassir at graduation in Tangier" className="h-full w-full object-cover object-[50%_40%]" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
            </motion.div>
            <Reveal delay={0.3} className="glass absolute -bottom-6 right-4 flex items-center gap-3 rounded-2xl px-5 py-4 md:-right-6">
              <GraduationCap className="h-6 w-6 text-accent-2" />
              <div>
                <p className="text-sm font-medium">Software Development Diploma</p>
                <p className="text-xs text-mute">CIEL · Class of 2025</p>
              </div>
            </Reveal>
          </div>

          <div className="flex flex-col justify-center">
            <Reveal>
              <p className="font-display text-2xl leading-snug text-fg/90 md:text-3xl">
                I'm <span className="text-gradient font-semibold">Yassir</span>, a software engineer from Tangier who loves turning ideas into fast, polished products.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 text-lg leading-relaxed text-mute">{profile.summary}</p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-4 text-lg leading-relaxed text-mute">
                From a clinic management platform and an AI voice-interview app to HR tools, I work across the whole stack — modelling data, designing REST APIs in Laravel, and shipping polished Vue and React front-ends with tests and CI/CD. I care about the details: solid architecture, smooth UX and code the next engineer will thank me for.
              </p>
            </Reveal>

            <div className="mt-12 grid grid-cols-2 gap-4">
              {stats.map((s, i) => (
                <Reveal key={s.label} delay={0.1 * i}>
                  <div className="glass group rounded-3xl p-6 transition hover:border-accent/40">
                    <p className="font-display text-5xl font-semibold text-gradient">
                      <Counter to={s.value} suffix={s.suffix} />
                    </p>
                    <p className="mt-2 text-sm text-mute">{s.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.2}>
              <div className="mt-10 flex flex-wrap gap-2">
                {strengths.map((s) => (
                  <span key={s} className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm text-fg/80">
                    <Sparkles className="h-3.5 w-3.5 text-accent-2" /> {s}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── Experience ───────────────────────── */

export function Experience() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  const h = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  return (
    <section id="experience" className="relative px-4 py-28 md:px-8 md:py-40">
      <div className="mx-auto max-w-7xl">
        <SectionTitle index="02" kicker="Experience" title="Where I've been building." />
        <div ref={ref} className="relative">
          <div className="absolute bottom-0 left-[11px] top-0 w-px bg-line md:left-1/2" />
          <motion.div style={{ scaleY: h }} className="absolute bottom-0 left-[11px] top-0 w-px origin-top bg-gradient-to-b from-accent to-accent-2 md:left-1/2" />

          <div className="space-y-16 md:space-y-24">
            {experience.map((e, i) => (
              <div key={e.company} className={`relative grid gap-6 pl-12 md:grid-cols-2 md:gap-20 md:pl-0`}>
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: '-120px' }}
                  transition={{ duration: 0.6, ease }}
                  className="absolute left-0 top-2 flex h-6 w-6 items-center justify-center rounded-full border border-accent/60 bg-ink md:left-1/2 md:-translate-x-1/2"
                >
                  <span className={`h-2 w-2 rounded-full ${e.current ? 'animate-pulse bg-emerald-400' : 'bg-accent-2'}`} />
                </motion.span>

                <Reveal className={i % 2 ? 'md:order-2' : 'md:text-right'}>
                  <p className="font-display text-sm uppercase tracking-[0.25em] text-accent-2">{e.period}</p>
                  <p className="mt-2 text-sm text-mute">{e.place}</p>
                </Reveal>

                <Reveal delay={0.1} className={i % 2 ? 'md:order-1 md:text-right' : ''}>
                  <div className="glass group rounded-3xl p-7 transition duration-500 hover:-translate-y-1 hover:border-accent/40">
                    <div className={`flex flex-wrap items-center gap-4 ${i % 2 ? 'md:flex-row-reverse' : ''}`}>
                      <a
                        href={e.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex h-14 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-1.5 shadow-lg shadow-black/10 ring-1 ring-line transition duration-500 group-hover:scale-105"
                      >
                        <img src={e.logo} alt={`${e.company} logo`} className="max-h-full max-w-full rounded-lg object-contain" loading="lazy" />
                      </a>
                      <h3 className="font-display text-2xl font-semibold md:text-3xl">{e.company}</h3>
                      {e.current && <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">Current</span>}
                    </div>
                    <p className="mt-1 text-fg/70">{e.role}</p>
                    <p className="mt-4 leading-relaxed text-mute">{e.text}</p>
                    <div className={`mt-5 flex flex-wrap gap-2 ${i % 2 ? 'md:justify-end' : ''}`}>
                      {e.tags.map((t) => (
                        <span key={t} className="rounded-full bg-fg/5 px-3 py-1 text-xs text-fg/70">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── Projects ───────────────────────── */

function TiltCard({ p, i, big }: { p: Project; i: number; big?: boolean }) {
  const rx = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 })
  const ry = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 })
  const gx = useMotionValue(50)
  const gy = useMotionValue(50)
  const glow = useTransform([gx, gy], ([x, y]) => `radial-gradient(500px circle at ${x}% ${y}%, rgba(34,211,238,0.14), transparent 50%)`)

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, delay: (i % 2) * 0.12, ease }}
      className={`[perspective:1200px] ${big ? 'md:col-span-2' : ''}`}
    >
      <motion.div
        style={{ rotateX: rx, rotateY: ry }}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect()
          const px = (e.clientX - r.left) / r.width
          const py = (e.clientY - r.top) / r.height
          ry.set((px - 0.5) * 8)
          rx.set(-(py - 0.5) * 8)
          gx.set(px * 100)
          gy.set(py * 100)
        }}
        onMouseLeave={() => {
          rx.set(0)
          ry.set(0)
        }}
        className={`glass group relative h-full overflow-hidden rounded-[2rem] p-3 ${big ? 'md:grid md:grid-cols-[1.4fr_1fr] md:gap-2' : ''}`}
      >
        <motion.div className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: glow }} />
        <a href={p.live} target="_blank" rel="noreferrer" data-cursor className="relative block overflow-hidden rounded-[1.5rem] bg-ink-2">
          <div className="flex items-center gap-1.5 border-b border-line px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
            <span className="ml-3 truncate text-xs text-mute">{p.live.replace('https://', '')}</span>
          </div>
          <div className={`relative overflow-hidden ${big ? 'aspect-[16/10]' : 'aspect-[16/10]'}`}>
            <img src={p.image} alt={`${p.title} screenshot`} loading="lazy" className="shot h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-ink/50 opacity-0 backdrop-blur-[2px] transition duration-500 group-hover:opacity-100">
              <span className="flex h-24 w-24 scale-50 items-center justify-center rounded-full bg-fg text-sm font-semibold text-ink transition duration-500 group-hover:scale-100">
                Visit <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </a>

        <div className={`relative flex flex-col p-5 ${big ? 'md:justify-center md:p-8' : ''}`}>
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs uppercase tracking-[0.25em] text-accent-2">{p.tagline}</p>
            <span className="font-display text-sm text-mute">{String(i + 1).padStart(2, '0')}</span>
          </div>
          <h3 className={`mt-3 font-display font-semibold tracking-tight ${big ? 'text-3xl md:text-5xl' : 'text-2xl md:text-3xl'}`}>{p.title}</h3>
          <p className="mt-3 leading-relaxed text-mute">{p.description}</p>
          {p.note && <p className="mt-3 rounded-xl bg-fg/5 px-3 py-2 font-mono text-xs text-fg/70">{p.note}</p>}
          <div className="mt-5 flex flex-wrap gap-2">
            {p.stack.map((s) => (
              <span key={s} className="rounded-full border border-line px-3 py-1 text-xs text-fg/70">
                {s}
              </span>
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <a href={p.live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-fg px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-accent-2">
              Live demo <ArrowUpRight className="h-4 w-4" />
            </a>
            {p.repo ? (
              <a href={p.repo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-line px-5 py-2.5 text-sm transition hover:border-fg/40">
                <GithubIcon className="h-4 w-4" /> Code
              </a>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-5 py-2.5 text-sm text-mute" title="Team repository — private">
                <Lock className="h-3.5 w-3.5" /> Private repo
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </motion.article>
  )
}

const filters = ['All', 'React', 'Vue'] as const

export function Projects() {
  const [f, setF] = useState<(typeof filters)[number]>('All')
  const list = useMemo(() => projects.filter((p) => f === 'All' || p.category === f), [f])

  return (
    <section id="work" className="relative px-4 py-28 md:px-8 md:py-40">
      <div className="pointer-events-none absolute left-1/2 top-40 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionTitle index="03" kicker="Selected work" title="Things I've shipped." />
          <Reveal className="mb-14 md:mb-20">
            <div className="glass inline-flex rounded-full p-1">
              {filters.map((x) => (
                <button key={x} onClick={() => setF(x)} className="relative rounded-full px-5 py-2 text-sm">
                  {f === x && <motion.span layoutId="pill" className="absolute inset-0 rounded-full bg-fg" transition={{ type: 'spring', stiffness: 350, damping: 30 }} />}
                  <span className={`relative transition-colors ${f === x ? 'text-ink' : 'text-fg/70'}`}>{x}</span>
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <motion.div layout className="grid gap-6 md:grid-cols-2">
          {list.map((p, i) => (
            <TiltCard key={p.title} p={p} i={i} big={f === 'All' && (i === 0 || (i === list.length - 1 && list.length % 2 === 0))} />
          ))}
        </motion.div>

        <Reveal className="mt-16 text-center">
          <Magnetic>
            <a href={profile.github + '?tab=repositories'} target="_blank" rel="noreferrer" className="glass inline-flex items-center gap-2 rounded-full px-7 py-4 transition hover:border-fg/30">
              <GithubIcon /> Explore all repositories <ArrowUpRight className="h-4 w-4" />
            </a>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  )
}

/* ───────────────────────── Skills ───────────────────────── */

export function TechIcon({ tech, className = 'h-6 w-6' }: { tech: Tech; className?: string }) {
  if (!tech.icon) return <span className={`${className} rounded-md bg-gradient-to-br from-accent to-accent-2`} />
  return <img src={tech.icon} alt="" loading="lazy" className={`${className} object-contain ${tech.invert ? 'dark:invert' : ''}`} />
}

function MarqueeRow({ items, reverse }: { items: Tech[]; reverse?: boolean }) {
  const doubled = [...items, ...items]
  return (
    <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
      <div className={`flex shrink-0 gap-4 pr-4 ${reverse ? 'marquee-rev' : 'marquee'}`}>
        {doubled.map((t, i) => (
          <span key={i} className="flex items-center whitespace-nowrap font-display text-4xl font-semibold md:text-6xl">
            <TechIcon tech={t} className="mr-4 h-9 w-9 md:h-12 md:w-12" />
            <span className={i % 2 ? 'text-outline' : 'text-fg/90'}>{t.name}</span>
            <span className="mx-6 text-accent-2">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export function Skills() {
  return (
    <section id="skills" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionTitle index="04" kicker="Toolbox" title="The stack I think in." />
      </div>
      <div className="-rotate-2 space-y-4 py-6">
        <MarqueeRow items={marquee.slice(0, 8)} />
        <MarqueeRow items={marquee.slice(8)} reverse />
      </div>
      <div className="mx-auto mt-20 grid max-w-7xl gap-4 px-4 sm:grid-cols-2 md:px-8 lg:grid-cols-4">
        {skillGroups.map((g, gi) => (
          <Reveal key={g.title} delay={gi * 0.08}>
            <div className="glass h-full rounded-3xl p-6 transition duration-500 hover:-translate-y-1 hover:border-accent/40">
              <p className="font-display text-sm uppercase tracking-[0.25em] text-accent-2">{g.title}</p>
              <ul className="mt-5 space-y-3">
                {g.items.map((s, si) => (
                  <motion.li
                    key={s.name}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + si * 0.06, ease }}
                    className="group/item flex items-center gap-3 text-fg/85"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-ink/60 transition group-hover/item:-rotate-6 group-hover/item:scale-110 group-hover/item:border-accent/40">
                      <TechIcon tech={s} className="h-5 w-5" />
                    </span>
                    {s.name}
                  </motion.li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ───────────────────────── Education ───────────────────────── */

export function Education() {
  return (
    <section id="education" className="relative px-4 py-28 md:px-8 md:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionTitle index="05" kicker="Education" title="Always learning." />
        <div className="divide-y divide-line border-y border-line">
          {education.map((e, i) => (
            <Reveal key={e.title} delay={i * 0.05}>
              <div className="group relative flex flex-col gap-2 overflow-hidden py-8 md:flex-row md:items-center md:justify-between">
                <span className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-accent/10 to-transparent transition-transform duration-700 group-hover:scale-x-100" />
                <div className="relative flex items-baseline gap-6">
                  <span className="font-display text-sm text-mute">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="font-display text-2xl font-semibold transition-transform duration-500 group-hover:translate-x-3 md:text-4xl">{e.title}</h3>
                </div>
                <div className="relative flex items-center gap-6 pl-12 md:pl-0">
                  <span className="text-fg/70">{e.school}</span>
                  <span className="text-sm text-accent-2">{e.period}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 flex flex-wrap items-center gap-3">
          <span className="text-sm uppercase tracking-[0.25em] text-mute">I speak</span>
          {languages.map((l) => (
            <span key={l} className="glass rounded-full px-4 py-2 text-sm">
              {l}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

/* ───────────────────────── Contact ───────────────────────── */

export function Contact() {
  const contact = useContact()
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <section id="contact" className="relative overflow-hidden px-4 pb-10 pt-28 md:px-8 md:pt-40">
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-accent/20 blur-[160px]" />
      <div className="relative mx-auto max-w-7xl">
        <Reveal>
          <p className="mb-6 text-sm uppercase tracking-[0.3em] text-mute">
            <span className="font-display text-accent-2">06</span> — Contact
          </p>
        </Reveal>
        <h2 className="font-display text-[13vw] font-bold leading-[0.9] tracking-[-0.04em] md:text-[9rem]">
          <SplitText text="Let's build" />
          <br />
          <SplitText text="something great." className="text-gradient" delay={0.15} />
        </h2>

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          <Reveal>
            <button onClick={copy} className="glass group flex w-full items-center justify-between rounded-3xl p-6 text-left transition hover:border-accent/40">
              <span>
                <span className="flex items-center gap-2 text-sm text-mute">
                  <Mail className="h-4 w-4" /> Email
                </span>
                <span className="mt-2 block break-all font-display text-lg md:text-xl">{profile.email}</span>
              </span>
              {copied ? <Check className="h-5 w-5 shrink-0 text-emerald-400" /> : <Copy className="h-5 w-5 shrink-0 text-mute transition group-hover:text-fg" />}
            </button>
          </Reveal>
          <Reveal delay={0.08}>
            <a href={profile.phoneHref} className="glass group flex items-center justify-between rounded-3xl p-6 transition hover:border-accent/40">
              <span>
                <span className="flex items-center gap-2 text-sm text-mute">
                  <Phone className="h-4 w-4" /> Phone
                </span>
                <span className="mt-2 block font-display text-lg md:text-xl">{profile.phone}</span>
              </span>
              <ArrowUpRight className="h-5 w-5 text-mute transition group-hover:rotate-45 group-hover:text-fg" />
            </a>
          </Reveal>
          <Reveal delay={0.16}>
            <a href={profile.github} target="_blank" rel="noreferrer" className="glass group flex items-center justify-between rounded-3xl p-6 transition hover:border-accent/40">
              <span>
                <span className="flex items-center gap-2 text-sm text-mute">
                  <GithubIcon className="h-4 w-4" /> GitHub
                </span>
                <span className="mt-2 block font-display text-lg md:text-xl">@{profile.githubHandle}</span>
              </span>
              <ArrowUpRight className="h-5 w-5 text-mute transition group-hover:rotate-45 group-hover:text-fg" />
            </a>
          </Reveal>
        </div>

        <Reveal className="mt-14 flex justify-center">
          <Magnetic strength={0.5}>
            <button
              onClick={() => contact.open('Just saying hi')}
              className="group relative flex h-40 w-40 flex-col items-center justify-center gap-1 rounded-full bg-gradient-to-br from-accent to-accent-2 text-center font-display text-lg font-semibold text-white shadow-2xl shadow-accent/40 transition-transform hover:scale-105 md:h-48 md:w-48"
            >
              <span className="absolute inset-0 animate-ping rounded-full bg-accent/30 [animation-duration:2.5s]" />
              <MessageSquare className="relative h-6 w-6 transition-transform group-hover:-rotate-12" />
              <span className="relative">Say hello</span>
            </button>
          </Magnetic>
        </Reveal>

        <footer className="mt-28 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 text-sm text-mute md:flex-row">
          <span>© {new Date().getFullYear()} {profile.name}. Crafted with React & Framer Motion.</span>
          <span>{profile.location}</span>
          <a href="#top" className="transition hover:text-fg">
            Back to top ↑
          </a>
        </footer>
      </div>
    </section>
  )
}
