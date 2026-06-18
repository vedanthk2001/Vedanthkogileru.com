'use client'

import { motion } from 'framer-motion'

const timeline = [
  {
    initials: 'IG',
    color: 'bg-violet-600',
    company: 'Ignosis',
    role: 'Product Manager — Voice AI',
    period: 'Mar 2026 – Present',
    impact: 'Building a proprietary voice AI platform — orchestrating LLM, STT and TTS providers into natural, real-time financial conversations.',
  },
  {
    initials: 'CS',
    color: 'bg-indigo-600',
    company: 'CASHe',
    role: 'Associate Product Manager',
    period: 'Apr 2025 – Mar 2026',
    impact: 'Founding PM on Karat Wealth (FD) and KaratClub (MF rewards). Led a 14-person team from wireframes to launch. +74% user-to-investor conversion.',
  },
  {
    initials: 'CS',
    color: 'bg-sky-500',
    company: 'CASHe',
    role: 'Product Analyst',
    period: 'Jul 2024 – Mar 2025',
    impact: 'Shipped repayment tracking, fuzzy-logic bank verification, and A/B-tested segments — cutting queries by 70% and lifting lead conversion by 57%.',
  },
  {
    initials: 'CS',
    color: 'bg-teal-500',
    company: 'CASHe',
    role: 'Product Management Intern',
    period: 'Jul 2023 – Jun 2024',
    impact: 'Built the complete analytics suite (Python, SQL, Power BI) for the 13Karat P2P platform. Automated ops workflows, cutting customer TAT by 50%.',
  },
]

const education = {
  degree: 'BE Electrical & Electronics + MSc Physics',
  minor: 'Minor in Finance',
  school: 'BITS Pilani, Hyderabad',
  period: '2019 – 2024',
  cgpa: '8.26',
}

export default function Experience() {
  return (
    <section id="experience" className="bg-white py-24 px-6 md:px-12">
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
          <h2 className="text-4xl font-bold text-slate-900">Experience</h2>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-16">

          {/* Timeline */}
          <div className="lg:col-span-2 relative">
            {/* Vertical connector line */}
            <div className="absolute left-5 top-6 bottom-6 w-px bg-slate-100" />

            <div className="space-y-10">
              {timeline.map((job, i) => (
                <motion.div
                  key={i}
                  className="relative flex gap-6"
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.55, delay: i * 0.1 }}
                >
                  {/* Company avatar */}
                  <div className={`relative z-10 w-10 h-10 rounded-xl ${job.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <span className="text-white text-xs font-bold tracking-wide">{job.initials}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-3">
                      <div>
                        <p className="font-bold text-slate-900 text-lg leading-tight">{job.company}</p>
                        <p className="text-indigo-600 text-sm font-medium">{job.role}</p>
                      </div>
                      <span className="text-slate-400 text-sm whitespace-nowrap">{job.period}</span>
                    </div>
                    <p className="text-slate-500 leading-relaxed">{job.impact}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Education + toolkit */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-5">Education</p>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8">
                <p className="font-bold text-slate-900 leading-snug">{education.degree}</p>
                <p className="text-indigo-600 text-sm font-medium mt-1">{education.minor}</p>
                <p className="text-slate-400 text-sm mt-3">{education.school} · {education.period}</p>
                <div className="mt-4 inline-flex items-center gap-2 bg-indigo-50 rounded-lg px-3 py-1.5">
                  <span className="text-indigo-600 font-bold text-sm">CGPA {education.cgpa}</span>
                </div>
              </div>

              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-5">Toolkit</p>
              <div className="space-y-4">
                {[
                  { label: 'Data', items: ['Python', 'SQL', 'Power BI', 'Excel'] },
                  { label: 'Product', items: ['UX Research', 'Wireframing', 'A/B Testing', 'Analytics'] },
                  { label: 'Domain', items: ['Fintech', 'P2P', 'Fixed Deposits', 'Mutual Funds', 'Voice AI'] },
                ].map(group => (
                  <div key={group.label}>
                    <p className="text-xs text-slate-400 mb-2">{group.label}</p>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map(item => (
                        <span key={item} className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
