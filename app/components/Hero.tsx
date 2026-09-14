'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import VoicePanel from './VoicePanel'

/** The copy finishes laying out ~980ms after the name lands (the last item
 *  starts at 380 and runs 600). Hold from there before opening the panel, so
 *  the hero is never doing two things at once. */
const OPEN_DELAY_MS = 980 + 1000

const CHAOS_MS = 2200
const COLLAPSE_MS = 1800
const MAX_PARTICLES = 600
const TAU = Math.PI * 2

/** Depth slices used for both draw order and alpha batching. Every particle in
 *  a slice shares one fill, so this is the number of draw calls per frame, not
 *  a quality knob. 16 is past the point where more slices are visible. */
const DEPTH_BINS = 16
/** Four base opacities, as before. Combined with the depth slice this gives
 *  DEPTH_BINS * 4 draw groups. */
const ALPHA_LEVELS = [0.9, 0.7, 0.55, 0.85]
const GROUPS = DEPTH_BINS * ALPHA_LEVELS.length

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function rand(a: number, b: number) { return Math.random() * (b - a) + a }

/** Headline size only. Cheap enough to run on every resize, unlike sampleText,
 *  which rasterises the text and reads it back. */
function measureHeadline(lines: string[], w: number) {
  const c = document.createElement('canvas').getContext('2d')!
  let size = Math.min(w / 7, 120)
  c.font = `800 ${size}px Inter, system-ui, sans-serif`
  const longest = lines.reduce((a, b) => (a.length > b.length ? a : b))
  const measured = c.measureText(longest).width
  if (measured > w * 0.88) size *= (w * 0.88) / measured
  return size
}

