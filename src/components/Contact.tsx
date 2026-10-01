import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Check, Loader2, Mail, Send, X } from 'lucide-react'
import { createContext, useCallback, useContext, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { profile } from '../data'
import { ease } from './ui'

// FormSubmit relays the message to the inbox below; the first submission sends
// a one-time activation email to that address.
const ENDPOINT = `https://formsubmit.co/ajax/${profile.email}`

const topics = ['Job opportunity', 'Freelance project', 'Collaboration', 'Just saying hi'] as const

type Ctx = { open: (topic?: (typeof topics)[number]) => void }
const ContactCtx = createContext<Ctx>({ open: () => {} })
export const useContact = () => useContext(ContactCtx)

type Status = 'idle' | 'sending' | 'sent' | 'error'

export function ContactProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false)
  const [topic, setTopic] = useState<(typeof topics)[number]>(topics[0])
  const open = useCallback((t?: (typeof topics)[number]) => {
    if (t) setTopic(t)
    setOpen(true)
  }, [])

  return (
    <ContactCtx.Provider value={{ open }}>
      {children}
      <AnimatePresence>{isOpen && <ContactModal topic={topic} setTopic={setTopic} onClose={() => setOpen(false)} />}</AnimatePresence>
    </ContactCtx.Provider>
  )
}

const field =
  'w-full rounded-2xl border border-line bg-ink/60 px-4 py-3.5 text-fg placeholder:text-mute/70 outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/15'

function ContactModal({
  topic,
  setTopic,
  onClose,
}: {
  topic: (typeof topics)[number]
  setTopic: (t: (typeof topics)[number]) => void
  onClose: () => void
}) {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [touched, setTouched] = useState(false)
  const first = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const prev = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    first.current?.focus()
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', esc)
    return () => {
      document.documentElement.style.overflow = prev
      window.removeEventListener('keydown', esc)
    }
  }, [onClose])

  const errors = {
    name: form.name.trim().length < 2 ? 'Please tell me your name.' : '',
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? '' : 'Enter a valid email address.',
    message: form.message.trim().length < 10 ? 'A few more words, please (10+ characters).' : '',
  }
  const valid = !errors.name && !errors.email && !errors.message

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setTouched(true)
    if (!valid || status === 'sending') return
    if (new FormData(e.currentTarget).get('_honey')) return
    setStatus('sending')
    setError('')
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          topic,
          message: form.message,
          _subject: `Portfolio — ${topic} from ${form.name}`,
          _replyto: form.email,
          _template: 'table',
          _captcha: 'false',
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || String(data.success) !== 'true') throw new Error(data.message || 'The message could not be sent.')
      setStatus('sent')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The message could not be sent.')
      setStatus('error')
    }
  }

  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(`${topic} — ${form.name || 'Hello'}`)}&body=${encodeURIComponent(form.message)}`

  return (
    <motion.div
      className="fixed inset-0 z-[95] flex items-end justify-center p-0 sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-title"
      data-lenis-prevent
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.55, ease }}
        className="relative max-h-[92svh] w-full max-w-2xl overflow-y-auto rounded-t-[2rem] border border-line bg-ink-2 shadow-2xl shadow-black/50 sm:rounded-[2rem]"
      >
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-accent/25 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-accent-2/15 blur-[90px]" />

        <div className="relative p-6 sm:p-10">
          <button onClick={onClose} aria-label="Close" className="glass absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full transition hover:rotate-90">
            <X className="h-4 w-4" />
          </button>

          <AnimatePresence mode="wait">
            {status === 'sent' ? (
              <motion.div key="sent" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center py-12 text-center">
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }}
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-2 shadow-xl shadow-accent/40"
                >
                  <Check className="h-10 w-10 text-white" strokeWidth={3} />
                </motion.div>
                <h3 className="mt-8 font-display text-3xl font-semibold">Message sent!</h3>
                <p className="mt-3 max-w-sm text-mute">Thanks {form.name.split(' ')[0]} — I usually reply within a day or two at {form.email}.</p>
                <button onClick={onClose} className="mt-8 rounded-full bg-fg px-6 py-3 font-medium text-ink transition hover:opacity-90">
                  Back to portfolio
                </button>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={submit} noValidate exit={{ opacity: 0, y: -10 }}>
                <div className="flex items-center gap-3">
                  <img src="/img/smile.webp" alt="" className="h-12 w-12 rounded-full object-cover object-[50%_30%] ring-2 ring-accent/40" />
                  <div>
                    <p className="text-sm text-mute">Yassir Choujai</p>
                    <p className="flex items-center gap-1.5 text-xs text-emerald-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Usually replies within 48h
                    </p>
                  </div>
                </div>
                <h3 id="contact-title" className="mt-6 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                  Let's build <span className="text-gradient">something great.</span>
                </h3>
                <p className="mt-2 text-mute">Tell me a bit about your project or role — I'll get back to you by email.</p>

                <fieldset className="mt-7">
                  <legend className="mb-3 text-sm font-medium text-fg/80">What's this about?</legend>
                  <div className="flex flex-wrap gap-2">
                    {topics.map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setTopic(t)}
                        className={`relative rounded-full border px-4 py-2 text-sm transition ${topic === t ? 'border-transparent text-white' : 'border-line text-fg/75 hover:border-accent/50'}`}
                      >
                        {topic === t && <motion.span layoutId="topic" className="absolute inset-0 rounded-full bg-gradient-to-r from-accent to-accent-2" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
                        <span className="relative">{t}</span>
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-fg/80">Name</span>
                    <input ref={first} className={field} placeholder="Jane Doe" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    {touched && errors.name && <span className="mt-1.5 block text-xs text-red-500">{errors.name}</span>}
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-fg/80">Email</span>
                    <input className={field} type="email" placeholder="jane@company.com" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    {touched && errors.email && <span className="mt-1.5 block text-xs text-red-500">{errors.email}</span>}
                  </label>
                </div>
                <label className="mt-4 block">
                  <span className="mb-2 flex justify-between text-sm font-medium text-fg/80">
                    Message <span className="font-normal text-mute">{form.message.length}/2000</span>
                  </span>
                  <textarea
                    className={`${field} min-h-36 resize-y`}
                    maxLength={2000}
                    placeholder="Hi Yassir, we're building…"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                  {touched && errors.message && <span className="mt-1.5 block text-xs text-red-500">{errors.message}</span>}
                </label>
                <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

                {status === 'error' && (
                  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm">
                    <p className="text-red-500">{error}</p>
                    <a href={mailto} className="mt-2 inline-flex items-center gap-1 font-medium text-fg underline-offset-4 hover:underline">
                      Send it from your email app instead <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </motion.div>
                )}

                <div className="mt-7 flex flex-col-reverse items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <a href={`mailto:${profile.email}`} className="inline-flex items-center justify-center gap-2 text-sm text-mute transition hover:text-fg">
                    <Mail className="h-4 w-4" /> {profile.email}
                  </a>
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-2 px-7 py-4 font-medium text-white shadow-lg shadow-accent/30 transition hover:shadow-accent/50 disabled:opacity-70"
                  >
                    {status === 'sending' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                      </>
                    ) : (
                      <>
                        Send message <Send className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}
