'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const CHAOS_MS = 2600
const MAX_PARTICLES = 420

type Particle = {
  x: number; y: number
  vx: number; vy: number
  tx: number; ty: number
  r: number
  color: string
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
  let size = Math.min(w / 9, 96)
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
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const lines = ['My job is to absorb', 'the entropy.']

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
        vx: rand(-2.8, 2.8),
        vy: rand(-2.8, 2.8),
        tx: t.x,
        ty: t.y,
        r: rand(1.3, 2.2),
        color: COLORS[i % COLORS.length],
      }))

      phaseRef.current = 'chaos'
      startRef.current = performance.now()
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
      }

      let totalDist = 0

      for (const p of ps) {
        if (phaseRef.current === 'chaos') {
          p.x += p.vx
          p.y += p.vy
          if (p.x <= 0 || p.x >= w) { p.vx *= -1; p.x = Math.max(0, Math.min(w, p.x)) }
          if (p.y <= 0 || p.y >= h) { p.vy *= -1; p.y = Math.max(0, Math.min(h, p.y)) }
        } else {
          const dx = p.tx - p.x
          const dy = p.ty - p.y
          p.x += dx * 0.075
          p.y += dy * 0.075
          totalDist += Math.abs(dx) + Math.abs(dy)
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.fill()
      }

      if (phaseRef.current === 'order' && !settledRef.current && totalDist / ps.length < 0.6) {
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

      {/* Particle canvas: fills the whole screen, text forms at ~40% height */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      />

      {/* DOM content sits below the particle text (~56vh down) */}
      <div
        className="relative z-10 max-w-2xl mx-auto px-6 md:px-12 text-center"
        style={{ paddingTop: '56vh' }}
      >
        <motion.p
          className="text-slate-500 text-lg md:text-xl leading-relaxed mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={settled ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.15 }}
        >
          I&apos;m Vedanth Kogileru, an AI Product Manager at Ignosis.
          Disorder is the default state of every product and team.
          My work is the energy that keeps it in order.
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
