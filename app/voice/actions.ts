/** The browser half of the agent's client-side tools. The SDK cannot carry a
 *  result back to the model, so everything here runs for its effect on the page
 *  and stays quiet when it cannot: the answer is still being spoken either way. */

import type { VoiceAction } from './types'

/** The last action the browser was asked to run, and what came of it. The only
 *  window a client-side tool has: the model cannot be told the scroll failed,
 *  and nothing is logged, so without this a silent no-op is indistinguishable
 *  from the call never arriving. Read it in the console after a call. */
declare global {
  interface Window {
    __voiceAction?: { name: string; args: Record<string, unknown>; result: string; at: string }
  }
}

function record(name: string, args: Record<string, unknown>, result: string): void {
  window.__voiceAction = { name, args, result, at: new Date().toISOString() }
}

function showSection(args: Record<string, unknown>): void {
  const id = args.section
  if (typeof id !== 'string') return record('show_section', args, 'no section in args')

  /* The model can name a section that does not exist, and the page can lose one
     under it. Neither is worth a throw inside an SDK event handler. */
  const target = document.getElementById(id)
  if (!target) return record('show_section', args, `no element with id ${id}`)

  /* 'auto' defers to the html `scroll-behavior` in globals.css, which the
     reduced-motion query there already turns off. The scroll still happens: the
     caller asked to be shown the section, they only asked for no animation.

     Nothing defers to a visitor who is scrolling themselves any more. That
     deference was a guess, and it was also the only way a legitimate scroll
     could do nothing at all with no trace, which is worse than the jolt it
     avoided. They asked to be shown the section. */
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  record('show_section', args, `scrolled to ${id}`)
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
      record(action.name, action.args, 'no handler for this action')
      break
  }
}
