'use client'

import { motion } from 'framer-motion'

const projects = [
  {
    number: '01',
    title: 'Karat Wealth',
    company: 'CASHe · Founding PM',
    category: 'Fixed Deposits · 0→1',
    headline: 'Took a blank canvas to a production FD platform with a team of 14.',
    body: 'Integrated with Upswing for partner-bank sourcing. Designed and launched the app, web journey, and website. Built the analytics suite that ran daily ops. Ran automated Push, SMS and WhatsApp campaigns by user-journey stage.',
    metric: { value: '+74%', label: 'user-to-investor conversion' },
    tags: ['0-to-1', 'Lifecycle Marketing', 'Analytics'],
    featured: true,
  },
  {
    number: '02',
    title: 'KaratClub',
    company: 'CASHe · Founding PM',
    category: 'Mutual Funds · Rewards',
    headline: "India's first portfolio-powered privilege program.",
    body: 'Wireframes to production app. MF investors with ₹5L+ portfolios unlock lifestyle rewards across phones, travel and dining at members-only rates.',
    metric: { value: '1st', label: 'of its kind in India' },
    tags: ['Mutual Funds', 'Rewards', 'Product Strategy'],
    featured: false,
  },
  {
    number: '03',
    title: '13Karat',
    company: 'CASHe · Analyst → APM',
    category: 'P2P Lending · Data',
    headline: 'Built the data layer the platform ran on.',
    body: 'Complete analytics suite in Python, SQL and Power BI. Shipped repayment tracking and fuzzy-logic bank verification.',
    metric: { value: '-70%', label: 'customer queries' },
    tags: ['P2P Lending', 'Data', 'A/B Testing'],
    featured: false,
  },
  {
    number: '04',
    title: 'Teenvesting',
    company: 'Independent · Founder',
    category: 'Content · Financial Literacy',
    headline: 'Where the whole mission started. Teaching young Indians to invest.',
    body: 'A YouTube channel and Instagram page built in college. Partnered with Groww for influencer marketing. 100K+ impressions, 5%+ CTR.',
    metric: { value: '100K+', label: 'impressions' },
    tags: ['Content', '0-to-1', 'Growth'],
    featured: false,
  },
]

export default function Projects() {
  const [featured, ...rest] = projects

  return (
    <section id="projects" className="bg-slate-50 py-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">

        {/* Section header */}
        <motion.div
          className="mb-16 flex items-end justify-between"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <p className="text-indigo-600 font-medium text-sm tracking-widest uppercase mb-2">
              Selected Work
            </p>
            <h2 className="text-4xl font-bold text-slate-900">What I&apos;ve Built</h2>
          </div>
          <p className="text-slate-300 text-7xl font-bold leading-none select-none">
            {String(projects.length).padStart(2, '0')}
          </p>
        </motion.div>

        {/* Featured project */}
        <motion.div
          className="bg-white rounded-3xl p-8 md:p-12 mb-6 border border-slate-200 hover:border-indigo-200 hover:shadow-lg transition-all"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          whileHover={{ y: -4 }}
        >
          <div className="grid md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl font-bold text-slate-100 leading-none">{featured.number}</span>
                <span className="text-xs font-semibold text-indigo-500 uppercase tracking-widest">{featured.category}</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{featured.title}</h3>
              <p className="text-indigo-600 text-sm font-medium mb-6">{featured.company}</p>
              <p className="text-xl text-slate-700 font-medium leading-snug mb-4">{featured.headline}</p>
              <p className="text-slate-500 leading-relaxed mb-8">{featured.body}</p>
              <div className="flex flex-wrap gap-2">
                {featured.tags.map(t => (
                  <span key={t} className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full">{t}</span>
                ))}
              </div>
            </div>
            <div className="md:col-span-4 md:text-right">
              <div className="bg-indigo-50 rounded-2xl p-8 inline-block w-full">
                <p className="text-5xl md:text-6xl font-bold text-indigo-600">{featured.metric.value}</p>
                <p className="text-slate-500 text-sm mt-2">{featured.metric.label}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Remaining projects grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {rest.map((p, i) => (
            <motion.div
              key={p.number}
              className="bg-white rounded-2xl p-7 border border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all flex flex-col"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="text-3xl font-bold text-slate-100 leading-none">{p.number}</span>
                <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">{p.category}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">{p.title}</h3>
              <p className="text-indigo-600 text-xs font-medium mb-4">{p.company}</p>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">{p.body}</p>
              <div className="border-t border-slate-100 pt-4 flex items-end justify-between">
                <div className="flex flex-wrap gap-2">
                  {p.tags.slice(0, 2).map(t => (
                    <span key={t} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">{t}</span>
                  ))}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-indigo-600">{p.metric.value}</p>
                  <p className="text-xs text-slate-400">{p.metric.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