function sampleText(lines: string[], w: number, h: number, count: number) {
  const off = document.createElement('canvas')
  off.width = w
  off.height = h
  const c = off.getContext('2d')!
  c.fillStyle = '#fff'
  c.fillRect(0, 0, w, h)

  const size = measureHeadline(lines, w)
  c.font = `800 ${size}px Inter, system-ui, sans-serif`
  c.textAlign = 'center'
  c.textBaseline = 'middle'

  const lh = size
  const totalH = lines.length * lh
  const centerY = h * 0.40
  const startY = centerY - totalH / 2 + lh / 2

  c.fillStyle = '#000'
  lines.forEach((line, i) => c.fillText(line, w / 2, startY + i * lh))

  const img = c.getImageData(0, 0, w, h)
  const pts: { x: number; y: number }[] = []
  const step = Math.max(2, Math.floor(size / 42))

  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      if (img.data[(y * w + x) * 4] < 80) pts.push({ x, y })
    }
  }

  for (let i = pts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pts[i], pts[j]] = [pts[j], pts[i]]
  }

  return { pts: pts.slice(0, Math.min(count, pts.length)), size }
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const textRef = useRef<HTMLHeadingElement>(null)
  const rafRef = useRef<number>(0)
  const [settled, setSettled] = useState(false)
  const [opened, setOpened] = useState(false)
  const [headlineSize, setHeadlineSize] = useState<number | null>(null)

  useEffect(() => {
    if (!settled) return
    const id = setTimeout(() => setOpened(true), OPEN_DELAY_MS)
    return () => clearTimeout(id)
  }, [settled])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lines = ['Hi, I’m', 'Vedanth']

    let w = 0, h = 0, cx = 0, cy = 0
    let n = 0
    let focal = 900, zNear = 0, zFar = 0, minDenom = 0
    let phase: 'chaos' | 'order' = 'chaos'
    let start = 0, orderStart = 0, lastAngle = 0
    let isSettled = false

    // Parallel typed arrays rather than an array of objects: no per-frame
    // allocation, no GC pressure during the animation, and the counting sort
    // below can reorder indices without touching particle data.
    let px!: Float32Array, py!: Float32Array, pz!: Float32Array
    let vx!: Float32Array, vy!: Float32Array, vz!: Float32Array
    let sx!: Float32Array, sy!: Float32Array, sz!: Float32Array
    let tx!: Float32Array, ty!: Float32Array
    let rad!: Float32Array, lvl!: Uint8Array
    // Projection scratch, reused every frame.
    let ox!: Float32Array, oy!: Float32Array, or_!: Float32Array
    let group!: Int32Array, order!: Int32Array
    const counts = new Int32Array(GROUPS)
    const offsets = new Int32Array(GROUPS)
    /** Alpha per draw group, recomputed only when geometry changes. */
    const groupAlpha = new Float32Array(GROUPS)

    const setOpacities = (canvasOp: number, textOp: number) => {
      canvas.style.opacity = String(canvasOp)
      if (textRef.current) textRef.current.style.opacity = String(textOp)
    }

    /** Alpha depends only on the slice's centre depth, so it is computed once
     *  per resize instead of once per particle per frame. */
    const buildGroupAlpha = () => {
      const span = (zFar - zNear) / DEPTH_BINS
      for (let b = 0; b < DEPTH_BINS; b++) {
        const zc = zNear + span * (b + 0.5)
        const s = focal / Math.max(minDenom, focal + zc)
        const depth = Math.min(1.25, Math.max(0.12, s * s))
        for (let l = 0; l < ALPHA_LEVELS.length; l++) {
          groupAlpha[b * ALPHA_LEVELS.length + l] = Math.min(0.95, ALPHA_LEVELS[l] * depth)
        }
      }
    }

    const init = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = rect.width; h = rect.height
      cx = w / 2; cy = h / 2
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Focal length tracks viewport width so the perspective reads the same on
      // a phone and a wide monitor. The depth volume is expressed as a fraction
      // of it for the same reason.
      focal = Math.max(900, w * 0.9)
      zNear = -0.42 * focal
      zFar = 0.90 * focal
      // Rotation can swing a particle's depth to roughly -focal, which would put
      // it behind the camera and turn the projection inside out. Clamping the
      // denominator bounds the near scale at about 2.9x instead.
      minDenom = 0.35 * focal
      buildGroupAlpha()

      const { pts, size } = sampleText(lines, w, h, MAX_PARTICLES)
      setHeadlineSize(size)
      n = pts.length

      px = new Float32Array(n); py = new Float32Array(n); pz = new Float32Array(n)
      vx = new Float32Array(n); vy = new Float32Array(n); vz = new Float32Array(n)
      sx = new Float32Array(n); sy = new Float32Array(n); sz = new Float32Array(n)
      tx = new Float32Array(n); ty = new Float32Array(n)
      rad = new Float32Array(n); lvl = new Uint8Array(n)
      ox = new Float32Array(n); oy = new Float32Array(n); or_ = new Float32Array(n)
      group = new Int32Array(n); order = new Int32Array(n)

      const drift = focal / 620
      for (let i = 0; i < n; i++) {
        px[i] = rand(0, w); py[i] = rand(0, h); pz[i] = rand(zNear, zFar)
        vx[i] = rand(-3, 3); vy[i] = rand(-3, 3); vz[i] = rand(-1.4, 1.4) * drift
        tx[i] = pts[i].x; ty[i] = pts[i].y
        rad[i] = rand(1.2, 2.0)
        lvl[i] = i % ALPHA_LEVELS.length
      }

      phase = 'chaos'
      start = performance.now()
      orderStart = 0
      lastAngle = 0
      isSettled = false
      setSettled(false)
      canvas.style.transition = ''
      if (textRef.current) textRef.current.style.transition = ''
      setOpacities(1, 0)

      cancelAnimationFrame(rafRef.current)

      if (reduced) {
        // Snap to the settled state. No rotation, no loop started at all.
        isSettled = true
        setOpacities(0, 1)
        setSettled(true)
        return
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    /** Projects every particle, then draws them far to near in one fill per
     *  depth-and-alpha group: ~64 fills per frame rather than 600. */
    const paint = (angle: number) => {
      const cos = Math.cos(angle), sin = Math.sin(angle)
      const binScale = DEPTH_BINS / (zFar - zNear)
      const nLevels = ALPHA_LEVELS.length

      counts.fill(0)

      for (let i = 0; i < n; i++) {
        const dx = px[i] - cx
        // Rotation about the vertical axis through the centre. Only x and z
        // change; y is untouched, which is why this needs no matrix.
        const rz = dx * sin + pz[i] * cos
        const rx = cx + dx * cos - pz[i] * sin
        const s = focal / Math.max(minDenom, focal + rz)

        ox[i] = cx + (rx - cx) * s
        oy[i] = cy + (py[i] - cy) * s
        or_[i] = rad[i] * s

        let b = ((rz - zNear) * binScale) | 0
        if (b < 0) b = 0; else if (b >= DEPTH_BINS) b = DEPTH_BINS - 1
        const g = b * nLevels + lvl[i]
        group[i] = g
        counts[g]++
      }

      // Counting sort into draw order: O(n), allocation free, and it doubles as
      // the grouping pass since a group is contiguous in the result.
      let running = 0
      for (let g = GROUPS - 1; g >= 0; g--) {
        offsets[g] = running
        running += counts[g]
      }
      for (let i = 0; i < n; i++) order[offsets[group[i]]++] = i

      // Groups are contiguous in `order`, so a single cursor walks the spans.
      let cursor = 0
      for (let g = GROUPS - 1; g >= 0; g--) {
        const c = counts[g]
        if (c === 0) continue
        ctx.beginPath()
        for (let k = 0; k < c; k++) {
          const i = order[cursor + k]
          const r = or_[i]
          if (r < 0.3) continue
          // moveTo before each arc, or consecutive arcs are joined by a line.
          ctx.moveTo(ox[i] + r, oy[i])
          ctx.arc(ox[i], oy[i], r, 0, TAU)
        }
        ctx.fillStyle = `rgba(15,15,15,${groupAlpha[g]})`
        ctx.fill()
        cursor += c
      }
    }

    const draw = (now: number) => {
      ctx.clearRect(0, 0, w, h)

      if (phase === 'chaos' && now - start > CHAOS_MS) {
        phase = 'order'
        orderStart = now
        sx.set(px); sy.set(py); sz.set(pz)
      }

      let angle = 0

      if (phase === 'order') {
        const t = Math.min(1, (now - orderStart) / COLLAPSE_MS)
        const e = easeInOutCubic(t)
        // Spin decelerates to square-on exactly as the letterforms resolve.
        angle = lastAngle * (1 - e)

        for (let i = 0; i < n; i++) {
          px[i] = sx[i] + (tx[i] - sx[i]) * e
          py[i] = sy[i] + (ty[i] - sy[i]) * e
          // z eases to 0, where the projection scale is exactly 1, so every
          // particle lands on the same pixel the flat version would have used.
          pz[i] = sz[i] * (1 - e)
        }
        paint(angle)

        if (t >= 1) {
          isSettled = true
          setSettled(true)
          canvas.style.transition = 'opacity 0.5s ease'
          canvas.style.opacity = '0'
          if (textRef.current) {
            textRef.current.style.transition = 'opacity 0.5s ease'
            textRef.current.style.opacity = '1'
          }
          // Nothing left to animate. Stop the loop rather than clearing an
          // empty canvas sixty times a second for the rest of the visit.
          return
        }
      } else {
        angle = ((now - start) / 1000) * 0.55
        lastAngle = angle
        for (let i = 0; i < n; i++) {
          px[i] += vx[i]; py[i] += vy[i]; pz[i] += vz[i]
          if (px[i] <= 0) { px[i] = 0; vx[i] = -vx[i] }
          else if (px[i] >= w) { px[i] = w; vx[i] = -vx[i] }
          if (py[i] <= 0) { py[i] = 0; vy[i] = -vy[i] }
          else if (py[i] >= h) { py[i] = h; vy[i] = -vy[i] }
          if (pz[i] < zNear || pz[i] > zFar) vz[i] = -vz[i]
        }
        paint(angle)
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    // Once settled the canvas is already faded out, so replaying the whole
    // animation on a resize would be noise. Only the headline needs to track
    // the new width, and measuring that is cheap.
    const onResize = () => {
      if (isSettled) setHeadlineSize(measureHeadline(lines, canvas.getBoundingClientRect().width))
      else init()
    }

    const boot = async () => {
      await document.fonts.ready
      init()
    }

    boot()
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <section className="relative h-screen bg-white overflow-hidden">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-32 -left-24 w-[34rem] h-[34rem] rounded-full bg-indigo-50 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] rounded-full bg-sky-50 blur-3xl" />
      </div>

      {/* Canvas and copy share one wrapper so they travel left together as a
          single object when the voice panel opens. Pure transform, no reflow. */}
      <div
        className={`absolute inset-0 transition-transform duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] ${
          opened ? 'md:-translate-x-1/4' : ''
        }`}
      >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />

      {/* Name — ghost at 0, crossfades in once particles settle */}
      <h1
        ref={textRef}
        className="absolute left-0 right-0 px-6 text-center font-extrabold text-slate-900 leading-none pointer-events-none select-none"
        style={{
          top: '40%',
          transform: 'translateY(-50%)',
          opacity: 0,
          fontSize: headlineSize ? `${headlineSize}px` : undefined,
        }}
      >
        Hi, I&rsquo;m<br />Vedanth
      </h1>

      {/* Tagline + description grouped directly below the name */}
      <div
        className="absolute left-0 right-0 px-6"
        style={{
          top: '40%',
          transform: `translateY(${(headlineSize ?? 0) + 24}px)`,
        }}
      >
        <motion.h2
          className="text-center text-xl md:text-3xl font-semibold text-slate-700 leading-snug"
          initial={{ opacity: 0 }}
          animate={settled ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          and my job is to absorb entropy.
        </motion.h2>

        <motion.p
          className="mt-4 text-slate-500 text-sm md:text-base leading-relaxed text-center max-w-md mx-auto"
          initial={{ opacity: 0, y: 8 }}
          animate={settled ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.25 }}
        >
          AI Product Manager. Disorder is the default state of every system,
          and my work is the energy that keeps it in order.
        </motion.p>
      </div>

      {/* CTAs anchored to bottom */}
      <motion.div
        className="absolute bottom-16 left-0 right-0 flex items-center justify-center gap-4 px-6"
        initial={{ opacity: 0 }}
        animate={settled ? { opacity: 1 } : {}}
        transition={{ duration: 0.7, delay: 0.4 }}
      >
        <a
          href="#work"
          className="px-6 py-3 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          See the work
        </a>
        <a
          href="#contact"
          className="px-6 py-3 rounded-full border border-slate-200 text-slate-600 text-sm font-medium hover:border-indigo-300 hover:text-indigo-600 transition-colors"
        >
          Get in touch
        </a>
      </motion.div>
      </div>

      {/* Voice panel: arrives from the right edge once the copy has settled.
          Hidden below md, where there is no room for a second column. */}
      <div
        className={`hidden md:block absolute top-1/2 right-0 w-1/2 -translate-y-1/2 pr-8 lg:pr-12 pl-4
          transition-all duration-[800ms] ease-[cubic-bezier(.22,1,.36,1)] ${
            opened ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[115%]'
          }`}
      >
        <VoicePanel />
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={settled ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className="w-5 h-8 rounded-full border-2 border-slate-200 flex justify-center pt-1.5">
          <motion.div
            className="w-1 h-1.5 rounded-full bg-slate-300"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  )
}
