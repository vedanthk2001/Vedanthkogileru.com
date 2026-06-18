'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

type ContentSlide = {
  type: 'content'
  id: string
  label: string
  headline: string
  body: string
  ctas?: { label: string; href: string; primary: boolean }[]
  metric?: { value: string; label: string }
  image: string | null
  imageAlt: string
  imagePlaceholder: string
}

type QuoteSlide = {
  type: 'quote'
  id: string
  quote: string
  attribution: string
  context: string
}

type Slide = ContentSlide | QuoteSlide

const slides: Slide[] = [
  {
    type: 'content',
    id: 'intro',
    label: 'Product Manager · Fintech & AI',
    headline: "Hi, I'm Vedanth Kogileru.",
    body: 'I build the products Indians invest through. And the AI behind the next generation of financial conversations. Founding PM by instinct, data-native by training.',
    ctas: [
      { label: 'View My Work', href: '#projects', primary: true },
      { label: 'Get in Touch', href: '#contact', primary: false },
    ],
    image: null,
    imageAlt: 'Vedanth Kogileru',
    imagePlaceholder: 'Profile photo',
  },
  {
    type: 'quote',
    id: 'quote-product',
    quote: 'Fall in love with the problem, not the solution.',
    attribution: 'Uri Levine, co-founder of Waze',
    context: 'On Product',
  },
  {
    type: 'content',
    id: 'builder',
    label: 'Founding PM · 0 to 1',
    headline: 'Two products built from a blank page.',
    body: 'Karat Wealth and KaratClub. Both from the first wireframe to production apps with real investors. Led a team of 14 to make it happen.',
    metric: { value: '+74%', label: 'user to investor conversion' },
    image: null,
    imageAlt: 'Karat Wealth product',
    imagePlaceholder: 'Product screenshot or phone mockup',
  },
  {
    type: 'quote',
    id: 'quote-physics',
    quote: 'If you cannot explain it simply, you do not understand it well enough.',
    attribution: 'Richard Feynman',
    context: 'On Physics',
  },
  {
    type: 'content',
    id: 'climbing',
    label: 'Off the Clock',
    headline: 'I solve problems for a living. On weekends I solve them with my hands.',
    body: 'Rock climbing is the purest problem solving I know. Every route is a new puzzle. Every move has a consequence. The wall does not care about your plan.',
    image: null,
    imageAlt: 'Rock climbing',
    imagePlaceholder: 'Climbing photo',
  },
  {
    type: 'quote',
    id: 'quote-climbing',
    quote: 'The summit is what drives us, but the climb itself is what matters.',
    attribution: 'Conrad Anker, mountaineer',
    context: 'On Climbing',
  },
  {
    type: 'content',
    id: 'chess',
    label: 'Chess',
    headline: 'Thinking several moves ahead is just part of the job.',
    body: 'Chess sharpened something I use every day in product work. The ability to sit with complexity, plan for what has not happened yet, and still make a move.',
    image: null,
    imageAlt: 'Chess',
    imagePlaceholder: 'Chess photo',
  },
  {
    type: 'content',
    id: 'snooker',
    label: 'Snooker',
    headline: 'The shot after this one is the one that matters.',
    body: 'Snooker is a game of position. You are always playing two shots at once. That kind of thinking translates directly when you are building a roadmap.',
    image: null,
    imageAlt: 'Snooker',
    imagePlaceholder: 'Snooker photo',
  },
]

const AUTOPLAY_MS = 5000

function mod(n: number, m: number) {
  return ((n % m) + m) % m
}

const contentVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] as const } },
  exit: (dir: number) => ({ x: dir < 0 ? 48 : -48, opacity: 0, transition: { duration: 0.3 } }),
}

const imageVariants = {
  enter: { opacity: 0, scale: 1.03 },
  center: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
  exit: { opacity: 0, scale: 0.97, transition: { duration: 0.3 } },
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
      {/* Ambient background */}
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

          {slide.type === 'quote' ? (
            /* Quote slide — full width, centered, typographic */
            <motion.div
              key={slide.id}
              custom={dir}
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="min-h-[70vh] flex flex-col justify-center items-center text-center max-w-4xl mx-auto"
            >
              <p className="text-indigo-400 font-medium text-xs tracking-widest uppercase mb-10">
                {slide.context}
              </p>
              <p className="text-5xl md:text-7xl font-bold text-indigo-600 leading-none mb-6 select-none">
                &ldquo;
              </p>
              <blockquote className="text-2xl md:text-4xl font-bold text-slate-900 leading-snug mb-8">
                {slide.quote}
              </blockquote>
              <p className="text-slate-400 text-base">{slide.attribution}</p>
            </motion.div>

          ) : (
            /* Content slide — split layout */
            <motion.div
              key={slide.id}
              custom={dir}
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="grid md:grid-cols-12 gap-12 items-center min-h-[70vh]"
            >
              {/* Text */}
              <div className="md:col-span-7 flex flex-col justify-center">
                <p className="text-indigo-600 font-medium text-sm tracking-widest uppercase mb-5">
                  {slide.label}
                </p>
                <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight tracking-tight mb-6">
                  {slide.headline}
                </h1>
                <p className="text-lg md:text-xl text-slate-500 leading-relaxed mb-8 max-w-xl">
                  {slide.body}
                </p>

                {slide.metric && (
                  <div className="mb-8">
                    <p className="text-6xl font-bold text-indigo-600">{slide.metric.value}</p>
                    <p className="text-slate-400 text-sm mt-1">{slide.metric.label}</p>
                  </div>
                )}

                {slide.ctas && (
                  <div className="flex flex-col sm:flex-row gap-4">
                    {slide.ctas.map(cta => (
                      <a
                        key={cta.label}
                        href={cta.href}
                        className={
                          cta.primary
                            ? 'bg-indigo-600 text-white font-semibold px-8 py-4 rounded-xl hover:bg-indigo-700 transition-colors text-center'
                            : 'border-2 border-slate-200 text-slate-700 font-semibold px-8 py-4 rounded-xl hover:border-indigo-300 hover:text-indigo-600 transition-colors text-center'
                        }
                      >
                        {cta.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Image */}
              <div className="md:col-span-5 hidden md:block">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={slide.id + '-img'}
                    variants={imageVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden"
                  >
                    {slide.image ? (
                      <Image src={slide.image} alt={slide.imageAlt} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-3">
                        <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-slate-300 text-sm font-medium">{slide.imagePlaceholder}</p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Navigation — always visible below */}
        <div className="flex items-center gap-6 mt-10">
          <div className="flex items-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index
                    ? 'w-8 bg-indigo-600'
                    : s.type === 'quote'
                    ? 'w-2 bg-indigo-200 hover:bg-indigo-300'
                    : 'w-2 bg-slate-200 hover:bg-slate-300'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => go(-1)}
              className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
              aria-label="Previous slide"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
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
      </div>
    </section>
  )
}
