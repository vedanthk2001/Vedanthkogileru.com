export default function Hero() {
  return (
    <section className="min-h-screen flex items-center bg-white pt-16">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-20 w-full">
        <div className="max-w-3xl">
          <p className="text-indigo-600 font-medium text-sm tracking-widest uppercase mb-4">
            Product Manager · Fintech &amp; AI
          </p>
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-tight tracking-tight mb-6">
            Hi, I&apos;m <span className="text-indigo-600">Vedanth</span> Kogileru.
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 leading-relaxed mb-10 max-w-2xl">
            I build the products Indians invest through — and the AI behind the
            next generation of financial conversations. Founding PM by instinct,
            data-native by training.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#projects"
              className="bg-indigo-600 text-white font-semibold px-8 py-4 rounded-xl hover:bg-indigo-700 transition-colors text-center"
            >
              View My Work
            </a>
            <a
              href="#contact"
              className="border-2 border-slate-200 text-slate-700 font-semibold px-8 py-4 rounded-xl hover:border-indigo-300 hover:text-indigo-600 transition-colors text-center"
            >
              Get in Touch
            </a>
          </div>

          <div className="mt-20 flex flex-wrap gap-10">
            {[
              { value: '2', label: 'Products as Founding PM' },
              { value: '+74%', label: 'User-to-Investor Conversion' },
              { value: '14', label: 'Person Team Led' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-slate-500 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
