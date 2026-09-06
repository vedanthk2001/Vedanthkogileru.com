'use client'

import { motion } from 'framer-motion'

type Interest = {
  icon: string
  title: string
  description: string
  /** Optional photo. Cards without one keep the emoji at full size. */
  image?: { src: string; w: number; h: number }
  /** Optional outbound link. The whole card becomes clickable when set. */
  href?: string
}

const interests: Interest[] = [
  {
    icon: '🧗',
    title: 'Rock Climbing',
    description: 'Reading the wall, committing to the move. Problem-solving with consequences.',
    image: { src: '/img/climbing.jpg', w: 900, h: 600 },
  },
  {
    icon: '♟️',
    title: 'Chess',
    description: 'Thinking several moves ahead and adapting when the board changes.',
    href: 'https://www.chess.com/member/vedanthkogileru/stats/rapid?time=0',
    image: { src: '/img/chess.jpg', w: 900, h: 600 },
  },
  {
    icon: '🎱',
    title: 'Snooker',
    description: 'Precision, patience, and playing position for the shot after this one.',
    image: { src: '/img/snooker.jpg', w: 900, h: 600 },
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

        <div className="grid sm:grid-cols-2 gap-6">
          {interests.map((interest, i) => (
            <motion.div
              key={interest.title}
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="relative bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-indigo-200 hover:shadow-sm transition-colors"
            >
              {interest.image ? (
                <img
                  src={interest.image.src}
                  alt={interest.title}
                  width={interest.image.w}
                  height={interest.image.h}
                  loading="lazy"
                  className="w-full aspect-[3/2] object-cover rounded-xl mb-5 bg-white border border-slate-100"
                />
              ) : (
                // Same 3:2 block as a photo, so a mixed row of photo and
                // emoji cards keeps one rhythm instead of leaving dead space.
                <span className="w-full aspect-[3/2] mb-5 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-6xl">
                  {interest.icon}
                </span>
              )}
              <h3 className="font-semibold text-slate-900 text-lg mb-2">{interest.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{interest.description}</p>
              {interest.href && (
                <>
                  <svg
                    className="absolute top-5 right-5 w-4 h-4 text-slate-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5h5m0 0v5m0-5L10 14M9 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-3" />
                  </svg>
                  {/* Stretched link: keeps the card a single hit target without
                      nesting an anchor around the motion wrapper. */}
                  <a
                    href={interest.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    <span className="sr-only">{interest.title} — view profile</span>
                  </a>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
