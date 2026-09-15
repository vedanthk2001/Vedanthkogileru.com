'use client'

import { useEffect, useRef, useState } from 'react'

const PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY
const ASSISTANT_ID = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID

/** Only the last few lines are kept in state. Rendering an unbounded list and
 *  hiding the overflow with CSS gets slower every minute of a call. */
const MAX_LINES = 7

type Role = 'assistant' | 'user'
type Line = { role: Role; text: string }
type Status = 'idle' | 'connecting' | 'live' | 'insecure' | 'error'

/** Vapi emits a final transcript per chunk as speech streams, so one spoken
 *  sentence arrives as several messages. Start a new line only when the speaker
 *  changes; otherwise the opening turn renders as four separate bubbles. */
function appendChunk(prev: Line[], role: Role, chunk: string): Line[] {
  const text = chunk.trim()
  if (!text) return prev
  const next = [...prev]
  const last = next[next.length - 1]
  if (!last || last.role !== role) {
    next.push({ role, text })
    return next
  }
  // Some providers resend the whole utterance rather than the delta. Treat a
  // superset as a correction and a subset as a duplicate, or the line doubles.
  if (last.text === text || last.text.endsWith(text)) return next
  if (text.startsWith(last.text)) next[next.length - 1] = { role, text }
  else next[next.length - 1] = { role, text: `${last.text} ${text}` }
  return next
}

/** The SDK type is only needed for the ref, and importing it eagerly would pull
 *  the whole module into the initial bundle. */
type VapiClient = {
  start: (id: string) => Promise<unknown>
  stop: () => void
  on: (e: string, fn: (...a: never[]) => void) => void
  removeAllListeners?: () => void
}

const MicIcon = ({ className }: { className: string }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11Z" />
  </svg>
)

