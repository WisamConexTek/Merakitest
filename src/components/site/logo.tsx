'use client'

import React from 'react'

/* ═══════════════════════════════════════════════════════════
   THE MARK

   Traced off public/Meraki-IT-Logo-01.png by reading its pixels,
   not redrawn by eye — and the trace turned out to be exact
   quarters, which is why every number below is round.

   The mark is a folded ribbon "M" on a 132 × 116 field:

     x:  0 ── 33 ── 66 ── 99 ── 132        (quarters)
     top edge   zigzags  20 ▲0 ▼20 ▲0 ▼20
     bottom edge zigzags 96 ▼116 ▲96 ▼116 ▲96

   One crease runs under the top face, from each outer corner down
   to a point at dead centre (66, 58). Above it the ribbon shows its
   cyan top face; below it the ribbon has folded, and the two halves
   show peri on the left and violet on the right.

   The two triangles at the bottom are where the halves cross in
   front of one another — the left one carries the right half's
   violet, the right one carries the left half's peri. That swap is
   the whole reason the mark reads as three-dimensional, so keep it
   if you ever touch these paths.

   FACES is exported because the hero animates the faces
   individually; anything that just needs the logo should use
   <MerakiMark> and leave the geometry alone.
   ═══════════════════════════════════════════════════════════ */

export const MARK_VIEWBOX = '0 0 132 116'

export const MARK_COLORS = {
  cyan: '#48E7FF',
  peri: '#717FFF',
  violet: '#5B43F9',
  indigo: '#1E1E9B',
  steel: '#A7A9AC',
} as const

export const FACES = [
  /* Top face — the cyan plane, bounded above by the zigzag and below
     by the crease that meets at centre. */
  { id: 'top', d: 'M0 20 L33 0 L66 20 L99 0 L132 20 L66 58 Z', fill: MARK_COLORS.cyan },
  /* Left half, minus the notch the right half crosses in front of */
  { id: 'left', d: 'M0 20 L66 58 L66 96 L33 78 L33 116 L0 96 Z', fill: MARK_COLORS.peri },
  /* Right half, mirrored */
  { id: 'right', d: 'M132 20 L66 58 L66 96 L99 78 L99 116 L132 96 Z', fill: MARK_COLORS.violet },
  /* The crossings: each half showing through the other */
  { id: 'cross-left', d: 'M33 78 L66 96 L33 116 Z', fill: MARK_COLORS.violet },
  { id: 'cross-right', d: 'M99 78 L66 96 L99 116 Z', fill: MARK_COLORS.peri },
] as const

export function MerakiMark({
  className = 'size-9',
  title,
}: {
  className?: string
  title?: string
}) {
  return (
    <svg
      viewBox={MARK_VIEWBOX}
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {FACES.map((face) => (
        <path key={face.id} d={face.d} fill={face.fill} />
      ))}
    </svg>
  )
}

/* Full lockup: mark + wordmark. `tone` picks the wordmark colour —
   the mark itself never changes, because its three faces ARE the brand
   and a monochrome version of them would just be a grey scribble. */
export function MerakiLogo({
  className = 'h-9',
  tone = 'dark',
  showTagline = false,
}: {
  className?: string
  /* `dark` = sitting on the dark ground, so the wordmark is light */
  tone?: 'dark' | 'light'
  showTagline?: boolean
}) {
  const word = tone === 'dark' ? '#FFFFFF' : MARK_COLORS.indigo

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <MerakiMark className="h-full w-auto shrink-0" />
      <span className="flex flex-col justify-center leading-none">
        <span
          className="font-display text-[1.35em] leading-none tracking-[-0.035em]"
          style={{ color: word }}
        >
          Meraki<span style={{ color: MARK_COLORS.cyan }}>-</span>IT
        </span>
        {showTagline && (
          <span
            className="font-mono-ui mt-1.5 text-[0.42em] uppercase tracking-[0.16em] whitespace-nowrap"
            style={{ color: MARK_COLORS.steel }}
          >
            Information Technology Simplified
          </span>
        )}
      </span>
    </span>
  )
}
