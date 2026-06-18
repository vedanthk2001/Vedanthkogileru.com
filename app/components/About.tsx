const strengths = [
  {
    icon: '🧮',
    title: 'Engineer + Physicist',
    description:
      'EE and MSc Physics from BITS Pilani. I think in systems and reason from first principles.',
  },
  {
    icon: '💰',
    title: 'Fintech to the core',
    description:
      'A finance minor and a genuine obsession with how money moves — P2P lending, FDs, mutual funds, and beyond.',
  },
  {
    icon: '🚀',
    title: '0→1 builder',
    description:
      'Founding PM twice over. Comfortable in ambiguity, turning a blank canvas into a shipped product.',
  },
  {
    icon: '📊',
    title: 'Data-native PM',
    description:
      'I don’t just use analytics — I build the analytics suites my own teams run on. Python, SQL, Power BI.',
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
              Making investing accessible &mdash; one product at a time.
            </h2>
            <div className="space-y-4 text-slate-600 text-lg leading-relaxed">
              <p>
                I&apos;m a Product Manager who&apos;s heads-over-heels into fintech.
                My mission has stayed constant while the surface area keeps growing:
                make investing accessible and rewarding for Indians.
              </p>
              <p>
                It started in college with{' '}
                <span className="font-medium text-slate-800">Teenvesting</span>, a
                financial-literacy channel for young people. Then I went deeper &mdash;
                building the platforms people actually invest through at{' '}
                <span className="font-medium text-slate-800">CASHe</span>: a P2P
                lending product, a digital Fixed Deposit platform, and a mutual-fund
                rewards club, all as Founding PM.
              </p>
              <p>
                Today I&apos;m an{' '}
                <span className="font-medium text-slate-800">AI Product Manager at Ignosis</span>,
                working on voice AI &mdash; orchestrating LLM, speech-to-text, and
                text-to-speech providers into natural conversations. The mission is
                the same; the medium is now your voice.
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