export default function VoicePanel({ variant = 'card' }: { variant?: 'card' | 'sheet' }) {
  const [status, setStatus] = useState<Status>('idle')
  const [lines, setLines] = useState<Line[]>([])
  const [partial, setPartial] = useState<{ role: Role; text: string } | null>(null)
  const vapiRef = useRef<VapiClient | null>(null)

  useEffect(() => {
    return () => {
      vapiRef.current?.removeAllListeners?.()
      vapiRef.current?.stop()
    }
  }, [])

  /** Finals commit into the current speaker's line. Partials are held separately
   *  and rendered as dimmed trailing text, so an in-flight sentence firms up in
   *  place rather than stuttering down the panel. */
  const push = (role: Role, text: string, final: boolean) => {
    if (final) {
      setPartial(null)
      setLines((prev) => appendChunk(prev, role, text).slice(-MAX_LINES))
    } else {
      setPartial({ role, text })
    }
  }

  const start = async () => {
    if (!PUBLIC_KEY || !ASSISTANT_ID) return setStatus('error')
    // getUserMedia needs a secure context. Say so rather than presenting a
    // button that silently does nothing.
    if (!window.isSecureContext) return setStatus('insecure')

    setStatus('connecting')
    setLines([])
    setPartial(null)
    try {
      const { default: Vapi } = await import('@vapi-ai/web')
      const vapi = new Vapi(PUBLIC_KEY) as unknown as VapiClient
      vapiRef.current = vapi

      vapi.on('call-start', (() => setStatus('live')) as never)
      vapi.on('call-end', (() => setStatus('idle')) as never)
      vapi.on('error', (() => setStatus('error')) as never)
      vapi.on('message', ((m: { type: string; role: string; transcriptType: string; transcript: string }) => {
        if (m?.type !== 'transcript') return
        push(m.role === 'user' ? 'user' : 'assistant', m.transcript, m.transcriptType === 'final')
      }) as never)

      await vapi.start(ASSISTANT_ID)
    } catch {
      setStatus('error')
    }
  }

  const stop = () => {
    vapiRef.current?.stop()
    setStatus('idle')
  }

  const live = status === 'live' || status === 'connecting'

  // Fold the in-flight partial onto the current speaker's line so it grows in
  // place. A partial from the other speaker opens its own dimmed line.
  const renderLines: (Line & { tail?: string })[] = lines.map((l) => ({ ...l }))
  if (partial) {
    const last = renderLines[renderLines.length - 1]
    if (last && last.role === partial.role) last.tail = partial.text
    else renderLines.push({ role: partial.role, text: '', tail: partial.text })
  }

  const notice =
    status === 'insecure'
      ? 'Your browser blocks the microphone on an insecure connection. Reload this page over https and it will work.'
      : status === 'error'
        ? 'That did not connect. The calendar link under Contact always works.'
        : null

  const header = (
    <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
      <span
        className={`w-2.5 h-2.5 rounded-full flex-none ${
          status === 'live' ? 'bg-indigo-600 animate-pulse' : 'bg-slate-300'
        }`}
      />
      <div>
        <p className="text-sm font-bold text-slate-900">
          {status === 'live' ? 'Live' : status === 'connecting' ? 'Connecting' : 'Talk to me'}
        </p>
        <p className="text-xs text-slate-400 mt-0.5">
          {live ? 'Speak whenever you like' : 'not actually me but you get the point'}
        </p>
      </div>
    </div>
  )

  const transcript = (
    <div
      className="flex-1 overflow-hidden relative min-h-0"
      style={{
        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 26%)',
        maskImage: 'linear-gradient(to bottom, transparent, black 26%)',
      }}
      aria-live="polite"
    >
      <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-3 pt-4">
        {renderLines.map((l, i) => (
          <div
            key={i}
            className={`text-sm leading-relaxed ${
              l.role === 'assistant' ? 'text-slate-800' : 'text-slate-500'
            }`}
          >
            <span
              className={`block text-[10px] font-bold tracking-widest uppercase mb-0.5 ${
                l.role === 'assistant' ? 'text-indigo-600' : 'text-slate-400'
              }`}
            >
              {l.role === 'assistant' ? 'Vedanth' : 'You'}
            </span>
            {l.text}
            {l.tail && (
              <span className="opacity-40">
                {l.text ? ' ' : ''}
                {l.tail}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  const footer = (
    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
      <span className="text-xs text-slate-400">{status === 'connecting' ? 'Connecting' : 'In a call'}</span>
      <button onClick={stop} className="text-sm font-semibold text-red-600 hover:text-red-700 py-1">
        End call
      </button>
    </div>
  )

  /* ---------- mobile: a pill that opens a bottom sheet ---------- */
  if (variant === 'sheet') {
    return (
      <>
        {!live && (
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={start}
              className="flex items-center gap-2.5 pl-4 pr-5 h-12 rounded-full bg-indigo-600 active:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20"
            >
              <MicIcon className="w-5 h-5 fill-white" />
              <span className="text-sm font-semibold">Talk to me</span>
            </button>
            {notice && (
              <p className="text-xs text-amber-600 max-w-[32ch] text-center leading-relaxed px-6">{notice}</p>
            )}
          </div>
        )}

        {live && (
          <>
            {/* Dim the hero behind the sheet so the transcript is the only thing
                competing for attention on a small screen. */}
            <div className="fixed inset-0 z-40 bg-slate-900/20" onClick={stop} aria-hidden="true" />
            <div
              className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl px-5 pt-4 flex flex-col
                         h-[68vh] max-h-[560px]"
              /* Clear the iOS home indicator, and lift the sheet above the URL
                 bar when it is showing. */
              style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
              role="dialog"
              aria-label="Voice call"
            >
              <div className="w-10 h-1 rounded-full bg-slate-200 mx-auto mb-3 flex-none" />
              {header}
              {transcript}
              {footer}
            </div>
          </>
        )}
      </>
    )
  }

  /* ---------- desktop: the card in the right column ---------- */
  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col min-h-[340px]">
      {header}
      {!live ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
          <button
            onClick={start}
            aria-label="Start a voice call"
            className="w-16 h-16 rounded-full bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center justify-center shadow-[0_0_0_0_rgba(79,70,229,0.4)] motion-safe:animate-mic-ring"
          >
            <MicIcon className="w-6 h-6 fill-white" />
          </button>
          <p className="text-sm font-semibold text-slate-800">Ask me anything</p>
          {notice && <p className="text-xs text-amber-600 max-w-[30ch] leading-relaxed">{notice}</p>}
        </div>
      ) : (
        <>
          {transcript}
          {footer}
        </>
      )}
    </div>
  )
}
