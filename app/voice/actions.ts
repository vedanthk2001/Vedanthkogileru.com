/** The browser half of the agent's client-side tools. The SDK cannot carry a
 *  result back to the model, so everything here runs for its effect on the page
 *  and stays quiet when it cannot: the answer is still being spoken either way. */

import type { VoiceAction } from './types'

/** Scrolled this recently and the visitor is reading under their own steam, so
 *  the agent stays out of the way. Long enough to bridge two flicks of a
 *  trackpad, short enough that the next thing it says still lands somewhere. */
const HUMAN_SCROLL_GRACE_MS = 1200

let lastHumanScroll = 0

/* Only direct input counts as the visitor taking over. Deliberately NOT the
   `scroll` event: inertial scrolling keeps firing it for a second or more after
   a flick, and our own smooth scroll fires it too, so listening to it widens
   this window unpredictably and the agent stops scrolling when it should.
   Bound at import so the timestamp is warm before the agent first reaches for
   the viewport, and guarded because the export build evaluates this module on
   the server, where there is no window. */
if (typeof window !== 'undefined') {
  const stamp = () => {
    lastHumanScroll = Date.now()
  }
  window.addEventListener('wheel', stamp, { passive: true })
  window.addEventListener('touchmove', stamp, { passive: true })
  /* The keys that scroll. Nothing else reports arrow or page navigation. */
  const SCROLL_KEYS = new Set([
    'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ',
  ])
  window.addEventListener('keydown', (e) => {
    if (SCROLL_KEYS.has(e.key)) stamp()
  }, { passive: true })
}

function showSection(args: Record<string, unknown>): void {
  const id = args.section
  if (typeof id !== 'string') return

  /* The model can name a section that does not exist, and the page can lose one
     under it. Neither is worth a throw inside an SDK event handler. */
  const target = document.getElementById(id)
  if (!target) return

  if (Date.now() - lastHumanScroll < HUMAN_SCROLL_GRACE_MS) return

  /* 'auto' defers to the html `scroll-behavior` in globals.css, which the
     reduced-motion query there already turns off. The scroll still happens: the
     caller asked to be shown the section, they only asked for no animation. */
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
}

/** The one entry point. Switching on the name means a second action is a case
 *  here and a line in agent.json, with nothing to change at the call site. */
export function runAction(action: VoiceAction): void {
  if (typeof window === 'undefined') return

  switch (action.name) {
    case 'show_section':
      showSection(action.args)
      break
    default:
      /* agent.json can ship an action before a build knows how to run it. */
      break
  }
}
