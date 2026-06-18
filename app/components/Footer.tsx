export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-8 px-6 md:px-12">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm">© {new Date().getFullYear()} Vedanth Kogileru. All rights reserved.</p>
        <div className="flex gap-6 text-sm">
          <a href="mailto:vedanthkogileruofficial@gmail.com" className="hover:text-white transition-colors">
            Email
          </a>
          <a
            href="https://linkedin.com/in/vedanth-kogileru"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/vedanthk2001"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}
