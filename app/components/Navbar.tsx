'use client'

import { useState, useEffect } from 'react'
import Logo from './Logo'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState<string>('')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Which section is currently under the header. rootMargin's top inset matches
  // the fixed header so a section counts as active once it clears it.
  useEffect(() => {
    const sections = navLinks
      .map((l) => document.querySelector(l.href))
      .filter((el): el is Element => el !== null)
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(`#${visible.target.id}`)
      },
      { rootMargin: '-64px 0px -55% 0px', threshold: [0.1, 0.5] }
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  // Escape closes the menu; the body scroll lock stops the page drifting behind it.
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [menuOpen])

  const solid = scrolled || menuOpen

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        solid ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
      }`}
    >
      {/* Full-bleed 1fr/auto/1fr grid: the equal outer columns keep the links
          centred on the viewport no matter how wide the CTA gets. */}
      <nav className="w-full h-16 px-5 sm:px-8 lg:px-12 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        {/* Left: the mark, alone. It never sits beside the name — the name is
            already on the page, and the pair reads as a stutter. */}
        <a
          href="#"
          className="col-start-1 justify-self-start text-slate-900 hover:opacity-60 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600 rounded-sm"
          aria-label="Vedanth Kogileru — back to top"
        >
          <Logo className="h-9 w-auto" animate accent />
        </a>

        {/* Centre: section links */}
        <ul className="hidden md:flex col-start-2 justify-self-center items-center gap-6 lg:gap-9">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={active === link.href ? 'true' : undefined}
                className={`text-sm font-medium transition-colors whitespace-nowrap ${
                  active === link.href
                    ? 'text-slate-900'
                    : 'text-slate-600 hover:text-indigo-600'
                }`}
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
            className="md:hidden -mr-2 p-2 text-slate-600 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 rounded-md"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
        <div
          id="mobile-menu"
          className="md:hidden bg-white border-t border-slate-100 px-5 py-4 flex flex-col gap-4"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={active === link.href ? 'true' : undefined}
              className={`font-medium transition-colors ${
                active === link.href ? 'text-indigo-600' : 'text-slate-700 hover:text-indigo-600'
              }`}
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
