/**
 * VK monogram. The rounded ground uses currentColor so the mark can pick up
 * hover/theme colour from its parent; the letterforms stay white.
 * Geometry is kept in sync with public/favicon.svg.
 */
export default function Logo({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label="Vedanth Kogileru"
    >
      <rect width="100" height="100" rx="24" fill="currentColor" />
      <g
        fill="none"
        stroke="#ffffff"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(-0.5 0)"
      >
        <path d="M17 32 L32 68 L47 32" />
        <path d="M64 32 L64 68" />
        <path d="M64 50 L84 32" />
        <path d="M64 50 L84 68" />
      </g>
    </svg>
  )
}
