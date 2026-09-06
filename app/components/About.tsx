'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { LINKS } from '../links'

/** Renders the channel name as a link once a URL exists, plain text until then. */
function Teenvesting() {
  const cls =
    'text-indigo-600 hover:text-indigo-700 underline underline-offset-4 decoration-indigo-200 hover:decoration-indigo-400 transition-colors'
  return LINKS.teenvesting ? (
    <a href={LINKS.teenvesting} target="_blank" rel="noopener noreferrer" className={cls}>
      Teenvesting
    </a>
  ) : (
    <span className="text-slate-700 font-medium">Teenvesting</span>
  )
}

type Chapter = {
  number: string
  label: string
  headline: string
  body: ReactNode
  /** Optional — the earliest chapter has no metric, and inventing one would show. */
  stat?: { value: string; label: string }
  /** Optional photo, shown in the column the stat would otherwise occupy.
   *  w/h are the real pixel dimensions — the browser derives the aspect ratio
   *  from them and reserves the space, so nothing is cropped and nothing shifts. */
  image?: { src: string; alt: string; caption: string; w: number; h: number }
}

const chapters: Chapter[] = [
  {
    number: '01',
    label: 'Early Days',
    headline: 'Born and brought up in Hyderabad.',
    body: (
      <>
        School at Vidyaranya, most of which I spent on a football pitch, a badminton
        court or at a table tennis table. The rest went on physics &mdash; the only
        subject that felt like taking something apart to find out why it worked.
        Sport and physics turned out to be the same instinct: read the situation,
        find the mechanism, adjust. Both are still running.
      </>
    ),
    image: {
      src: '/img/vidyaranya.jpg',
      alt: 'Vidyaranya High School, Hyderabad',
      caption: 'Vidyaranya High School, Hyderabad',
      w: 640,
      h: 480,
    },
  },
  {
    number: '02',
    label: 'College',
    headline: 'Fell in love with personal finance in my college days.',
    body: (
      <>
        BITS Pilani, Hyderabad, 2019 to 2024 &mdash; where the physics carried over
        and finance arrived. Electrical engineering, a master&apos;s in physics and a
        minor in finance, graduating at 8.26: a combination I picked precisely because
        I could not choose between them. What tied them together was reading Buffett,
        Munger, Peter Lynch and Howard Marks &mdash; investing as clear thinking under
        uncertainty, not a spreadsheet exercise. So I started{' '}
        <Teenvesting />, explaining it to people my own age. Partnered with Groww.
        100K+ impressions, and proof that young Indians were hungry for it.
      </>
    ),
    stat: { value: '100K+', label: 'impressions' },
    image: {
      src: '/img/bits.jpg',
      alt: 'At the BITS Pilani crest, Hyderabad campus',
      caption: 'BITS Pilani, Hyderabad campus',
      w: 640,
      h: 853,
    },
  },
  {
    number: '03',
    label: 'The Builder',
    headline: 'Then I built the products they would actually invest through.',
    body: 'At CASHe I went from intern to Founding PM. Twice over. I built a P2P lending platform, then took Karat Wealth (FD) and KaratClub (MF rewards) from first wireframes to production apps. Along the way I built the analytics infrastructure the whole team ran on.',
    stat: { value: '2', label: 'products as Founding PM' },
  },
  {
    number: '04',
    label: 'The AI',
    headline: 'Now I\'m building the AI behind financial conversations.',
    body: "At Ignosis I work on voice AI. Orchestrating LLM, STT and TTS providers into natural conversations. The mission hasn't changed. The medium is now your voice.",
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
          <span className="text-indigo-600">accessible</span>. First by educating,
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
              <div className={`md:col-span-3 ${ch.image ? '' : 'md:text-right'}`}>
                {ch.image && (
                  <figure className="mb-6">
                    <img
                      src={ch.image.src}
                      alt={ch.image.alt}
                      width={ch.image.w}
                      height={ch.image.h}
                      loading="lazy"
                      className="w-full h-auto rounded-2xl border border-slate-200"
                    />
                    <figcaption className="text-xs text-slate-400 mt-2 leading-relaxed">
                      {ch.image.caption}
                    </figcaption>
                  </figure>
                )}
                {ch.stat && (
                  <>
                    <p className="text-5xl font-bold text-indigo-600">{ch.stat.value}</p>
                    <p className="text-sm text-slate-400 mt-1">{ch.stat.label}</p>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
