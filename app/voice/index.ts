import type { VoiceProvider } from './types'
import { vapi } from './vapi'

export type { Role, VoiceSession, VoiceAction } from './types'
export { runAction } from './actions'

/** Every adapter, keyed by the name agent/agent.json uses as its `runtime`.
 *  Adding a platform is a file beside vapi.ts and one entry here. */
const PROVIDERS: Record<string, VoiceProvider> = { vapi }

/** Chosen at build time: next.config.js inlines `runtime` from agent/agent.json. */
export const voice: VoiceProvider | undefined = PROVIDERS[process.env.NEXT_PUBLIC_VOICE_RUNTIME ?? '']
