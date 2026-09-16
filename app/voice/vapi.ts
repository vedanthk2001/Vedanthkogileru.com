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

type VapiTranscript = { type: 'transcript'; role: string; transcriptType: string; transcript: string }

/** `arguments` is a JSON string down one path and an already-parsed object down
 *  another, depending on how the call reached the browser, so it stays unknown
 *  until readArgs has looked at it. */
type VapiToolCall = { function?: { name?: string; arguments?: unknown } }

/** What a tool with no `server` url and `async: true` delivers here instead of
 *  to a webhook. Only arrives while 'tool-calls' is in provider.json's
 *  clientMessages, which replaces Vapi's default list rather than adding to it. */
type VapiToolCalls = { type: 'tool-calls'; toolCallList?: VapiToolCall[] }

/** Every other message type falls through both checks below. */
type VapiMessage = VapiTranscript | VapiToolCalls

function readArgs(raw: unknown): Record<string, unknown> {
  if (typeof raw === 'string') {
    try {
      const parsed: unknown = JSON.parse(raw)
      return parsed !== null && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : {}
    } catch {
      return {}
    }
  }
  return raw !== null && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
}

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
        if (m?.type === 'transcript') {
          events.onTranscript(m.role === 'user' ? 'user' : 'assistant', m.transcript, m.transcriptType === 'final')
          return
        }
        if (m?.type !== 'tool-calls') return
        for (const call of m.toolCallList ?? []) {
          const fn = call?.function
          if (!fn?.name) continue
          // A throw here would land inside the SDK's own emit and can take the
          // call down with it. A side effect that fails is not worth hanging up
          // over, and the model is mid-answer and cannot be told either way.
          try {
            events.onAction({ name: fn.name, args: readArgs(fn.arguments) })
          } catch {
            /* the answer continues without it */
          }
        }
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
