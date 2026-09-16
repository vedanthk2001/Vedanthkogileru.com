'use client'

import { useEffect, useRef, useState } from 'react'
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
      // the transcript, which is the only thing this panel is for.
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

  // A turn opens on speech, which can land a beat before any words do. Skip the
  // empty ones or the panel flashes a bubble with nothing in it.
  const turns = convo.turns.filter((t) => t.text || t.live)

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
      <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-2 pt-4">
        {turns.map((turn) => {
          const agent = turn.role === 'assistant'
          return (
            /* Filled and left for him, outlined and right for the caller. Two
               speakers on a white panel need a difference in weight, not a
               second colour: his answer is what the visitor came for, so the
               caller's side recedes the way the old slate-500 line did. */
            <div
              key={turn.id}
              className={`max-w-[85%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
                agent
                  ? 'self-start rounded-bl-md bg-indigo-50 text-slate-800'
                  : 'self-end rounded-br-md border border-slate-200 text-slate-500'
              }`}
            >
              {/* Shape and side carry the speaker on screen, so a visible label
                  is one more thing to read. aria-live has neither, and would
                  otherwise announce both halves of the call in one voice. */}
              <span className="sr-only">{agent ? 'Vedanth:' : 'You:'}</span>
              {turn.text}
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
          /* An orb, not a pill. A pill reads as one more button next to the nav
             links; the ring says something is listening. Same affordance as the
             desktop card, so the two sizes are recognisably one system. */
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
