import type { SpeechStatus, VoiceProvider } from './types'

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

/** The turn boundaries, and the only message carrying a turn number: a
 *  transcript has none, and the speaker flipping does not mark a turn either.
 *  Already listed in provider.json's clientMessages. `role` and `status` stay
 *  `string` because this is wire data, checked at the call site not trusted. */
type VapiSpeechUpdate = { type: 'speech-update'; role: string; status: string; turn?: number }

/** `arguments` is a JSON string down one path and an already-parsed object down
 *  another, depending on how the call reached the browser, so it stays unknown
 *  until readArgs has looked at it. */
type VapiToolCall = { function?: { name?: string; arguments?: unknown } }

/** What a tool with no `server` url and `async: true` delivers here instead of
 *  to a webhook. Only arrives while 'tool-calls' is in provider.json's
 *  clientMessages, which replaces Vapi's default list rather than adding to it. */
type VapiToolCalls = {
  type: 'tool-calls'
  toolCallList?: VapiToolCall[]
  /* Documented as toolCallList, but the same calls appear as `toolCalls` on the
     server-side message and as `toolWithToolCallList` elsewhere in the SDK's own
     types. Reading all three costs nothing and means a shape change does not
     turn the feature off with no error anywhere. */
  toolCalls?: VapiToolCall[]
  toolWithToolCallList?: { toolCall?: VapiToolCall }[]
}

/** Every other message type falls through every check below. */
type VapiMessage = VapiTranscript | VapiSpeechUpdate | VapiToolCalls

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

declare global {
  interface Window {
    __voiceLog?: { t: string; role?: string; status?: string; turn?: number; final?: boolean; text?: string }[]
  }
}

function record(m: VapiMessage): void {
  if (typeof window === 'undefined') return
  const log = (window.__voiceLog ??= [])
  if (log.length > 300) return
  const any = m as { type?: string; role?: string; status?: string; turn?: number; transcriptType?: string; transcript?: string }
  log.push({
    t: any.type ?? '?',
    role: any.role,
    status: any.status,
    turn: any.turn,
    final: any.transcriptType ? any.transcriptType === 'final' : undefined,
    text: any.transcript ? any.transcript.slice(0, 45) : undefined,
  })
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
        /* The turn model here is inferred from what Vapi emits, and guessing at
           it has already produced two bubble bugs. This is the record of what
           actually arrived, in memory only and capped, so the next odd call can
           be read rather than theorised about. */
        record(m)
        if (m?.type === 'transcript') {
          events.onTranscript(m.role === 'user' ? 'user' : 'assistant', m.transcript, m.transcriptType === 'final')
          return
        }
        if (m?.type === 'speech-update') {
          /* Any other status is dropped rather than coerced: guessing 'stopped'
             would close a turn that is still being spoken. */
          const status: SpeechStatus | null =
            m.status === 'started' ? 'started' : m.status === 'stopped' ? 'stopped' : null
          if (status) events.onSpeech(m.role === 'user' ? 'user' : 'assistant', status, m.turn)
          return
        }
        if (m?.type !== 'tool-calls') return
        const calls: VapiToolCall[] =
          m.toolCallList ?? m.toolCalls ?? (m.toolWithToolCallList ?? []).map((w) => w?.toolCall ?? {})
        for (const call of calls) {
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
