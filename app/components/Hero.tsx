'use client'

import { motion } from 'framer-motion'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] as const } },
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-white pt-16 overflow-hidden">
      {/* Animated ambient background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
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
        <motion.div
          className="max-w-3xl"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.p
            variants={item}
            className="text-indigo-600 font-medium text-sm tracking-widest uppercase mb-4"
          >
            Product Manager · Fintech &amp; AI
          </motion.p>
          <motion.h1
            variants={item}
            className="text-5xl md:text-7xl font-bold text-slate-900 leading-tight tracking-tight mb-6"
          >
            Hi, I&apos;m <span className="text-indigo-600">Vedanth</span> Kogileru.
          </motion.h1>
          <motion.p
            variants={item}
            className="text-xl md:text-2xl text-slate-600 leading-relaxed mb-10 max-w-2xl"
          >
            I build the products Indians invest through — and the AI behind the
            next generation of financial conversations. Founding PM by instinct,
            data-native by training.
          </motion.p>

          <motion.div variants={item} className="flex flex-col sm:flex-row gap-4">
            <a
              href="#projects"
              className="bg-indigo-600 text-white font-semibold px-8 py-4 rounded-xl hover:bg-indigo-700 transition-colors text-center"
            >
              View My Work
            </a>
            <a
              href="#contact"
              className="border-2 border-slate-200 text-slate-700 font-semibold px-8 py-4 rounded-xl hover:border-indigo-300 hover:text-indigo-600 transition-colors text-center"
            >
              Get in Touch
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-300"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  )
}
