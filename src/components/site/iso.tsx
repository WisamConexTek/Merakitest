'use client'

/* ═══════════════════════════════════════════════════════════
   THE ISOMETRIC KIT

   One angle governs the whole site: 30°, the true isometric rise.
   Every slab, tile, connector and corner cut is derived from the
   two constants below rather than eyeballed per component, which
   is what keeps the hero, the services grid and the partner panels
   looking like drawings of the same object.

   Coordinate system — a right-handed ground plane with height up:

     x  runs away from the viewer to the RIGHT
     z  runs away from the viewer to the LEFT
     y  is height, positive UP (screen y is flipped inside project)

   A unit step in x moves right by cos30 and DOWN by sin30; a unit
   step in z moves left by cos30 and down by sin30. That is the
   whole projection — everything else here is bookkeeping.
   ═══════════════════════════════════════════════════════════ */

export const ISO_COS = Math.cos(Math.PI / 6) // 0.8660 — horizontal run
export const ISO_SIN = Math.sin(Math.PI / 6) // 0.5    — vertical rise

/* ═══════════════════ LAYER PALETTES ═══════════════════
   The four stack layers, in three variants. One map is not enough, and
   using one is how the first pass shipped unreadable text:

   SOLID     — for filled geometry (a slab, a chip). A block of colour is
               legible at any luminance because its size carries it.
   ON_DARK   — for small text, hairlines and icons over the ink ground.
               L1's deep indigo lands around 1.6:1 against #06081F, so its
               label is lifted; the slab itself stays the true brand colour.
   ON_LIGHT  — the mirror problem. Cyan on white is roughly 1.4:1 — an L4
               service card would have had an invisible label — so the top
               two layers are darkened for light surfaces.

   Fills always use SOLID. Anything you have to READ uses the variant for
   the ground it sits on. */

export type LayerCode = 'L1' | 'L2' | 'L3' | 'L4'

export const LAYER_SOLID: Record<LayerCode, string> = {
  L4: '#48E7FF',
  L3: '#717FFF',
  L2: '#5B43F9',
  L1: '#1E1E9B',
}

export const LAYER_ON_DARK: Record<LayerCode, string> = {
  L4: '#48E7FF',
  L3: '#717FFF',
  L2: '#9B8CFF',
  L1: '#6E6EEB',
}

export const LAYER_ON_LIGHT: Record<LayerCode, string> = {
  L4: '#0B8FA6',
  L3: '#4F5CE0',
  L2: '#5B43F9',
  L1: '#1E1E9B',
}

/* Text printed ON a filled slab. The four layer colours straddle the
   light/dark line — cyan and peri are bright enough that white type
   vanishes on them, violet and indigo dark enough that black type does.
   One map settles it rather than each component guessing. */
export const LAYER_LABEL_ON_SOLID: Record<LayerCode, string> = {
  L4: '#06333D',
  L3: '#101440',
  L2: '#FFFFFF',
  L1: '#FFFFFF',
}

export const LAYER_NAME: Record<LayerCode, string> = {
  L4: 'Security Operations',
  L3: 'Network & Edge',
  L2: 'Compute & Data Center',
  L1: 'Identity & Access',
}

/* World point → screen point. Height is subtracted because SVG's y
   axis grows downward and the mental model here is that it grows up. */
export function project(x: number, z: number, y = 0): [number, number] {
  return [(x - z) * ISO_COS, (x + z) * ISO_SIN - y]
}

function poly(points: [number, number][]): string {
  return `M${points.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join('L')}Z`
}

export type SlabFaces = {
  /* The lit surface — what the scan sweeps across */
  top: string
  /* The two faces that catch the light differently, which is the only
     reason the slab reads as solid rather than as a flat diamond */
  left: string
  right: string
  /* Outline of the whole solid, for a hairline that ties the faces together */
  silhouette: string
  /* Screen position of the top face's right-hand vertex — where a label
     connector should attach */
  anchorRight: [number, number]
  anchorLeft: [number, number]
}

/* A rectangular slab centred on the origin, `elevation` units up.
   `w` runs along x, `d` along z, `t` is its thickness. */
export function slab({
  w,
  d,
  t,
  elevation = 0,
}: {
  w: number
  d: number
  t: number
  elevation?: number
}): SlabFaces {
  const hw = w / 2
  const hd = d / 2
  const y = elevation

  /* Top face corners, clockwise from the far (top) vertex */
  const far = project(-hw, -hd, y)
  const right = project(hw, -hd, y)
  const near = project(hw, hd, y)
  const left = project(-hw, hd, y)

  /* The two visible side faces hang from the near edges */
  const nearLow = project(hw, hd, y - t)
  const rightLow = project(hw, -hd, y - t)
  const leftLow = project(-hw, hd, y - t)

  return {
    top: poly([far, right, near, left]),
    /* Face between the left and near corners */
    left: poly([left, near, nearLow, leftLow]),
    /* Face between the near and right corners */
    right: poly([near, right, rightLow, nearLow]),
    silhouette: poly([far, right, rightLow, nearLow, leftLow, left]),
    anchorRight: right,
    anchorLeft: left,
  }
}

/* Just the top face — used where a slab would be too heavy, e.g. the
   scan plane, or a ghosted footprint on the ground. */
export function plane({ w, d, elevation = 0 }: { w: number; d: number; elevation?: number }): string {
  const hw = w / 2
  const hd = d / 2
  return poly([
    project(-hw, -hd, elevation),
    project(hw, -hd, elevation),
    project(hw, hd, elevation),
    project(-hw, hd, elevation),
  ])
}

/* ═══════════════════ CHAMFER ═══════════════════
   The corner treatment, as an SVG path rather than the CSS `.chamfer`
   utility — needed wherever the shape has to be filled or stroked as
   real geometry (clip-path cannot be stroked).

   Cuts the top-left and bottom-right corners, so the cuts lie parallel
   to the isometric grid instead of arguing with it. */
export function chamferRect({
  x = 0,
  y = 0,
  w,
  h,
  c = 14,
}: {
  x?: number
  y?: number
  w: number
  h: number
  c?: number
}): string {
  const k = Math.min(c, w / 2, h / 2)
  return poly([
    [x + k, y],
    [x + w, y],
    [x + w, y + h - k],
    [x + w - k, y + h],
    [x, y + h],
    [x, y + k],
  ])
}

/* ═══════════════════ SLAB COMPONENT ═══════════════════
   Faces are tinted from ONE base colour rather than taking three
   separate colours: a real solid under one light source has a fixed
   relationship between its faces, and hand-picking three tints per
   layer is how an exploded diagram starts looking like a fruit salad.
   Top reads full strength, the left face sits in half shadow, the
   right face deeper still. */
export function IsoSlab({
  faces,
  color,
  opacity = 1,
  lit = false,
}: {
  faces: SlabFaces
  color: string
  opacity?: number
  /* Raises the whole slab's luminance — used when the scan is crossing it */
  lit?: boolean
}) {
  return (
    <g opacity={opacity} style={{ transition: 'opacity 400ms ease' }}>
      <path d={faces.left} fill={color} opacity={lit ? 0.72 : 0.5} />
      <path d={faces.right} fill={color} opacity={lit ? 0.5 : 0.3} />
      <path d={faces.top} fill={color} opacity={lit ? 1 : 0.88} />
      <path
        d={faces.silhouette}
        fill="none"
        stroke={lit ? '#8CF2FF' : color}
        strokeOpacity={lit ? 0.9 : 0.55}
        strokeWidth={1.25}
        style={{ transition: 'stroke 400ms ease, stroke-opacity 400ms ease' }}
      />
    </g>
  )
}
