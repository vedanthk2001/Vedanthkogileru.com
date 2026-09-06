'use client'

import { motion } from 'framer-motion'

const interests = [
  {
    icon: '🧗',
    title: 'Rock Climbing',
    description: 'Reading the wall, committing to the move. Problem-solving with consequences.',
  },
  {
    icon: '♟️',
    title: 'Chess',
    description: 'Thinking several moves ahead and adapting when the board changes.',
  },
  {
    icon: '🎱',
    title: 'Snooker',
    description: 'Precision, patience, and playing position for the shot after this one.',
  },
  {
    icon: '📈',
    title: 'Equity Research',
    description: 'The fintech obsession, off the clock. Digging into businesses and markets.',
  },
]

export default function Interests() {
  return (
    <section id="interests" className="bg-white py-20 px-6 md:px-12 border-t border-slate-100">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <p className="text-indigo-600 font-medium text-sm tracking-widest uppercase mb-3">
            Off the Clock
          </p>
          <h2 className="text-4xl font-bold text-slate-900">Beyond Product</h2>
          <p className="text-slate-500 mt-3 text-lg max-w-xl">
            The games and pursuits that keep me sharp. Most of them reward the same
            patience and strategy that good product work does.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {interests.map((interest, i) => (
            <motion.div
              key={interest.title}
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-indigo-200 hover:shadow-sm transition-colors"
            >
              <span className="text-3xl mb-4 block">{interest.icon}</span>
              <h3 className="font-semibold text-slate-900 mb-2">{interest.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{interest.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
