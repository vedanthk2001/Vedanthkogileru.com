'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { LINKS } from '../links'

/**
 * Product logo slot. Renders nothing while `src` is empty and removes itself if
 * the file 404s, so a missing asset can never leave a broken image on the page.
 * Marks are desaturated so several brand palettes sit inside the slate/indigo
 * system instead of fighting it. Drop transparent SVG/PNG into public/logos/.
 */
function ProductLogo({ src, name }: { src: string; name: string }) {
  if (!src) return null
  return (
    <img
      src={src}
      alt={`${name} logo`}
      className="h-6 w-auto object-contain rounded grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all"
      loading="lazy"
      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
    />
  )
}

function Teenvesting() {
  const cls =
    'text-indigo-600 hover:text-indigo-700 underline underline-offset-4 decoration-indigo-200 hover:decoration-indigo-400 transition-colors'
  return LINKS.teenvesting ? (
    <a href={LINKS.teenvesting} target="_blank" rel="noopener noreferrer" className={cls}>
      the channel
    </a>
  ) : (
    <span className="text-slate-700 font-medium">the channel</span>
  )
}

type Piece = {
  name: string
  kind: string
  logo: string
  body: ReactNode
  metric: { value: string; label: string }
}

type Era = {
  initials: string
  color: string
  company: string
  role: string
  period: string
  summary: string
  pieces: Piece[]
}

const eras: Era[] = [
  {
    initials: 'IG',
    color: 'bg-violet-600',
    company: 'Ignosis',
    role: 'Product Manager, Voice AI',
    period: 'Mar 2026 to Present',
    summary: 'Building the orchestration layer underneath real-time financial conversations.',
    pieces: [
      {
        name: 'Voice AI Platform',
        kind: 'LLM · STT · TTS orchestration',
        logo: '',
        body: 'Ignosis built its own voice stack rather than buying one, so the work runs the full depth of it — provider selection across LLM, speech-to-text and text-to-speech, latency budgets tight enough to hold a natural conversation, and the orchestration that stitches the three layers together.',
        metric: { value: '0→1', label: 'again, in AI' },
      },
    ],
  },
  {
    initials: 'CS',
    color: 'bg-indigo-600',
    company: 'CASHe',
    role: 'Intern → Product Analyst → Associate PM',
    period: 'Jul 2023 to Mar 2026',
    summary: 'Two and a half years, three roles, three products — from building the data layer to founding PM on two launches.',
    pieces: [
      {
        name: '13Karat',
        kind: 'P2P Lending',
        logo: '',
        body: 'A peer-to-peer lending platform putting retail investors directly opposite borrowers. I was on it from the day it went live through to ₹100Cr. Built the complete analytics suite in Python, SQL and Power BI across onboarding, investing and withdrawals, shipped repayment tracking that cut customer queries by 70%, and replaced brittle name matching with fuzzy logic to cut bank-verification failures by 40%.',
        metric: { value: '₹100Cr', label: 'scaled to, from launch' },
      },
      {
        name: 'Karat Wealth',
        kind: 'Fixed Deposits · Mutual Funds',
        logo: '',
        body: 'Founding PM. The platform repositioned onto regulated fixed income — FDs, RDs and bonds sourced from partner banks through Upswing. Led a team of 14 from wireframes to launch across the app, the web journey and the website, then built the analytics suite that ran daily ops and the lifecycle campaigns that fed it.',
        metric: { value: '+74%', label: 'user-to-investor conversion' },
      },
      {
        name: 'KaratClub',
        kind: 'MF Privilege Platform',
        logo: '',
        body: "Founding PM. India's first portfolio-powered privilege programme: a ₹5L+ mutual fund portfolio unlocks member-only rates on phones, travel and dining — without selling a single unit. Wireframes through to a production app.",
        metric: { value: '1st', label: 'of its kind in India' },
      },
    ],
  },
  {
    initials: 'TV',
    color: 'bg-sky-500',
    company: 'Teenvesting',
    role: 'Founder',
    period: 'Jun 2020 to Sep 2022',
    summary: 'The first 0→1. Solo, during college.',
    pieces: [
      {
        name: 'Teenvesting',
        kind: 'YouTube · Financial Literacy',
        logo: '',
        body: (
          <>
            Financial literacy for teenagers, on YouTube and Instagram &mdash;
            explaining investing to people my own age at a point when almost nobody
            was. Partnered with Groww for influencer marketing. 100K+ impressions,
            12,500+ views and a 5%+ click-through rate, and the reason everything
            after it happened. Still up: <Teenvesting />.
          </>
        ),
        metric: { value: '100K+', label: 'impressions' },
      },
    ],
  },
]

export default function Work() {
  return (
    <section id="work" className="bg-white py-24 px-6 md:px-12">
      {/* Old anchors kept alive so previously shared links still land here. */}
      <span id="experience" className="block relative -top-20" aria-hidden="true" />
      <span id="projects" className="block relative -top-20" aria-hidden="true" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-indigo-600 font-medium text-sm tracking-widest uppercase mb-2">
            The Journey
          </p>
          <h2 className="text-4xl font-bold text-slate-900">Work</h2>
        </motion.div>

        <div className="max-w-3xl">
          <div className="relative">
            <div className="absolute left-5 top-6 bottom-6 w-px bg-slate-100" />

            <div className="space-y-14">
              {eras.map((era, i) => (
                <motion.div
                  key={era.company}
                  className="relative flex gap-6"
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.55, delay: i * 0.08 }}
                >
                  <div className={`relative z-10 w-10 h-10 rounded-xl ${era.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <span className="text-white text-xs font-bold tracking-wide">{era.initials}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-2">
                      <div>
                        <p className="font-bold text-slate-900 text-lg leading-tight">{era.company}</p>
                        <p className="text-indigo-600 text-sm font-medium">{era.role}</p>
                      </div>
                      <span className="text-slate-400 text-sm whitespace-nowrap">{era.period}</span>
                    </div>
                    <p className="text-slate-500 leading-relaxed mb-6">{era.summary}</p>

                    {/* The pieces of work inside this era */}
                    <div className="space-y-4">
                      {era.pieces.map((p) => (
                        <div
                          key={p.name}
                          className="border-l-2 border-slate-100 hover:border-indigo-200 pl-5 py-1 transition-colors"
                        >
                          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mb-1">
                            <ProductLogo src={p.logo} name={p.name} />
                            <h3 className="font-bold text-slate-900">{p.name}</h3>
                            <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">
                              {p.kind}
                            </span>
                          </div>
                          <p className="text-slate-500 text-sm leading-relaxed mb-3">{p.body}</p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-bold text-indigo-600">{p.metric.value}</span>
                            <span className="text-xs text-slate-400">{p.metric.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
