const projects = [
  {
    tag: '0→1 · Fixed Deposits',
    title: 'Karat Wealth',
    company: 'CASHe · Founding PM',
    description:
      'A digital Fixed Deposit investment platform integrated with Upswing for partner-bank sourcing. Led a 14-person team to design, build, and launch the app, web journey, and website — plus the analytics suite that powered daily operations.',
    metrics: [
      { value: '+74%', label: 'user-to-investor conversion' },
      { value: '14', label: 'person team led' },
    ],
    tags: ['0-to-1', 'Lifecycle Marketing', 'Analytics', 'Roadmapping'],
  },
  {
    tag: 'Rewards · Mutual Funds',
    title: 'KaratClub',
    company: 'CASHe · Founding PM',
    description:
      'India’s first portfolio-powered privilege program for mutual-fund investors. I brought it to life as Founding PM — from the first wireframes all the way to a production app — where larger MF portfolios unlock real-world lifestyle rewards across smartphones, travel, and dining.',
    metrics: [
      { value: '1st', label: 'of its kind in India' },
      { value: '0→1', label: 'wireframes to production' },
    ],
    tags: ['Mutual Funds', 'Rewards', 'Membership', 'Product Strategy'],
  },
  {
    tag: 'P2P · Analytics',
    title: '13Karat',
    company: 'CASHe · Analyst → APM',
    description:
      'A P2P investment platform where I built the complete analytics suite (Python, SQL, Power BI) across onboarding, investing, and withdrawals. Shipped repayment tracking and fuzzy-logic bank verification that cut customer friction sharply.',
    metrics: [
      { value: '+57%', label: 'lead-to-investor conversion' },
      { value: '-70%', label: 'customer queries' },
    ],
    tags: ['P2P Lending', 'Data', 'A/B Testing', 'Automation'],
  },
  {
    tag: 'Founder · Content',
    title: 'Teenvesting',
    company: 'Independent · Founder',
    description:
      'A YouTube channel and Instagram page to improve financial literacy among young Indians — where the whole mission began. Partnered with Groww for influencer marketing and grew real reach from a standing start.',
    metrics: [
      { value: '100K+', label: 'impressions' },
      { value: '5%+', label: 'click-through rate' },
    ],
    tags: ['Content', 'Financial Literacy', 'Growth', '0-to-1'],
  },
]

export default function Projects() {
  return (
    <section id="projects" className="bg-white py-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-14">
          <p className="text-indigo-600 font-medium text-sm tracking-widest uppercase mb-3">
            Case Studies
          </p>
          <h2 className="text-4xl font-bold text-slate-900">Selected Work</h2>
          <p className="text-slate-500 mt-3 text-lg max-w-xl">
            Products I&apos;ve built across the Indian investing stack. Deeper
            walkthroughs available on request.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.title}
              className="group border border-slate-200 rounded-2xl p-7 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col"
            >
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-3">
                {project.tag}
              </p>
              <h3 className="text-xl font-bold text-slate-900 mb-1">{project.title}</h3>
              <p className="text-sm text-slate-400 mb-4">{project.company}</p>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">
                {project.description}
              </p>

              <div className="flex gap-4 mb-6">
                {project.metrics.map((m) => (
                  <div key={m.label} className="bg-indigo-50 rounded-xl px-4 py-3 flex-1">
                    <p className="text-2xl font-bold text-indigo-600">{m.value}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{m.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
