'use client'

import { LAYER_SOLID, type LayerCode } from './iso'

/* ═══════════════════════════════════════════════════════════
   THE OBJECTS

   One built object per service, not one shape reused eight times
   with a different glyph dropped on top. That was the whole reason
   the cards looked flat next to the reference: there, every card
   carries a distinct, fully modelled thing that fills its frame.

   Everything here is assembled from ONE primitive — an isometric
   box — so eight different objects still read as one family, the
   way a set of product renders shot under the same light does.

   ── The light ──
   Upper-left, and it never moves. Top face full strength, the
   left-front face at 72%, the right-front face at 48%. Those three
   numbers are the entire material model, and keeping them constant
   across every box in every object is what makes the set look
   rendered rather than drawn.

   ── Paint order ──
   Isometric has no z-buffer, so order IS depth. Boxes are sorted
   back-to-front by (x + z), with elevation breaking ties so a box
   stacked on another lands on top of it. Compositions are kept
   simple enough that this ordering is always correct.
   ═══════════════════════════════════════════════════════════ */

const COS = Math.cos(Math.PI / 6)
const SIN = Math.sin(Math.PI / 6)

function pt(x: number, z: number, y: number): [number, number] {
  return [(x - z) * COS, (x + z) * SIN - y]
}

function poly(points: [number, number][]): string {
  return `M${points.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join('L')}Z`
}

type Box = {
  x: number
  z: number
  /* elevation of the box's underside */
  e: number
  w: number
  d: number
  h: number
  /* Horizontal grooves cut into the left-front face. This is the single
     thing that separates "a box" from "a rack of servers" at card size —
     the reference's objects read instantly because they carry surface
     detail, not because they have more polygons. */
  slots?: number
  /* A recessed panel on the left-front face — a screen, a display */
  screen?: boolean
}

function faces(b: Box) {
  const x0 = b.x
  const x1 = b.x + b.w
  const z0 = b.z
  const z1 = b.z + b.d
  const y0 = b.e
  const y1 = b.e + b.h

  return {
    top: poly([pt(x0, z0, y1), pt(x1, z0, y1), pt(x1, z1, y1), pt(x0, z1, y1)]),
    /* The face at max z — reads on the viewer's left */
    left: poly([pt(x0, z1, y1), pt(x1, z1, y1), pt(x1, z1, y0), pt(x0, z1, y0)]),
    /* The face at max x — reads on the viewer's right */
    right: poly([pt(x1, z0, y1), pt(x1, z1, y1), pt(x1, z1, y0), pt(x1, z0, y0)]),
  }
}

/* Detail drawn ON the left-front face, in that face's own plane so it sits
   flush instead of floating. Insets are proportional, so a groove looks the
   same on a tall rack and a thin platter. */
function faceDetail(b: Box): string[] {
  const out: string[] = []
  const x0 = b.x
  const x1 = b.x + b.w
  const z = b.z + b.d
  const inset = Math.min(3, b.w * 0.12)

  if (b.screen) {
    const px = 3.5
    const py = b.h * 0.16
    out.push(
      poly([
        pt(x0 + px, z, b.e + b.h - py),
        pt(x1 - px, z, b.e + b.h - py),
        pt(x1 - px, z, b.e + py),
        pt(x0 + px, z, b.e + py),
      ]),
    )
    return out
  }

  const n = b.slots ?? 0
  if (!n) return out
  const pitch = b.h / (n + 1)
  const thick = Math.min(2.6, pitch * 0.42)
  for (let i = 1; i <= n; i++) {
    const y = b.e + pitch * i
    out.push(
      poly([
        pt(x0 + inset, z, y + thick),
        pt(x1 - inset, z, y + thick),
        pt(x1 - inset, z, y),
        pt(x0 + inset, z, y),
      ]),
    )
  }
  return out
}

/* ── The eight compositions ──
   Architectural rather than literal: this is an infrastructure brand, and a
   drawn laptop or headset would sit outside the language the rest of the
   site is built in. Each one is a small structure that says what the
   service does — many things becoming one, racks in a row, a watchtower. */

const PLINTH: Box = { x: -44, z: -44, e: -8, w: 88, d: 88, h: 8 }

