'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'

// Phase timing for the entropy animation
const CHAOS_MS = 2600 // how long particles bounce around in disorder
const PARTICLE_COUNT = 90

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  tx: number // ordered target x
  ty: number // ordered target y
  r: number
  hue: 'indigo' | 'sky' | 'slate'
}

const COLORS = {
  indigo: 'rgba(79, 70, 229, OPACITY)',
  sky: 'rgba(14, 165, 233, OPACITY)',
  slate: 'rgba(148, 163, 184, OPACITY)',
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number>(0)
  const phaseRef = useRef<'chaos' | 'order'>('chaos')
  const startRef = useRef<number>(0)
  const [settled, setSettled] = useState(false)

  // Build the ordered lattice the particles collapse into
  const buildTargets = useCallback((w: number, h: number) => {
    const cols = 18
    const rows = 5
    const spacingX = Math.min(34, (w * 0.62) / cols)
    const spacingY = 30
    const gridW = (cols - 1) * spacingX
    const gridH = (rows - 1) * spacingY
    const offsetX = (w - gridW) / 2
    const offsetY = h * 0.5 - gridH / 2

    const targets: { tx: number; ty: number }[] = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        targets.push({
          tx: offsetX + c * spacingX,
          ty: offsetY + r * spacingY,
        })
      }
    }
    return targets.slice(0, PARTICLE_COUNT)
  }, [])

  const seed = useCallback(
    (w: number, h: number) => {
      const targets = buildTargets(w, h)
      const hues: Particle['hue'][] = ['indigo', 'sky', 'slate']
      particlesRef.current = targets.map((t, i) => ({
        x: rand(0, w),
        y: rand(0, h),
        vx: rand(-2.6, 2.6),
        vy: rand(-2.6, 2.6),
        tx: t.tx,
        ty: t.ty,
        r: rand(1.5, 3.5),
        hue: i % 7 === 0 ? 'indigo' : i % 5 === 0 ? 'sky' : hues[i % 3],
      }))
    },
    [buildTargets]
  )

  const start = useCallback(() => {
    setSettled(false)
    phaseRef.current = 'chaos'
    startRef.current = performance.now()
    const canvas = canvasRef.current
    if (canvas) {
      const rect = canvas.getBoundingClientRect()
      seed(rect.width, rect.height)
    }
  }, [seed])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = 0
    let height = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      // re-target existing particles so the lattice stays centered
      const targets = buildTargets(width, height)
      particlesRef.current.forEach((p, i) => {
        if (targets[i]) {
          p.tx = targets[i].tx
          p.ty = targets[i].ty
        }
      })
    }

    resize()
    seed(width, height)
    startRef.current = performance.now()

    if (reduce) {
      // Respect reduced motion: snap straight to order and reveal
      particlesRef.current.forEach((p) => {
        p.x = p.tx
        p.y = p.ty
        p.vx = 0
        p.vy = 0
      })
      phaseRef.current = 'order'
      setSettled(true)
    }

    const draw = (now: number) => {
      ctx.clearRect(0, 0, width, height)
      const elapsed = now - startRef.current
      const particles = particlesRef.current

      if (phaseRef.current === 'chaos' && elapsed > CHAOS_MS) {
        phaseRef.current = 'order'
      }

      let totalDist = 0

      for (const p of particles) {
        if (phaseRef.current === 'chaos') {
          // Disorder: free flight, bounce off edges
          p.x += p.vx
          p.y += p.vy
          if (p.x < 0 || p.x > width) p.vx *= -1
          if (p.y < 0 || p.y > height) p.vy *= -1
          p.x = Math.max(0, Math.min(width, p.x))
          p.y = Math.max(0, Math.min(height, p.y))
        } else {
          // Order: get absorbed toward the lattice point
          const dx = p.tx - p.x
          const dy = p.ty - p.y
          p.x += dx * 0.08
          p.y += dy * 0.08
          totalDist += Math.abs(dx) + Math.abs(dy)
        }

        // draw the particle
        const op = phaseRef.current === 'chaos' ? 0.55 : 0.85
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = COLORS[p.hue].replace('OPACITY', String(op))
        ctx.fill()
      }

      // Connect settled particles with faint lines (order made visible)
      if (phaseRef.current === 'order') {
        ctx.strokeStyle = 'rgba(79, 70, 229, 0.06)'
        ctx.lineWidth = 1
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const a = particles[i]
            const b = particles[j]
            const d = Math.hypot(a.x - b.x, a.y - b.y)
            if (d < 42) {
              ctx.beginPath()
              ctx.moveTo(a.x, a.y)
              ctx.lineTo(b.x, b.y)
              ctx.stroke()
            }
          }
        }
      }

      if (
        phaseRef.current === 'order' &&
        !reduce &&
        totalDist / particles.length < 1.2
      ) {
        setSettled((s) => s || true)
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [seed, buildTargets])

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-white pt-16 overflow-hidden">
      {/* Ambient wash */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-32 -left-24 w-[34rem] h-[34rem] rounded-full bg-indigo-50 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] rounded-full bg-sky-50 blur-3xl" />
      </div>

      {/* Entropy particle field */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      />

      {/* Text resolves out of the settled lattice */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 text-center">
        <motion.p
          className="text-indigo-500 font-medium text-xs md:text-sm tracking-[0.2em] uppercase mb-6"
          initial={{ opacity: 0, y: 12 }}
          animate={settled ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          The Second Law of Thermodynamics
        </motion.p>

        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.05] mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={settled ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          My job is to absorb
          <br />
          the entropy.
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 16 }}
          animate={settled ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.35 }}
        >
          I&apos;m Vedanth Kogileru, an AI Product Manager at Ignosis. Disorder is
          the default state of every product and team. My work is the energy that
          keeps it in order.
        </motion.p>

        <motion.div
          className="mt-10 flex items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={settled ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.55 }}
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
        transition={{ duration: 0.8, delay: 0.8 }}
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
