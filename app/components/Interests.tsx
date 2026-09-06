'use client'

import { motion } from 'framer-motion'

type Interest = {
  icon: string
  title: string
  description: string
  /** Optional photo. Cards without one keep the emoji at full size. */
  image?: { src: string; w: number; h: number }
}

const interests: Interest[] = [
  {
    icon: '🧗',
    title: 'Rock Climbing',
    description: 'Reading the wall, committing to the move. Problem-solving with consequences.',
    image: { src: '/img/climbing.jpg', w: 640, h: 853 },
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
    image: { src: '/img/snooker.jpg', w: 800, h: 600 },
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
              {interest.image ? (
                <img
                  src={interest.image.src}
                  alt={interest.title}
                  width={interest.image.w}
                  height={interest.image.h}
                  loading="lazy"
                  className="w-full h-32 object-cover rounded-xl mb-4"
                />
              ) : (
                // Same 8rem block as a photo, so a mixed row of photo and
                // emoji cards keeps one rhythm instead of leaving dead space.
                <span className="w-full h-32 mb-4 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-4xl">
                  {interest.icon}
                </span>
              )}
              <h3 className="font-semibold text-slate-900 mb-2">{interest.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{interest.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
