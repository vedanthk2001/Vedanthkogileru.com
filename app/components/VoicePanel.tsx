'use client'

import { useEffect, useRef, useState } from 'react'

const PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY
const ASSISTANT_ID = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID

/** Only the last few lines are kept in state. Rendering an unbounded list and
 *  hiding the overflow with CSS gets slower every minute of a call. */
const MAX_LINES = 7

type Line = { role: 'assistant' | 'user'; text: string; final: boolean }
type Status = 'idle' | 'connecting' | 'live' | 'insecure' | 'error'

/** The SDK type is only needed for the ref, and importing it eagerly would pull
 *  the whole module into the initial bundle. */
type VapiClient = {
  start: (id: string) => Promise<unknown>
  stop: () => void
  on: (e: string, fn: (...a: never[]) => void) => void
  removeAllListeners?: () => void
}

export default function VoicePanel() {
  const [status, setStatus] = useState<Status>('idle')
  const [lines, setLines] = useState<Line[]>([])
  const vapiRef = useRef<VapiClient | null>(null)

  useEffect(() => {
    return () => {
      vapiRef.current?.removeAllListeners?.()
      vapiRef.current?.stop()
    }
  }, [])

  /** Partials replace the in-flight line for that role; finals commit it. Append
   *  on partial and the caller's own sentence stutters down the panel. */
  const push = (role: Line['role'], text: string, final: boolean) => {
    setLines((prev) => {
      const next = [...prev]
      const last = next[next.length - 1]
      if (last && last.role === role && !last.final) next[next.length - 1] = { role, text, final }
      else next.push({ role, text, final })
      return next.slice(-MAX_LINES)
    })
  }

  const start = async () => {
    if (!PUBLIC_KEY || !ASSISTANT_ID) return setStatus('error')
    // getUserMedia needs a secure context. Say so rather than presenting a
    // button that silently does nothing.
    if (!window.isSecureContext) return setStatus('insecure')

    setStatus('connecting')
    setLines([])
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

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col min-h-[340px]">
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

      {!live ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
          <button
            onClick={start}
            aria-label="Start a voice call"
            className="w-16 h-16 rounded-full bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center justify-center shadow-[0_0_0_0_rgba(79,70,229,0.4)] motion-safe:animate-mic-ring"
          >
            <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11Z" />
            </svg>
          </button>
          <p className="text-sm font-semibold text-slate-800">Ask me anything</p>
          {status === 'insecure' && (
            <p className="text-xs text-amber-600 max-w-[30ch] leading-relaxed">
              Your browser blocks the microphone on an insecure connection. Reload this page over
              https and it will work.
            </p>
          )}
          {status === 'error' && (
            <p className="text-xs text-slate-400 max-w-[30ch] leading-relaxed">
              That did not connect. The calendar link under Contact always works.
            </p>
          )}
        </div>
      ) : (
        <>
          <div
            className="flex-1 overflow-hidden relative"
            style={{
              WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 26%)',
              maskImage: 'linear-gradient(to bottom, transparent, black 26%)',
            }}
            aria-live="polite"
          >
            <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-3 pt-4">
              {lines.map((l, i) => (
                <div
                  key={i}
                  className={`text-sm leading-relaxed ${l.final ? '' : 'opacity-40'} ${
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
                </div>
              ))}
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {status === 'connecting' ? 'Connecting' : 'In a call'}
            </span>
            <button onClick={stop} className="text-xs font-semibold text-red-600 hover:text-red-700">
              End call
            </button>
          </div>
        </>
      )}
    </div>
  )
}
