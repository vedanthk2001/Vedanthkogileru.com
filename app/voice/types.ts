/** The contract between the voice panel and whichever platform runs the agent.
 *  VoicePanel only knows this file. An adapter translates its SDK's events into
 *  these calls, so changing platform never touches the UI. */

export type Role = 'assistant' | 'user'

export type VoiceEvents = {
  onLive: () => void
  onEnd: () => void
  onError: () => void
  /** `final: false` is an in-flight partial that a later event supersedes. */
  onTranscript: (role: Role, text: string, final: boolean) => void
}

export type VoiceSession = {
  /** Safe at any point, including while the call is still connecting. */
  stop: () => void
  /** Rejects if the call fails to start. */
  connected: Promise<void>
}

export type VoiceProvider = {
  /** False when the build carries no client config for this platform. */
  configured: boolean
  start: (events: VoiceEvents) => VoiceSession
}
