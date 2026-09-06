/**
 * The mark: a V at 27° off vertical, a caret above it that is the same V at 32%
 * scale (stroke included), and a rule below. Turned 90° the rule becomes a stem
 * and the V becomes arms — it is also a K.
 *
 * Geometry is on a 24-unit grid and must stay in sync with logo/identity.html
 * and public/favicon.svg. Do not thicken the caret: its weight is locked to the
 * V's so the notch stays open.
 */
type LogoProps = {
  className?: string
  /** Draw the mark in on mount. Use once per page load, never on hover. */
  animate?: boolean
  /** Drops the rule. For tiles, circular crops and anything under 24px. */
  compact?: boolean
  /** Puts the rule in indigo — the only element that ever takes the accent. */
  accent?: boolean
}

export default function Logo({
  className = '',
  animate = false,
  compact = false,
  accent = false,
}: LogoProps) {
  return (
    <svg
      viewBox={compact ? '6.221 0.4 11.558 19' : '4.75 0.4 14.5 22.3'}
      className={`${animate ? 'logo-draw ' : ''}${className}`}
      fill="none"
      role="img"
      aria-label="Vedanth Kogileru"
    >
      <g strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit={6}>
        <path
          className="lg-v"
          stroke="currentColor"
          pathLength={1}
          d="M7.68 8.058 L12 16.537 L16.32 8.058"
          strokeWidth={2.6}
        />
        <path
          className="lg-c"
          stroke="currentColor"
          pathLength={1}
          d="M10.618 4.029 L12 1.316 L13.382 4.029"
          strokeWidth={0.832}
        />
        {!compact && (
          <path
            className={`lg-r ${accent ? 'text-indigo-600' : ''}`}
            stroke="currentColor"
            pathLength={1}
            d="M4.75 21.7 L19.25 21.7"
            strokeWidth={2}
          />
        )}
      </g>
    </svg>
  )
}
