import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Vedanth Kogileru | Product Manager',
  description:
    'Product Manager building fintech products and voice AI in India. Founding PM of Karat Wealth and KaratClub, now AI PM at Ignosis.',
  openGraph: {
    title: 'Vedanth Kogileru | Product Manager',
    description:
      'Product Manager building fintech products and voice AI in India.',
    url: 'https://vedanthkogileru.com',
    siteName: 'Vedanth Kogileru',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans bg-white`}>{children}</body>
    </html>
  )
}
