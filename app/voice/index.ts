import type { VoiceProvider } from './types'
import { vapi } from './vapi'

export type { Role, SpeechStatus, VoiceSession, VoiceAction } from './types'
export { runAction } from './actions'

/* Turn assembly lives in transcript.ts as a pure reducer, and reaches the panel
   through here so the panel imports one module rather than three. */
export type { Turn, TranscriptState, TranscriptEvent } from './transcript'
export { EMPTY, reduce } from './transcript'

/** Every adapter, keyed by the name agent/agent.json uses as its `runtime`.
 *  Adding a platform is a file beside vapi.ts and one entry here. */
const PROVIDERS: Record<string, VoiceProvider> = { vapi }

/** Chosen at build time: next.config.js inlines `runtime` from agent/agent.json. */
export const voice: VoiceProvider | undefined = PROVIDERS[process.env.NEXT_PUBLIC_VOICE_RUNTIME ?? '']
