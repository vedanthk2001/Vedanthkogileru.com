import type { VoiceProvider } from './types'

const PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY
const ASSISTANT_ID = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID

/** The SDK type is only needed for the handle, and importing it eagerly would
 *  pull the whole module into the initial bundle. */
type VapiClient = {
  start: (id: string) => Promise<unknown>
  stop: () => void
  on: (e: string, fn: (...a: never[]) => void) => void
  removeAllListeners?: () => void
}

type VapiMessage = { type: string; role: string; transcriptType: string; transcript: string }

export const vapi: VoiceProvider = {
  configured: Boolean(PUBLIC_KEY && ASSISTANT_ID),

  start(events) {
    let client: VapiClient | null = null
    let stopped = false

    const connected = (async () => {
      // ~245 kB, so it loads on the first click rather than with the page.
      const { default: Vapi } = await import('@vapi-ai/web')
      if (stopped) return
      client = new Vapi(PUBLIC_KEY as string) as unknown as VapiClient
      client.on('call-start', (() => events.onLive()) as never)
      client.on('call-end', (() => events.onEnd()) as never)
      client.on('error', (() => events.onError()) as never)
      client.on('message', ((m: VapiMessage) => {
        if (m?.type !== 'transcript') return
        events.onTranscript(m.role === 'user' ? 'user' : 'assistant', m.transcript, m.transcriptType === 'final')
      }) as never)
      await client.start(ASSISTANT_ID as string)
    })()

    return {
      connected,
      stop() {
        stopped = true
        client?.removeAllListeners?.()
        client?.stop()
      },
    }
  },
}
