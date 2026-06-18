'use client'

import { motion } from 'framer-motion'

const chapters = [
  {
    number: '01',
    label: 'The Beginning',
    headline: 'Started a YouTube channel to teach kids how to invest.',
    body: 'Before building products, I was teaching. Teenvesting was a financial literacy channel I built in college — partnered with Groww, racked up 100K+ impressions, and proved that young Indians were hungry for this. The mission was set.',
    stat: { value: '100K+', label: 'impressions' },
  },
  {
    number: '02',
    label: 'The Builder',
    headline: 'Then I built the products they would actually invest through.',
    body: 'At CASHe I went from intern to Founding PM — twice over. I built a P2P lending platform, then took Karat Wealth (FD) and KaratClub (MF rewards) from first wireframes to production apps. Along the way I built the analytics infrastructure the whole team ran on.',
    stat: { value: '2', label: 'products as Founding PM' },
  },
  {
    number: '03',
    label: 'The AI',
    headline: 'Now I\'m building the AI behind financial conversations.',
    body: "At Ignosis I work on voice AI — orchestrating LLM, STT and TTS providers into natural conversations. The mission hasn't changed. The medium is now your voice.",
    stat: { value: '0→1', label: 'again, in AI' },
  },
]

export default function About() {
  return (
    <section id="about" className="bg-white py-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">

        {/* Opening statement */}
        <motion.p
          className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight max-w-4xl mb-24"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
        >
          I&apos;ve spent my entire career making investing{' '}
          <span className="text-indigo-600">accessible</span> — first by educating,
          then by building, now by giving it a voice.
        </motion.p>

        {/* Three chapters */}
        <div className="space-y-20">
          {chapters.map((ch, i) => (
            <motion.div
              key={ch.number}
              className="grid md:grid-cols-12 gap-8 items-start"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.65, delay: 0.05 }}
            >
              {/* Chapter number + label */}
              <div className="md:col-span-2">
                <p className="text-7xl font-bold text-slate-100 leading-none select-none">
                  {ch.number}
                </p>
                <p className="text-xs font-semibold text-indigo-500 uppercase tracking-widest mt-2">
                  {ch.label}
                </p>
              </div>

              {/* Content */}
              <div className="md:col-span-7">
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 leading-snug mb-4">
                  {ch.headline}
                </h3>
                <p className="text-slate-500 text-lg leading-relaxed">
                  {ch.body}
                </p>
              </div>

              {/* Stat */}
              <div className="md:col-span-3 md:text-right">
                <p className="text-5xl font-bold text-indigo-600">{ch.stat.value}</p>
                <p className="text-sm text-slate-400 mt-1">{ch.stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
