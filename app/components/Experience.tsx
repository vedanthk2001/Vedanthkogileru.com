const workExperience = [
  {
    role: 'Product Manager',
    company: 'Company Name',
    period: '2023 – Present',
    description:
      'Led product strategy for [core product area]. Managed roadmap for [X] features, drove cross-functional alignment across [teams], and delivered [key outcome].',
    achievements: [
      'Shipped [Feature] → drove X% improvement in [metric]',
      'Defined and executed [initiative] strategy with [stakeholders]',
      'Reduced [pain point] by X% through [approach]',
    ],
  },
  {
    role: 'Associate Product Manager',
    company: 'Company Name',
    period: '2021 – 2023',
    description:
      'Owned [product area] from ideation through launch. Collaborated closely with engineering and design to define requirements and ship high-quality features on a regular cadence.',
    achievements: [
      'Launched [Feature] — [X]k users in first month',
      'Ran [X] A/B experiments; improved [metric] by [Y]%',
      'Built [tool/process] to streamline [workflow]',
    ],
  },
  {
    role: 'Product / Business Intern',
    company: 'Company Name',
    period: '2020',
    description:
      'Supported product and strategy initiatives. Conducted competitive analysis, synthesized user feedback, and contributed to roadmap planning.',
    achievements: [
      'Delivered [project] used by [team/stakeholders]',
      'Analyzed [X]k data points to inform [decision]',
    ],
  },
]

const education = [
  {
    degree: 'B.S. / B.A. in [Your Major]',
    school: 'University Name',
    period: '2017 – 2021',
    detail: 'Relevant coursework: [Course 1], [Course 2], [Course 3]',
  },
]

export default function Experience() {
  return (
    <section id="experience" className="bg-slate-50 py-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-14">
          <p className="text-indigo-600 font-medium text-sm tracking-widest uppercase mb-3">
            Background
          </p>
          <h2 className="text-4xl font-bold text-slate-900">Experience</h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Work timeline */}
          <div className="lg:col-span-2 space-y-8">
            {workExperience.map((job, i) => (
              <div key={i} className="relative pl-8 border-l-2 border-slate-200">
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-indigo-600 border-2 border-white" />
                <div className="bg-white rounded-2xl p-6 border border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-3">
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{job.role}</h3>
                      <p className="text-indigo-600 font-medium text-sm">{job.company}</p>
                    </div>
                    <span className="text-slate-400 text-sm font-medium whitespace-nowrap">
                      {job.period}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {job.description}
                  </p>
                  <ul className="space-y-1.5">
                    {job.achievements.map((a, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="text-indigo-400 mt-0.5 flex-shrink-0">▸</span>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Education sidebar */}
          <div>
            <h3 className="font-bold text-slate-900 text-lg mb-4">Education</h3>
            <div className="space-y-4">
              {education.map((edu, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 border border-slate-200"
                >
                  <p className="font-semibold text-slate-900">{edu.degree}</p>
                  <p className="text-indigo-600 text-sm font-medium mt-1">{edu.school}</p>
                  <p className="text-slate-400 text-sm mt-1">{edu.period}</p>
                  <p className="text-slate-500 text-sm mt-3">{edu.detail}</p>
                </div>
              ))}
            </div>

            {/* Skills */}
            <h3 className="font-bold text-slate-900 text-lg mt-8 mb-4">Toolkit</h3>
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              {[
                { category: 'Product', items: ['Roadmapping', 'User Research', 'A/B Testing', 'PRDs'] },
                { category: 'Tools', items: ['Figma', 'Jira', 'Amplitude', 'SQL', 'Notion'] },
                { category: 'Methods', items: ['Agile/Scrum', 'Jobs-to-be-Done', 'Design Sprints'] },
              ].map((group) => (
                <div key={group.category} className="mb-4 last:mb-0">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    {group.category}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
