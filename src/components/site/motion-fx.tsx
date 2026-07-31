'use client'

import { useEffect, useRef, useState } from 'react'
import { useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion'

/* Shared motion utilities.

   This file used to also carry a set of decorative effects — a particle
   field, an aurora mesh, audio bars, typing dots, a confetti burst — built
   for the sister brand's call-centre pages. Every one of them was unused
   here and several hard-coded that brand's gold, so they are gone rather
   than sitting in the tree waiting to be reached for by accident. */

/* Motion preference. Starts `false` and corrects in an effect, because the
   preference cannot be read during a server render — components that branch
   on it therefore mount their animated form for one frame and then swap. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  return reduced
}

/* ── Mouse parallax ──
   Returns springy -1..1 values for the pointer's position inside `ref`, so
   layers can drift against each other and a stage feels like it has depth. */
export function useMouseParallax<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 60, damping: 20, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 60, damping: 20, mass: 0.6 })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      x.set(((e.clientX - r.left) / r.width - 0.5) * 2)
      y.set(((e.clientY - r.top) / r.height - 0.5) * 2)
    }
    const onLeave = () => {
      x.set(0)
      y.set(0)
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [x, y])

  return { ref, x: sx, y: sy }
}

/* Depth helper: turn a -1..1 parallax value into pixels of drift. */
export function useDrift(v: MotionValue<number>, px: number) {
  return useTransform(v, (n) => n * px)
}