const OBJECTS: Record<string, Box[]> = {
  /* Scattered parts collapsing into a single tower */
  'it-infrastructure-consolidation': [
    PLINTH,
    { x: -36, z: -36, e: 0, w: 22, d: 22, h: 16 },
    { x: 14, z: -36, e: 0, w: 22, d: 22, h: 26 },
    { x: -36, z: 14, e: 0, w: 22, d: 22, h: 22 },
    { x: 14, z: 14, e: 0, w: 22, d: 22, h: 12 },
    { x: -15, z: -15, e: 0, w: 30, d: 30, h: 64, slots: 6 },
  ],

  /* Three racks on a floor */
  'data-center-transformation': [
    PLINTH,
    { x: -36, z: -26, e: 0, w: 24, d: 52, h: 54, slots: 5 },
    { x: -8, z: -26, e: 0, w: 24, d: 52, h: 72, slots: 7 },
    { x: 20, z: -26, e: 0, w: 24, d: 52, h: 60, slots: 6 },
  ],

  /* A hub with four spurs */
  'network-services': [
    PLINTH,
    { x: -38, z: -9, e: 0, w: 26, d: 18, h: 18 },
    { x: -9, z: -38, e: 0, w: 18, d: 26, h: 18 },
    { x: -9, z: 20, e: 0, w: 18, d: 26, h: 18 },
    { x: 20, z: -9, e: 0, w: 26, d: 18, h: 18 },
    { x: -16, z: -16, e: 0, w: 32, d: 32, h: 46, slots: 4 },
  ],

  /* A wall, and the thing standing behind it */
  'cyber-security': [
    PLINTH,
    { x: -17, z: -34, e: 0, w: 34, d: 34, h: 36, slots: 3 },
    { x: -38, z: 16, e: 0, w: 76, d: 9, h: 66 },
  ],

  /* A watchtower */
  'managed-security': [
    PLINTH,
    { x: -12, z: -12, e: 0, w: 24, d: 24, h: 52, slots: 4 },
    { x: -34, z: -34, e: 52, w: 68, d: 68, h: 10 },
    { x: -10, z: -10, e: 62, w: 20, d: 20, h: 16 },
  ],

  /* A platter stack, with the copy that lives somewhere else */
  'backup-and-disaster-recovery': [
    PLINTH,
    { x: -33, z: -33, e: 0, w: 64, d: 64, h: 11 },
    { x: -33, z: -33, e: 21, w: 64, d: 64, h: 11 },
    { x: -33, z: -33, e: 42, w: 64, d: 64, h: 11 },
    { x: 20, z: 20, e: 0, w: 22, d: 22, h: 11 },
  ],

  /* Four suppliers interlocking, one coordinator on top */
  'service-integration-management': [
    PLINTH,
    { x: -40, z: -13, e: 16, w: 30, d: 26, h: 13 },
    { x: -13, z: -40, e: 16, w: 26, d: 30, h: 13 },
    { x: -13, z: 10, e: 16, w: 26, d: 30, h: 13 },
    { x: 10, z: -13, e: 16, w: 30, d: 26, h: 13 },
    { x: -14, z: -14, e: 0, w: 28, d: 28, h: 62, slots: 5 },
  ],

  /* A desk, a screen, and someone's coffee */
  'helpdesk-support': [
    PLINTH,
    { x: -38, z: -19, e: 0, w: 80, d: 40, h: 11 },
    { x: -31, z: -15, e: 11, w: 58, d: 7, h: 46, screen: true },
    { x: 15, z: 7, e: 11, w: 16, d: 16, h: 15 },
  ],
}

/* Fallback, so a new service slug renders something sane rather than a
   blank frame while its object is being drawn. */
const DEFAULT: Box[] = [PLINTH, { x: -22, z: -22, e: 0, w: 44, d: 44, h: 40 }]

export function ServiceObject({
  slug,
  layer,
  className,
}: {
  slug: string
  layer: LayerCode
  className?: string
}) {
  const base = LAYER_SOLID[layer]
  const boxes = OBJECTS[slug] ?? DEFAULT
  const id = `obj-${slug}`

  /* Back to front. Footprint decides depth; elevation breaks the tie so a
     stacked box paints over the one it is sitting on. */
  const ordered = [...boxes].sort((a, b) => a.x + a.z - (b.x + b.z) || a.e - b.e)

  return (
    <svg viewBox="-94 -92 188 180" className={className} aria-hidden>
      <defs>
        {/* A single sheen across every top face, so the whole object looks
            lit by one source rather than tinted box by box */}
        <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-shadow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#1E1E9B" stopOpacity="0.26" />
          <stop offset="55%" stopColor="#1E1E9B" stopOpacity="0.09" />
          <stop offset="100%" stopColor="#1E1E9B" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* The pool the whole assembly casts, drawn once for the group rather
          than per box — a real object has one shadow, not six. */}
      <ellipse cx="0" cy="62" rx="92" ry="18" fill={`url(#${id}-shadow)`} />

      <g className="transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[6px]">
        {ordered.map((b, i) => {
          const f = faces(b)
          return (
            <g key={i}>
              <path d={f.left} fill={base} opacity={0.72} />
              <path d={f.right} fill={base} opacity={0.48} />
              <path d={f.top} fill={base} />
              <path d={f.top} fill={`url(#${id}-sheen)`} />
              {/* Detail sits on the lit-side face and reads as recess:
                  darker than the face it is cut into. */}
              {faceDetail(b).map((d, n) => (
                <path key={n} d={d} fill="#0A0C1F" opacity={b.screen ? 0.3 : 0.22} />
              ))}
            </g>
          )
        })}
      </g>
    </svg>
  )
}
