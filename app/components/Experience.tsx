const workExperience = [
  {
    role: 'Product Manager (AI / Voice AI)',
    company: 'Ignosis',
    period: 'Mar 2026 – Present',
    description:
      'AI Product Manager working on voice AI. Ignosis built its own voice platform — orchestrating LLM, speech-to-text, and text-to-speech providers into natural, real-time conversations.',
    achievements: [
      'Own product for a voice AI stack spanning STT, LLM, and TTS orchestration',
      'Translate cutting-edge AI capability into reliable, real-world conversation products',
    ],
  },
  {
    role: 'Associate Product Manager',
    company: 'CASHe',
    period: 'Apr 2025 – Mar 2026',
    description:
      'Founding PM of Karat Wealth (digital Fixed Deposits) and KaratClub (MF rewards). Led a 14-person team across app, web, and website, and built the analytics that ran daily operations.',
    achievements: [
      'Launched Karat Wealth app, web journey & website with a team of 14',
      'Designed automated Push / SMS / WhatsApp lifecycle campaigns → +74% user-to-investor conversion',
      'Built the end-to-end analytics suite for journey visualization and ops',
    ],
  },
  {
    role: 'Product Analyst',
    company: 'CASHe',
    period: 'Jul 2024 – Mar 2025',
    description:
      'Drove conversion and reliability on the 13Karat P2P platform through data, experimentation, and targeted engineering.',
    achievements: [
      'Shipped repayment tracking → -70% customer queries',
      'Built fuzzy-logic matching → -40% name-match failures, better bank verification',
      'Ran targeted A/B tests on high-intent segments → +57% lead-to-investor conversion',
    ],
  },
  {
    role: 'Product Management Intern',
    company: 'CASHe',
    period: 'Jul 2023 – Jun 2024',
    description:
      'Built the data foundation for the 13Karat P2P investment platform and automated core operational workflows.',
    achievements: [
      'Built the complete analytics suite (Python, SQL, Power BI) for onboarding, investing & withdrawals',
      'Automated growth, ops & support workflows → -50% customer TAT',
      'Designed a callbacks dump table as an insurance layer against data loss & rework',
    ],
  },
]

const education = [
  {
    degree: 'BE Electrical & Electronics Eng. + MSc Physics',
    school: 'BITS Pilani, Hyderabad',
    period: '2019 – 2024',
    detail: 'Integrated Master’s · CGPA 8.26 · Minor in Finance',
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
                { category: 'Data', items: ['Python', 'SQL', 'Power BI', 'Excel'] },
                { category: 'Product', items: ['UX Research', 'Wireframing', 'A/B Testing', 'Analytics'] },
                { category: 'Domain', items: ['P2P Lending', 'Fixed Deposits', 'Mutual Funds', 'Voice AI'] },
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
