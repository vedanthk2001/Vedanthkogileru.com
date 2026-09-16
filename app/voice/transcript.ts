import type { Role, SpeechStatus } from './types'

/** Turn assembly for the transcript, with no React and no DOM in it, so the one
 *  genuinely fiddly part of the panel can be read and tested on its own.
 *
 *  The model: each role has at most one OPEN turn, and openness is recorded on
 *  the turn rather than inferred from its place in the array. Two turns are open
 *  at once every time the visitor says "mm" over an answer, which is why "the
 *  last turn" is the wrong target for either of them: it sends the rest of the
 *  answer into the backchannel's bubble and the answer arrives as two. Position
 *  cannot stand in for openness either, because once that backchannel closes it
 *  is still the last turn, and the visitor's next real question would be glued
 *  onto it. Looking back for the role and asking whether that turn is still open
 *  answers both, with no special case for the overlap. A final that lands after
 *  its speaker stopped, the normal order for the visitor since silence ends the
 *  turn and the transcription follows a moment later, still finds its bubble. */

/** `text` is what has been heard for certain. `live` is the in-flight partial,
 *  drawn dimmer, so a sentence firms up in place instead of stuttering down the
 *  panel. */
export type Turn = { id: number; role: Role; text: string; live: string; open?: boolean }

/** `nextId` never resets, so keys stay stable when the cap drops old turns. */
export type TranscriptState = { turns: Turn[]; nextId: number }

export const EMPTY: TranscriptState = { turns: [], nextId: 1 }

export type TranscriptEvent =
  | { kind: 'speech'; role: Role; status: SpeechStatus; turn?: number }
  | { kind: 'transcript'; role: Role; text: string; final: boolean }

/** Rendering an unbounded list and hiding the overflow with CSS gets slower
 *  every minute of a call. */
const MAX_TURNS = 7

function openTurn(turns: Turn[], role: Role): number {
  for (let i = turns.length - 1; i >= 0; i--) if (turns[i].role === role) return i
  return -1
}

/** Some providers resend the whole utterance rather than the delta. Treat a
 *  superset as a correction and a subset as a duplicate, or the bubble doubles. */
function commit(text: string, chunk: string): string {
  if (!text) return chunk
  if (text === chunk || text.endsWith(chunk)) return text
  if (chunk.startsWith(text)) return chunk
  return `${text} ${chunk}`
}

/** The panel draws `live` after `text`, so a partial that carries the whole
 *  utterance has to come back trimmed to the part nobody has read yet. */
function pending(text: string, chunk: string): string {
  if (!text) return chunk
  if (text === chunk || text.endsWith(chunk)) return ''
  if (chunk.startsWith(text)) return chunk.slice(text.length).trimStart()
  return chunk
}

function patch(state: TranscriptState, index: number, fields: Partial<Turn>): TranscriptState {
  const turns = state.turns.slice()
  turns[index] = { ...turns[index], ...fields }
  return { turns, nextId: state.nextId }
}

/** `open` says this turn is still being spoken, so later words belong to it even
 *  if somebody else has spoken in between. Only a speech-update can claim that.
 *  A turn conjured out of a transcript cannot: nothing has promised the speaker
 *  is still going, and treating it as open makes it swallow every later thing
 *  they say. */
function push(state: TranscriptState, role: Role, text: string, live: string, open: boolean): TranscriptState {
  const turns = [...state.turns, { id: state.nextId, role, text, live, open }]
  return { turns: turns.slice(-MAX_TURNS), nextId: state.nextId + 1 }
}

/** Pure: the state that goes in is never touched, and an event that changes
 *  nothing hands the same object back rather than a copy of it. */
export function reduce(state: TranscriptState, event: TranscriptEvent): TranscriptState {
  if (event.kind === 'speech') {
    if (event.status === 'started') {
      // speech-update carries a turn number and transcripts do not, which is
      // why turns are cut here rather than on the role changing. The number
      // itself is never read: a role has one open turn by construction, so
      // there is nothing to disambiguate. An already-open turn means this is
      // that turn resuming after a gap in the audio, and opening a second
      // bubble for it would be the bug this file exists to fix.
      const j = openTurn(state.turns, event.role)
      if (j !== -1 && state.turns[j].open) return state
      return push(state, event.role, '', '', true)
    }
    // Stopping does not close the bubble to late finals, which are the common
    // case, it only drops a partial that the final has already superseded. A
    // turn with nothing committed keeps its partial: it is all there is to show.
    const i = openTurn(state.turns, event.role)
    if (i === -1) return state
    const turn = state.turns[i]
    const live = turn.text ? '' : turn.live
    if (!turn.open && live === turn.live) return state
    return patch(state, i, { live, open: false })
  }

  const chunk = event.text.trim()
  if (!chunk) return state

  const i = openTurn(state.turns, event.role)
  // A closed turn keeps taking words only while nothing has happened since, which
  // is a final landing a moment after silence ended the turn. Once anyone else
  // has spoken, this is new speech and needs its own bubble. Without that test
  // every later question from the visitor is appended to whatever they said
  // first, which sits far up the panel and out of sight, and their side of the
  // call looks like it was never transcribed at all.
  // The i === -1 case is the same push: no turn yet because a speech-update was
  // dropped or is still in flight, and a transcript is proof enough someone spoke.
  const reusable = i !== -1 && (state.turns[i].open === true || i === state.turns.length - 1)
  if (!reusable) return push(state, event.role, event.final ? chunk : '', event.final ? '' : chunk, false)

  const turn = state.turns[i]
  if (event.final) {
    const text = commit(turn.text, chunk)
    if (text === turn.text && !turn.live) return state
    return patch(state, i, { text, live: '' })
  }
  const live = pending(turn.text, chunk)
  if (live === turn.live) return state
  return patch(state, i, { live })
}
