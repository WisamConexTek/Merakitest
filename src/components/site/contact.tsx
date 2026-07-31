'use client'

import { useState } from 'react'
import { Mail, Phone, Linkedin, MapPin, Send, CheckCircle2, AlertCircle, type LucideIcon } from 'lucide-react'
import { COMPANY, LINKS, useLang } from '@/lib/i18n'
import { Reveal } from './primitives'
import { SERVICES_DATA } from '@/lib/services-data'
import { cn } from '@/lib/utils'

/* ═══════════════════════════════════════════════════════════
   CONTACT — /contact

   A real form with real validation states, plus the direct routes
   for anyone who would rather not fill one in. The "which layer"
   select is not decoration: it routes the enquiry and it teaches
   the stack model one last time on the way out.

   ── Note for whoever wires this up ──
   /api/contact currently validates and logs. It does not send
   mail. Until it does, the success state below is telling the
   visitor something that is not yet true end to end, so the
   inbox integration should land before this page goes live.
   ═══════════════════════════════════════════════════════════ */

type Channel = {
  title: string
  desc: string
  Icon: LucideIcon
  href: string
  value: string
  external?: boolean
}

const CHANNELS: Channel[] = [
  {
    title: 'Call',
    desc: 'Fastest route to an engineer',
    Icon: Phone,
    href: COMPANY.phoneHref,
    value: COMPANY.phoneDisplay,
  },
  {
    title: 'Email',
    desc: 'Send us the detail',
    Icon: Mail,
    href: COMPANY.emailHref,
    value: COMPANY.email,
  },
  {
    title: 'LinkedIn',
    desc: 'Company updates',
    Icon: Linkedin,
    href: LINKS.linkedin,
    value: 'Meraki-IT',
    external: true,
  },
  {
    title: 'Office',
    desc: 'Greensboro, North Carolina',
    Icon: MapPin,
    href: COMPANY.mapUrl,
    value: COMPANY.address,
    external: true,
  },
]

type Status = 'idle' | 'sending' | 'sent' | 'error'

const FIELD =
  'w-full rounded-xl border border-graphite/12 bg-paper px-4 py-3.5 text-[15px] text-graphite transition-colors duration-400 placeholder:text-graphite-3 focus:border-violet/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet'

const LABEL = 'font-mono-ui block text-[11px] uppercase tracking-[0.16em] text-graphite-3'

export function ContactSection() {
  const { t } = useLang()
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    setStatus('sending')
    setError('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          company: data.get('company'),
          topic: data.get('topic'),
          message: data.get('message'),
        }),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(body.error ?? 'Something went wrong. Please try again.')
      }

      setStatus('sent')
      form.reset()
    } catch (err) {
      /* Surfaced to the visitor rather than swallowed — a form that silently
         fails is worse than no form, because they think they have reached us. */
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <section className="relative bg-paper py-24 sm:py-32">
            <div className="relative mx-auto max-w-[1500px] px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          {/* Direct routes.

              No headline here: /contact already states it in its PageHeader,
              and repeating the same sentence two hundred pixels lower reads as
              a template that was never proof-read. */}
          <div>
            <Reveal>
              <span className="font-mono-ui text-[11px] uppercase tracking-[0.2em] text-graphite-3">Direct lines</span>
            </Reveal>
            <p className="mt-6 max-w-md text-[17px] leading-relaxed text-graphite-2">
              If a form is not how you want to start, any of these reaches us just as well.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {CHANNELS.map((channel, i) => (
                <Reveal key={channel.title} delay={0.12 + i * 0.05}>
                  <a
                    href={channel.href}
                    {...(channel.external
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    className="surface surface-lift group flex h-full flex-col p-6"
                  >
                    <channel.Icon className="size-5 text-violet" />
                    <span className="font-mono-ui mt-5 text-[11px] uppercase tracking-[0.16em] text-graphite-3">
                      {channel.title}
                    </span>
                    <span className="mt-2 text-[15px] leading-relaxed text-graphite">
                      {channel.value}
                    </span>
                    <span className="mt-2 text-[13px] text-graphite-3">{channel.desc}</span>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>

          {/* The form */}
          <Reveal delay={0.15}>
            <div className="surface p-7 sm:p-9">
              {status === 'sent' ? (
                <div
                  role="status"
                  className="flex min-h-[420px] flex-col items-center justify-center text-center"
                >
                  <span className="flex size-16 items-center justify-center rounded-full bg-violet/12 text-violet">
                    <CheckCircle2 className="size-6" />
                  </span>
                  <h3 className="font-display mt-7 text-[1.7rem] text-graphite">Message received</h3>
                  <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-graphite-2">
                    We will come back to you. If it is urgent, calling {COMPANY.phoneDisplay} is
                    faster than waiting on email.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="font-mono-ui mt-9 rounded-full border border-graphite/15 px-5 py-3 text-[11px] uppercase tracking-[0.16em] text-graphite-2 transition-colors duration-500 hover:border-graphite/40"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate={false}>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className={LABEL}>
                        Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        autoComplete="name"
                        className={cn(FIELD, 'mt-2')}
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className={LABEL}>
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        className={cn(FIELD, 'mt-2')}
                        placeholder="you@company.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="company" className={LABEL}>
                      Company <span className="normal-case tracking-normal">(optional)</span>
                    </label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      autoComplete="organization"
                      className={cn(FIELD, 'mt-2')}
                      placeholder="Where you work"
                    />
                  </div>

                  <div>
                    <label htmlFor="topic" className={LABEL}>
                      What is this about?
                    </label>
                    {/* Routes the enquiry, and teaches the stack model one last
                        time on the way out the door */}
                    <select id="topic" name="topic" className={cn(FIELD, 'mt-2')} defaultValue="">
                      <option value="">Not sure yet</option>
                      {SERVICES_DATA.map((service) => (
                        <option key={service.slug} value={service.slug}>
                          {service.layer} — {service.title}
                        </option>
                      ))}
                      <option value="other">Something else</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className={LABEL}>
                      The problem
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      className={cn(FIELD, 'mt-2 resize-y')}
                      placeholder="An ageing data centre, a network that keeps you up at night, an audit you have to pass…"
                    />
                  </div>

                  {status === 'error' && (
                    <p
                      role="alert"
                      className="flex items-start gap-2.5 border border-destructive/40 bg-destructive/10 p-3 text-xs leading-relaxed text-destructive"
                    >
                      <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="mt-2 inline-flex h-14 items-center justify-center gap-3 rounded-full bg-graphite px-8 text-[15px] font-medium text-white transition-colors duration-500 hover:bg-violet disabled:opacity-60"
                  >
                    {status === 'sending' ? 'Sending…' : t('contactCta')}
                    <Send className="size-4" />
                  </button>

                  <p className="font-mono-ui text-[11px] leading-relaxed text-graphite-3">
                    We use what you send here to answer you, and for nothing else.
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
