'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { voice, runAction, reduce, EMPTY, type TranscriptState, type VoiceSession } from '../voice'

type Status = 'idle' | 'connecting' | 'live' | 'insecure' | 'error'

const MicIcon = ({ className }: { className: string }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11Z" />
  </svg>
)

export default function VoicePanel({ variant = 'card' }: { variant?: 'card' | 'sheet' }) {
  const [status, setStatus] = useState<Status>('idle')
  /** Every rule about how chunks become turns lives in app/voice/transcript.ts.
   *  The panel holds the result and nothing else, so the hard part is a pure
   *  function that can be reasoned about without a browser or a call. */
  const [convo, setConvo] = useState<TranscriptState>(EMPTY)
  const sessionRef = useRef<VoiceSession | null>(null)

  useEffect(() => {
    return () => sessionRef.current?.stop()
  }, [])

  /** The panel never touches a vendor SDK. `voice` is whichever adapter the
   *  build selected in app/voice/, so changing platform does not change this. */
  const start = () => {
    if (!voice?.configured) return setStatus('error')
    // getUserMedia needs a secure context. Say so rather than presenting a
    // button that silently does nothing.
    if (!window.isSecureContext) return setStatus('insecure')

    setStatus('connecting')
    setConvo(EMPTY)
    const session = voice.start({
      onLive: () => setStatus('live'),
      onEnd: () => setStatus('idle'),
      onError: () => setStatus('error'),
      // Turns are delimited by speech, not by the role changing: a cough from
      // the caller mid-answer flips the role twice, and an answer that arrives
      // as one spoken turn has to render as one bubble.
      onSpeech: (role, phase, turn) => setConvo((s) => reduce(s, { kind: 'speech', role, status: phase, turn })),
      onTranscript: (role, text, final) => setConvo((s) => reduce(s, { kind: 'transcript', role, text, final })),
      // Nothing visible happens here on purpose. The page moving under the
      // caller is its own feedback, and a banner would take attention off
      // the words, which are the only thing on screen during a call.
      onAction: runAction,
    })
    sessionRef.current = session
    session.connected.catch(() => setStatus('error'))
  }

  const stop = () => {
    sessionRef.current?.stop()
    setStatus('idle')
  }

  const live = status === 'live' || status === 'connecting'

  /* Portals, because the live UI is `fixed` and the desktop wrapper in Hero.tsx
     carries a `-translate-y-1/2`. A transform makes an element the containing
     block for every `position: fixed` descendant, so anything rendered in place
     would pin itself to that box instead of the viewport. Rendering into body
     is the one arrangement no ancestor can break. */
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const portal = (node: React.ReactNode) => (mounted ? createPortal(node, document.body) : null)

  const notice =
    status === 'insecure'
      ? 'Your browser blocks the microphone on an insecure connection. Reload this page over https and it will work.'
      : status === 'error'
        ? 'That did not connect. The calendar link under Contact always works.'
        : null

  /** A white halo rather than a panel. The words sit directly on the page, and
   *  this is what keeps them legible when they cross a heading or a photo. */
  const halo = { textShadow: '0 1px 0 #fff, 0 0 10px #fff, 0 0 18px #fff' }

  /* ---------- mobile: the mic is the whole interface ---------- */
  if (variant === 'sheet') {
    if (live) {
      return portal(
        /* No transcript on a phone. It would cover the section the agent has
           just scrolled to, and the scroll is the only reason it moves at all.
           The mic that started the call ends it: one control, one place. */
        <div className="fixed inset-x-0 bottom-7 z-50 flex flex-col items-center gap-2.5">
          <button
            onClick={stop}
            aria-label="End call"
            className="w-16 h-16 rounded-full bg-indigo-600 active:bg-indigo-700 text-white
                       flex items-center justify-center
                       shadow-[0_0_0_0_rgba(79,70,229,0.4)] motion-safe:animate-mic-ring"
          >
            <MicIcon className="w-6 h-6 fill-white" />
          </button>
          <p className="text-xs font-semibold text-slate-500" style={halo}>
            {status === 'connecting' ? 'Connecting' : 'Tap to end'}
          </p>
        </div>
      )
    }
    return (
      <div className="flex flex-col items-center">
        <button
          onClick={start}
          aria-label="Start a voice call"
          className="w-[72px] h-[72px] rounded-full bg-indigo-600 active:bg-indigo-700 text-white
                     flex items-center justify-center
                     shadow-[0_0_0_0_rgba(79,70,229,0.4)] motion-safe:animate-mic-ring"
        >
          <MicIcon className="w-7 h-7 fill-white" />
        </button>
        <p className="mt-4 text-base font-semibold text-slate-900">Talk to me</p>
        <p className="mt-1 text-xs text-slate-400">not actually me but you get the point</p>
        {notice && (
          <p className="mt-2 text-xs text-amber-600 max-w-[32ch] text-center leading-relaxed px-6">{notice}</p>
        )}
      </div>
    )
  }

  /* ---------- desktop: bare words, docked, no container ---------- */
  if (live) {
    const turns = convo.turns.filter((t) => t.text || t.live)
    return portal(
      /* pointer-events-none so the words never intercept a click meant for the
         page underneath. Only End takes the pointer back. */
      <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] pointer-events-none">
        <div
          className="relative h-[210px] overflow-hidden"
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 30%)',
            maskImage: 'linear-gradient(to bottom, transparent, black 30%)',
          }}
          aria-live="polite"
        >
          <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-3.5">
            {turns.length === 0 && (
              <p className="text-xs font-semibold text-slate-400" style={halo}>Connecting</p>
            )}
            {turns.map((turn) => {
              const agent = turn.role === 'assistant'
              return (
                <div key={turn.id} className="text-[13.5px] leading-relaxed" style={halo}>
                  {/* Both speakers stamped, same size and weight. Labelling only
                      the caller made his side read as the page talking and
                      theirs as an aside, rather than as an exchange. */}
                  <span
                    className={`block text-[9px] font-bold tracking-[0.12em] uppercase mb-0.5 ${
                      agent ? 'text-indigo-600' : 'text-slate-300'
                    }`}
                  >
                    {agent ? 'Vedanth' : 'You'}
                  </span>
                  <span className={agent ? 'text-slate-900' : 'text-slate-400'}>{turn.text}</span>
                  {turn.live && (
                    <span className="opacity-40">
                      {turn.text ? ' ' : ''}
                      {turn.live}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
        <div className="flex justify-end pt-2 pointer-events-auto">
          <button
            onClick={stop}
            className="text-xs font-bold text-red-600 hover:text-red-700 py-1"
            style={{ textShadow: '0 0 8px #fff, 0 0 14px #fff' }}
          >
            End call
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col min-h-[340px]">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <span className="w-2.5 h-2.5 rounded-full flex-none bg-slate-300" />
        <div>
          <p className="text-sm font-bold text-slate-900">Talk to me</p>
          <p className="text-xs text-slate-400 mt-0.5">not actually me but you get the point</p>
        </div>
      </div>
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
    </div>
  )
}
