'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const CHAOS_MS = 2200
const COLLAPSE_MS = 1500
const MAX_PARTICLES = 520

type Particle = {
  x: number; y: number
  vx: number; vy: number
  sx: number; sy: number // position captured when collapse begins
  tx: number; ty: number
  r: number
  color: string
}

// ease-in-out so the cloud gathers slowly then snaps into the letters
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function rand(a: number, b: number) { return Math.random() * (b - a) + a }

const COLORS = [
  'rgba(79, 70, 229, 0.92)',
  'rgba(99, 102, 241, 0.85)',
  'rgba(129, 140, 248, 0.75)',
  'rgba(14, 165, 233, 0.80)',
]

function sampleText(lines: string[], w: number, h: number, count: number) {
  const off = document.createElement('canvas')
  off.width = w
  off.height = h
  const c = off.getContext('2d')!
  c.fillStyle = '#fff'
  c.fillRect(0, 0, w, h)

  // Pick font size that fits the widest line within 88% of width
  let size = Math.min(w / 7, 120)
  c.font = `800 ${size}px Inter, system-ui, sans-serif`
  c.textAlign = 'center'
  c.textBaseline = 'middle'
  const longest = lines.reduce((a, b) => (a.length > b.length ? a : b))
  const measured = c.measureText(longest).width
  if (measured > w * 0.88) {
    size *= (w * 0.88) / measured
    c.font = `800 ${size}px Inter, system-ui, sans-serif`
  }

  const lh = size * 1.3
  const totalH = lines.length * lh
  // Place text center at ~40% of canvas height
  const centerY = h * 0.40
  const startY = centerY - totalH / 2 + lh / 2

  c.fillStyle = '#000'
  lines.forEach((line, i) => c.fillText(line, w / 2, startY + i * lh))

  const img = c.getImageData(0, 0, w, h)
  const pts: { x: number; y: number }[] = []
  // Step size: smaller = more detail, but we cap total points at count
  const step = Math.max(2, Math.floor(size / 42))

  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      if (img.data[(y * w + x) * 4] < 80) pts.push({ x, y })
    }
  }

  // Shuffle
  for (let i = pts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pts[i], pts[j]] = [pts[j], pts[i]]
  }

  return pts.slice(0, Math.min(count, pts.length))
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])
  const phaseRef = useRef<'chaos' | 'order'>('chaos')
  const startRef = useRef<number>(0)
  const settledRef = useRef(false)
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0
    let h = 0
    let orderStart = 0 // timestamp when the collapse begins
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const lines = ['Hi, I’m Vedanth']

    const init = () => {
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const targets = sampleText(lines, w, h, MAX_PARTICLES)
      particlesRef.current = targets.map((t, i) => ({
        x: rand(0, w),
        y: rand(0, h),
        vx: rand(-3, 3),
        vy: rand(-3, 3),
        sx: 0,
        sy: 0,
        tx: t.x,
        ty: t.y,
        r: rand(1.3, 2.2),
        color: COLORS[i % COLORS.length],
      }))

      phaseRef.current = 'chaos'
      startRef.current = performance.now()
      orderStart = 0
      settledRef.current = false
      setSettled(false)

      if (reduced) {
        particlesRef.current.forEach(p => { p.x = p.tx; p.y = p.ty; p.vx = 0; p.vy = 0 })
        phaseRef.current = 'order'
        settledRef.current = true
        setSettled(true)
      }
    }

    const draw = (now: number) => {
      ctx.clearRect(0, 0, w, h)
      const ps = particlesRef.current
      if (!ps.length) { rafRef.current = requestAnimationFrame(draw); return }

      const elapsed = now - startRef.current
      if (phaseRef.current === 'chaos' && elapsed > CHAOS_MS) {
        phaseRef.current = 'order'
        orderStart = now
        // freeze each particle's current spot as the collapse origin
        for (const p of ps) { p.sx = p.x; p.sy = p.y }
      }

      for (const p of ps) {
        if (phaseRef.current === 'chaos') {
          p.x += p.vx
          p.y += p.vy
          if (p.x <= 0 || p.x >= w) { p.vx *= -1; p.x = Math.max(0, Math.min(w, p.x)) }
          if (p.y <= 0 || p.y >= h) { p.vy *= -1; p.y = Math.max(0, Math.min(h, p.y)) }
        } else {
          const t = Math.min(1, (now - orderStart) / COLLAPSE_MS)
          const e = easeInOutCubic(t)
          p.x = p.sx + (p.tx - p.sx) * e
          p.y = p.sy + (p.ty - p.sy) * e
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.fill()
      }

      if (phaseRef.current === 'order' && !settledRef.current && now - orderStart >= COLLAPSE_MS) {
        settledRef.current = true
        setSettled(true)
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    const boot = async () => {
      // Wait for Inter to load so canvas text matches the site font
      await document.fonts.ready
      init()
      rafRef.current = requestAnimationFrame(draw)
    }

    boot()
    window.addEventListener('resize', init)
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', init)
    }
  }, [])

  return (
    <section className="relative min-h-screen bg-white pt-16 overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-32 -left-24 w-[34rem] h-[34rem] rounded-full bg-indigo-50 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] rounded-full bg-sky-50 blur-3xl" />
      </div>

      {/* Particle canvas: fills the whole screen, text gathers at ~40% height.
          Fades out once the cloud has assembled so the solid headline shows. */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${
          settled ? 'opacity-0' : 'opacity-100'
        }`}
        aria-hidden="true"
      />

      {/* Solid headline: sits exactly where the particles gather, fades in
          as they dissolve so the letters are crisp and fully readable */}
      <motion.h1
        className="absolute left-0 right-0 px-6 text-center text-5xl md:text-7xl lg:text-8xl font-extrabold text-slate-900 leading-none"
        style={{ top: '40%', transform: 'translateY(-50%)' }}
        initial={{ opacity: 0 }}
        animate={settled ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.7 }}
      >
        Hi, I&rsquo;m Vedanth
      </motion.h1>

      {/* DOM content sits below the headline (~56vh down) */}
      <div
        className="relative z-10 max-w-2xl mx-auto px-6 md:px-12 text-center"
        style={{ paddingTop: '56vh' }}
      >
        <motion.h2
          className="text-2xl md:text-4xl font-bold text-slate-900 leading-snug mb-4"
          initial={{ opacity: 0, y: 18 }}
          animate={settled ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.1 }}
        >
          and my job is to absorb the entropy.
        </motion.h2>

        <motion.p
          className="text-slate-500 text-base md:text-lg leading-relaxed mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={settled ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.25 }}
        >
          AI Product Manager at Ignosis. Disorder is the default state of every
          product and team. My work is the energy that keeps it in order.
        </motion.p>

        <motion.div
          className="flex items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={settled ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.35 }}
        >
          <a
            href="#projects"
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

      {/* Scroll hint */}
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
