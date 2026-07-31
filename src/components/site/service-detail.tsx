'use client'

import Link from 'next/link'
import {
  ArrowUpRight,
  ArrowRight,
  Layers,
  Server,
  Network,
  ShieldCheck,
  Radar,
  HardDrive,
  Workflow,
  LifeBuoy,
} from 'lucide-react'
import {
  SERVICES_DATA,
  SERVICE_CATEGORY_MAP,
  CATEGORY_LABELS,
  type ServiceDetail,
} from '@/lib/services-data'
import { SiteShell } from './shell'
import { ContactCta } from './differentiators'
import { Reveal, Readout } from './primitives'
import { ServiceTile } from './services-section'
import { slab, LAYER_SOLID, LAYER_ON_LIGHT, LAYER_NAME, LAYER_LABEL_ON_SOLID } from './iso'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

/* ═══════════════════════════════════════════════════════════
   SERVICE DETAIL — /services/[slug]

   Ordered the way somebody evaluating a supplier actually reads:
   what it is, what you get, why it is worth having, how it runs,
   what it looked like when we did it, and finally the questions
   they were going to ask anyway.

   Every page carries its stack layer in the masthead, so a visitor
   who arrived from a search result rather than from the homepage
   still meets the four-layer model.
   ═══════════════════════════════════════════════════════════ */

const ICON_MAP: Record<string, typeof Layers> = {
  Layers,
  Server,
  Network,
  ShieldCheck,
  Radar,
  HardDrive,
  Workflow,
  LifeBuoy,
}

const MASTHEAD_SLAB = slab({ w: 210, d: 210, t: 20 })

