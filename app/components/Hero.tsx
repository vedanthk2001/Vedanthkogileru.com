'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const slides = [
  {
    id: 'quote-product',
    quote: 'Fall in love with the problem, not the solution.',
    attribution: 'Uri Levine, co-founder of Waze',
    context: 'On Product',
  },
  {
    id: 'quote-physics',
    quote: 'If you cannot explain it simply, you do not understand it well enough.',
    attribution: 'Richard Feynman',
    context: 'On Physics',
  },
  {
    id: 'quote-climbing',
    quote: 'The summit is what drives us, but the climb itself is what matters.',
    attribution: 'Conrad Anker, mountaineer',
    context: 'On Climbing',
  },
]

const AUTOPLAY_MS = 5000

function mod(n: number, m: number) {
  return ((n % m) + m) % m
}

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] as const } },
  exit: (dir: number) => ({ x: dir < 0 ? 48 : -48, opacity: 0, transition: { duration: 0.3 } }),
}

export default function Hero() {
  const [[index, dir], setIndex] = useState([0, 0])
  const [paused, setPaused] = useState(false)

  const go = useCallback((newDir: number) => {
    setIndex(([prev]) => [mod(prev + newDir, slides.length), newDir])
  }, [])

  const goTo = useCallback((i: number) => {
    setIndex(([prev]) => [i, i > prev ? 1 : -1])
  }, [])

  useEffect(() => {
    if (paused) return
    const t = setTimeout(() => go(1), AUTOPLAY_MS)
    return () => clearTimeout(t)
  }, [index, paused, go])

  const slide = slides[index]

  return (
    <section
      className="relative min-h-screen flex items-center bg-white pt-16 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Ambient background blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-32 -left-24 w-[34rem] h-[34rem] rounded-full bg-indigo-100/60 blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-[30rem] h-[30rem] rounded-full bg-sky-100/50 blur-3xl"
          animate={{ x: [0, -30, 0], y: [0, -40, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 py-20 w-full">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={slide.id}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="min-h-[70vh] flex flex-col justify-center items-center text-center max-w-4xl mx-auto"
          >
            <p className="text-indigo-400 font-medium text-xs tracking-widest uppercase mb-10">
              {slide.context}
            </p>
            <p className="text-6xl md:text-8xl font-bold text-indigo-600 leading-none mb-4 select-none">
              &ldquo;
            </p>
            <blockquote className="text-2xl md:text-4xl font-bold text-slate-900 leading-snug mb-8">
              {slide.quote}
            </blockquote>
            <p className="text-slate-400 text-base">{slide.attribution}</p>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-6 mt-10">
          <button
            onClick={() => go(-1)}
            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
            aria-label="Previous slide"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? 'w-8 bg-indigo-600' : 'w-2 bg-indigo-200 hover:bg-indigo-300'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => go(1)}
            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
            aria-label="Next slide"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
