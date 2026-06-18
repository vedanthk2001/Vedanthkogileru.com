const projects = [
  {
    tag: 'Growth · Mobile',
    title: 'Project Name One',
    company: 'Company Name',
    description:
      'Led end-to-end product development for [feature/product]. Identified a core user pain point through qualitative research, defined the solution, and partnered with engineering to ship in 6 weeks.',
    metrics: [
      { value: '40%', label: 'increase in activation' },
      { value: '2x', label: 'daily active users' },
    ],
    tags: ['User Research', 'Roadmapping', 'A/B Testing'],
    link: '#',
  },
  {
    tag: 'Platform · API',
    title: 'Project Name Two',
    company: 'Company Name',
    description:
      'Owned the roadmap for a developer-facing platform used by [X]+ enterprise clients. Prioritized a self-serve onboarding flow that reduced support tickets and shortened time-to-value for new customers.',
    metrics: [
      { value: '60%', label: 'drop in onboarding time' },
      { value: '$2M', label: 'in unlocked pipeline' },
    ],
    tags: ['B2B', 'Developer Tools', 'Stakeholder Management'],
    link: '#',
  },
  {
    tag: '0→1 · AI',
    title: 'Project Name Three',
    company: 'Company Name',
    description:
      'Launched a new AI-powered [feature/product] from concept to GA in [timeframe]. Ran continuous discovery with [X] customer interviews, built an MVP with a 3-person team, and iterated to PMF.',
    metrics: [
      { value: '92%', label: 'user satisfaction (CSAT)' },
      { value: '3 mo', label: 'to product-market fit' },
    ],
    tags: ['AI/ML', '0-to-1', 'Product Discovery'],
    link: '#',
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
            A few projects I&apos;m proud of. Details available on request.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
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
