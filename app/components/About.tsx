const strengths = [
  {
    icon: '🔍',
    title: 'Discovery',
    description: 'Deep user research and data analysis to uncover the right problems worth solving.',
  },
  {
    icon: '🎯',
    title: 'Strategy',
    description: 'Translating business goals into clear product vision, roadmaps, and prioritized bets.',
  },
  {
    icon: '🤝',
    title: 'Execution',
    description: 'Working across engineering, design, and stakeholders to ship fast and iterate faster.',
  },
  {
    icon: '📊',
    title: 'Metrics',
    description: 'Defining success clearly and using data to make confident product decisions.',
  },
]

export default function About() {
  return (
    <section id="about" className="bg-slate-50 py-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-indigo-600 font-medium text-sm tracking-widest uppercase mb-3">
              About Me
            </p>
            <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
              Building products is both a craft and a discipline.
            </h2>
            <div className="space-y-4 text-slate-600 text-lg leading-relaxed">
              <p>
                I&apos;m a Product Manager with experience across [industry/domain]. I
                specialize in taking products from 0→1 and scaling them — combining
                structured thinking with a strong bias for action.
              </p>
              <p>
                My background in [your background — e.g., engineering/business/design]
                gives me a unique lens: I can dive deep into technical constraints, speak
                the language of design, and anchor every decision to business outcomes.
              </p>
              <p>
                Outside of work, I&apos;m passionate about [your interests — e.g., consumer
                tech, AI, fitness, etc.].
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {strengths.map((s) => (
              <div
                key={s.title}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-200 hover:shadow-sm transition-all"
              >
                <span className="text-2xl mb-3 block">{s.icon}</span>
                <h3 className="font-semibold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
