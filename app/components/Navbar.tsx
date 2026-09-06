'use client'

import { useState, useEffect } from 'react'
import Logo from './Logo'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
      }`}
    >
      {/* Full-bleed 1fr/auto/1fr grid: the equal outer columns keep the links
          centred on the viewport no matter how wide the brand or CTA get. */}
      <nav className="w-full h-16 px-5 sm:px-8 lg:px-12 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        {/* Left: brand, flush to the edge */}
        <a
          href="#"
          className="col-start-1 justify-self-start flex items-center gap-2.5 text-slate-900 hover:text-indigo-600 transition-colors"
          aria-label="Vedanth Kogileru — home"
        >
          <Logo className="w-8 h-8 shrink-0" />
          <span className="font-semibold text-lg tracking-tight whitespace-nowrap">
            Vedanth K.
          </span>
        </a>

        {/* Centre: section links */}
        <ul className="hidden md:flex col-start-2 justify-self-center items-center gap-6 lg:gap-9">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-slate-600 hover:text-indigo-600 text-sm font-medium transition-colors whitespace-nowrap"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right: CTA on desktop, hamburger on mobile */}
        <div className="col-start-3 justify-self-end flex items-center">
          <a
            href="#contact"
            className="hidden md:inline-flex bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
          >
            Get in Touch
          </a>

          <button
            className="md:hidden text-slate-600 hover:text-slate-900"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-5 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-slate-700 font-medium hover:text-indigo-600 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="bg-indigo-600 text-white font-medium px-4 py-2 rounded-lg text-center hover:bg-indigo-700 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Get in Touch
          </a>
        </div>
      )}
    </header>
  )
}