export function ServiceDetailView({ service }: { service: ServiceDetail }) {
  const Icon = ICON_MAP[service.iconName] ?? Layers
  /* Filled geometry uses the true brand colour; anything you have to READ
     uses the light-ground variant. */
  const fill = LAYER_SOLID[service.layer]
  const color = LAYER_ON_LIGHT[service.layer]
  const category = SERVICE_CATEGORY_MAP[service.slug]
  const others = SERVICES_DATA.filter((s) => s.slug !== service.slug).slice(0, 3)

  return (
    <SiteShell>
      {/* ── Masthead ── */}
      <section className="relative overflow-hidden bg-paper pb-16 pt-32 sm:pb-24 sm:pt-40">
                <div
          className="pointer-events-none absolute -right-24 top-4 size-[540px] rounded-full blur-[150px]"
          style={{ background: `radial-gradient(circle, ${fill}1f 0%, rgba(244,245,250,0) 70%)` }}
        />

        <div className="relative mx-auto max-w-[1500px] px-5 sm:px-8">
          <nav
            aria-label="Breadcrumb"
            className="font-mono-ui flex items-center gap-2 text-[12px] text-graphite-3"
          >
            <Link href="/services" className="transition-colors duration-400 hover:text-violet">
              Services
            </Link>
            <span aria-hidden>/</span>
            <span className="text-graphite-2">{service.title}</span>
          </nav>

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="flex size-12 shrink-0 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: `${fill}18`, color }}
                >
                  <Icon className="size-5" />
                </span>
                <span
                  className="rounded-full px-3 py-1.5"
                  style={{ backgroundColor: `${fill}18` }}
                >
                  <span
                    className="font-mono-ui text-[10px] tracking-[0.16em]"
                    style={{ color }}
                  >
                    {service.layer} · {LAYER_NAME[service.layer]}
                  </span>
                </span>
                <span className="font-mono-ui text-[11px] uppercase tracking-[0.18em] text-graphite-3">{CATEGORY_LABELS[category]}</span>
              </div>

              <h1 className="font-display-xl mt-8 text-[clamp(2.2rem,5.6vw,4.2rem)] text-graphite">
                {service.title}
              </h1>
              <p className="mt-5 text-lg text-violet sm:text-xl">{service.subtitle}</p>
              <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-graphite-2">
                {service.heroDescription}
              </p>
            </div>

            {/* The layer this service works on, drawn */}
            <Reveal delay={0.1}>
              <svg viewBox="-200 -140 400 280" className="mx-auto w-full max-w-[340px]" aria-hidden>
                <path d={MASTHEAD_SLAB.left} fill={fill} opacity={0.5} />
                <path d={MASTHEAD_SLAB.right} fill={fill} opacity={0.3} />
                <path d={MASTHEAD_SLAB.top} fill={fill} opacity={0.9} />
                <path
                  d={MASTHEAD_SLAB.silhouette}
                  fill="none"
                  stroke={fill}
                  strokeOpacity={0.7}
                  strokeWidth={1.5}
                />
                <text
                  x={0}
                  y={8}
                  textAnchor="middle"
                  className="font-mono-ui"
                  fontSize={26}
                  fill={LAYER_LABEL_ON_SOLID[service.layer]}
                  fillOpacity={0.8}
                  letterSpacing="0.14em"
                >
                  {service.layer}
                </text>
              </svg>
            </Reveal>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
            {service.stats.map((stat) => (
              <Readout key={stat.label} value={stat.value} label={stat.label} tone="light" />
            ))}
          </div>
        </div>
      </section>

      {/* ── What you get ── */}
      <section className="relative bg-paper py-24 sm:py-32">
        <div className="relative mx-auto max-w-[1500px] px-5 sm:px-8">
          <Reveal>
            <span className="font-mono-ui text-[11px] uppercase tracking-[0.2em] text-graphite-3">What you get</span>
          </Reveal>
          <h2 className="font-display-xl mt-8 max-w-2xl text-[clamp(1.9rem,4.4vw,3rem)] text-graphite">
            Inside the service
          </h2>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {service.features.map((feature, i) => (
              <Reveal key={feature.title} delay={i * 0.05}>
                <div className="surface flex h-full flex-col p-7 sm:p-8">
                  <span
                    className="font-mono-ui self-start rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.14em]"
                    style={{ backgroundColor: `${fill}18`, color }}
                  >
                    {feature.chip}
                  </span>
                  <h3 className="font-display mt-6 text-[1.2rem] leading-snug text-graphite sm:text-[1.35rem]">
                    {feature.title}
                  </h3>
                  <p className="mt-4 text-[15px] leading-relaxed text-graphite-2">{feature.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why it matters ── */}
      <section className="relative bg-paper-3 py-24 sm:py-32">
        

        <div className="relative mx-auto max-w-[1500px] px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-16">
            <div>
              <Reveal>
                <span className="font-mono-ui text-[11px] uppercase tracking-[0.2em] text-graphite-3">Why it matters</span>
              </Reveal>
              <h2 className="font-display-xl mt-8 text-[clamp(1.9rem,4.4vw,3rem)] text-graphite">
                What changes for you
              </h2>
            </div>

            <ul className="flex flex-col">
              {service.benefits.map((benefit, i) => (
                <Reveal key={benefit.title} delay={i * 0.06}>
                  <li className="grid grid-cols-[auto_1fr] gap-6 border-t border-graphite/10 py-8 sm:gap-9">
                    <span
                      className="font-mono-ui pt-1.5 text-[13px] tracking-[0.14em]"
                      style={{ color }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="font-display text-[1.2rem] leading-snug text-graphite sm:text-[1.35rem]">
                        {benefit.title}
                      </h3>
                      <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-graphite-2 sm:text-base">
                        {benefit.description}
                      </p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── How it runs ── */}
      <section className="relative bg-paper-3 py-24 sm:py-32">
        <div
          className="iso-grid pointer-events-none absolute inset-0 opacity-60"
          style={{ ['--iso-line' as string]: 'rgba(30,30,155,0.07)' }}
        />
        <div className="relative mx-auto max-w-[1500px] px-5 sm:px-8">
          <Reveal>
            <span className="font-mono-ui text-[11px] uppercase tracking-[0.2em] text-graphite-3">How it runs</span>
          </Reveal>
          <h2 className="font-display-xl mt-8 max-w-2xl text-[clamp(1.9rem,4.4vw,3rem)] text-graphite">
            The engagement, step by step
          </h2>

          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {service.process.map((step, i) => (
              <Reveal key={step.step} delay={i * 0.06}>
                <li className="surface relative flex h-full flex-col overflow-hidden p-7">
                  {/* A rule across the top, standing in for the connector
                      between steps — a real line, not an arrow glyph */}
                  <span className="absolute inset-x-0 top-0 h-0.5" style={{ background: color }} />
                  <span className="font-display text-[2rem]" style={{ color }}>
                    {step.step}
                  </span>
                  <h3 className="font-display mt-5 text-[1.05rem] leading-snug text-graphite sm:text-[1.15rem]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-graphite-2">{step.description}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ── A worked example ── */}
      <section className="relative bg-paper py-24 sm:py-32">
        <div className="relative mx-auto max-w-[1500px] px-5 sm:px-8">
          <Reveal>
            <span className="font-mono-ui text-[11px] uppercase tracking-[0.2em] text-graphite-3">A worked example</span>
          </Reveal>
          <h2 className="font-display-xl mt-8 max-w-2xl text-[clamp(1.9rem,4.4vw,3rem)] text-graphite">
            What it looks like in practice
          </h2>

          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {(
              [
                { label: 'The problem', body: service.scenario.problem },
                { label: 'What we did', body: service.scenario.solution },
                { label: 'The result', body: service.scenario.result },
              ] as const
            ).map((block, i) => (
              <div key={block.label} className="surface p-7 sm:p-8">
                <div className="flex items-center gap-2.5">
                  <span
                    className="size-1.5 shrink-0"
                    style={{ background: i === 2 ? color : 'rgba(10,12,31,0.25)' }}
                  />
                  <span className="font-mono-ui text-[11px] uppercase tracking-[0.16em] text-graphite-3">
                    {block.label}
                  </span>
                </div>
                <p className="mt-5 text-[15px] leading-relaxed text-graphite-2 sm:text-base">{block.body}</p>
              </div>
            ))}
          </div>

          {/* These are illustrative composites, and the page says so rather
              than letting a reader take them for named case studies. */}
          <p className="font-mono-ui mt-6 text-[12px] text-graphite-3">
            Composite example drawn from typical engagements. No client is identified.
          </p>
        </div>
      </section>

      {/* ── Questions ── */}
      <section className="relative bg-paper-3 py-24 sm:py-32">
        <div className="relative mx-auto max-w-[1500px] px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-16">
            <div>
              <Reveal>
                <span className="font-mono-ui text-[11px] uppercase tracking-[0.2em] text-graphite-3">Questions</span>
              </Reveal>
              <h2 className="font-display mt-6 text-[clamp(1.8rem,4vw,3rem)] text-graphite">
                Before you ask
              </h2>
              <Reveal delay={0.1}>
                <Link
                  href="/contact"
                  className="group mt-8 inline-flex items-center gap-2 rounded-full border border-graphite/15 px-6 py-3.5 text-[15px] font-medium text-graphite transition-colors duration-500 hover:border-graphite/40"
                >
                  Ask us something else
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Reveal>
            </div>

            <Reveal delay={0.1}>
              <Accordion type="single" collapsible className="w-full">
                {service.faqs.map((faq, i) => (
                  <AccordionItem key={faq.question} value={`faq-${i}`} className="border-graphite/10">
                    <AccordionTrigger className="font-display text-start text-[1.05rem] text-graphite hover:no-underline sm:text-[1.15rem]">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-[15px] leading-relaxed text-graphite-2 sm:text-base">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Elsewhere on the stack ── */}
      <section className="relative bg-paper py-20 sm:py-24">
        <div className="relative mx-auto max-w-[1500px] px-5 sm:px-8">
          <div className="flex items-center gap-4">
            <span className="font-mono-ui text-[11px] uppercase tracking-[0.2em] text-graphite-3">
              Elsewhere on the stack
            </span>
            <span className="h-px flex-1 bg-graphite/12" />
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((other, i) => (
              <ServiceTile key={other.slug} service={other} index={i} />
            ))}
          </div>
        </div>
      </section>

      <ContactCta />
    </SiteShell>
  )
}
