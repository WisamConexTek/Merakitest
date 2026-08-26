'use client'

import { Reveal } from './primitives'

/* ═══════════════════════════════════════════════════════════
   LEGAL PAGE — shared layout for /privacy and /terms

   Each page passes a title, an eyebrow, a "last updated" date
   and an array of { heading, content } sections. The component
   handles the header, the numbered sections, and the markdown-
   like rendering of the content strings.

   Content strings support a small subset of markdown:
   - **bold** — rendered as <strong>
   - Lines starting with "- " — rendered as <li> inside a <ul>
   - Empty lines — rendered as paragraph breaks
   ═══════════════════════════════════════════════════════════ */

type LegalSection = {
  heading: string
  content: string
}

function renderContent(raw: string) {
  const blocks = raw.split('\n\n')

  return blocks.map((block, bi) => {
    const trimmed = block.trim()

    /* List block: every line starts with "- " */
    const lines = trimmed.split('\n')
    const isList = lines.every((l) => l.trim().startsWith('- ') || l.trim() === '')

    if (isList) {
      return (
        <ul key={bi} className="my-4 flex flex-col gap-2.5 pl-1">
          {lines
            .filter((l) => l.trim().startsWith('- '))
            .map((l, li) => (
              <li
                key={li}
                className="flex items-start gap-3 text-[15px] leading-relaxed text-graphite-2"
              >
                <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-violet/40" />
                <span dangerouslySetInnerHTML={{ __html: bold(l.trim().slice(2)) }} />
              </li>
            ))}
        </ul>
      )
    }

    /* Plain paragraph */
    return (
      <p
        key={bi}
        className="mt-4 text-[15px] leading-relaxed text-graphite-2 sm:text-base"
        dangerouslySetInnerHTML={{ __html: bold(trimmed) }}
      />
    )
  })
}

/** Replace **text** with <strong> tags */
function bold(s: string): string {
  return s.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-graphite">$1</strong>')
}

export function LegalPage({
  title,
  eyebrow,
  lastUpdated,
  sections,
}: {
  title: string
  eyebrow: string
  lastUpdated: string
  sections: LegalSection[]
}) {
  return (
    <>
      {/* ── Header ── */}
      <section className="relative overflow-hidden bg-paper pb-14 pt-32 sm:pb-20 sm:pt-40">
        <div
          className="pointer-events-none absolute -right-[12%] -top-[30%] size-[760px] rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(91,67,249,0.09) 0%, rgba(72,231,255,0.045) 45%, rgba(244,245,250,0) 70%)',
          }}
        />

        <div className="relative mx-auto max-w-[1500px] px-5 sm:px-8">
          <Reveal>
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-mono-ui text-[13px] text-graphite-3">01</span>
              <span className="h-px w-8 bg-graphite/20" />
              <span className="font-mono-ui text-[11px] uppercase tracking-[0.2em] text-graphite-3">
                {eyebrow}
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 className="font-display-xl mt-8 max-w-4xl text-[clamp(2.4rem,6.4vw,4.8rem)] text-graphite">
              {title}
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="font-mono-ui mt-6 text-[12px] uppercase tracking-[0.16em] text-graphite-3">
              Last updated: {lastUpdated}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Body ── */}
      <section className="relative bg-paper pb-24 sm:pb-32">
        <div className="relative mx-auto max-w-[900px] px-5 sm:px-8">
          {sections.map((section, i) => (
            <Reveal key={section.heading} delay={Math.min(i, 3) * 0.04}>
              <div className="border-t border-graphite/8 py-10 first:border-t-0 first:pt-0">
                <div className="flex items-start gap-5">
                  <span className="font-mono-ui mt-1 shrink-0 text-[13px] tracking-[0.14em] text-violet">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h2 className="font-display text-[1.3rem] text-graphite sm:text-[1.5rem]">
                      {section.heading}
                    </h2>
                    <div className="mt-4">{renderContent(section.content)}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
