# Voice agent, architecture and security

Companion to `CLAUDE.md`, which covers conversation design. This covers what
runs where, what is exposed, and what has to be fixed before it ships.

---

## 1. What actually needs a backend

Worth settling first, because the answer is "less than you think".

| Capability | Needs a server? | Why |
|---|---|---|
| The web call itself | **No** | Browser talks to the voice provider directly using the **public** key |
| **Live scrolling transcript** | **No** | The Web SDK emits transcript events client side. Purely a UI problem |
| Call recordings and transcripts at rest | No | Provider dashboard stores them |
| Structured lead extraction | No | Provider analysis plan does it |
| **Webhook on call end** | **Yes** | Something has to receive the POST |
| **Notify Vedanth of a lead** | **Yes** | Slack or email push |
| Anything touching the **private key** | **Yes** | It must never reach a browser |

**So v1 ships with no backend at all.** The backend below is for lead capture and
notification, and is genuinely optional until call volume justifies it.

---

## 2. Security findings

Audited 7 Sep 2026 against the live site and repo.

### FINDING 1, high, blocks the voice agent
**`http://vedanthkogileru.com` serves 200 over plain HTTP with no redirect to HTTPS.**

Verified: `curl -I http://vedanthkogileru.com/` returns `HTTP/1.1 200 OK`, and
following redirects on the www variant lands on `http://`, not `https://`.

Two consequences, and the first one is fatal to this project:

1. **`getUserMedia` requires a secure context.** On the HTTP origin the
   microphone button simply will not work. No prompt, no error a visitor
   understands. The voice agent is dead on arrival for anyone who reaches the
   site over HTTP.
2. An HTTP page is trivially MITM-able. An attacker on the same network can
   rewrite the page, including injecting a fake mic prompt.

**Fix:** GitHub repo → Settings → Pages → tick **Enforce HTTPS**. One checkbox.
Do this before anything else in this document.

### FINDING 2, medium
**No security headers.** No HSTS, CSP, `X-Frame-Options`, `X-Content-Type-Options`
or `Referrer-Policy` on any response.

GitHub Pages does not allow custom headers, so this cannot be fully fixed while
hosting stays there. Partial mitigation:

- `<meta http-equiv="Content-Security-Policy">` in `layout.tsx`, which covers
  script and connect sources though not framing
- `<meta name="referrer" content="strict-origin-when-cross-origin">`
- Full fix requires fronting the site with Cloudflare, which is free and also
  solves FINDING 1 permanently

### FINDING 3, low in context
**3 npm advisories, 2 high and 1 critical**, all PostCSS reached through Next.js.

Real, but **build-time only**. PostCSS runs during `next build` and never ships
to a browser, and the attack vector requires attacker-controlled CSS input to
his own build. For a static export built locally, exposure is close to zero.

**Fix:** `npm audit fix --force` pulls `next@14.2.35`. Do it, but it is hygiene,
not an incident.

### FINDING 4, high, already known
**The Vapi private key was pasted into a chat transcript.** It is not in the repo
or in git history, both verified clean. It should still be **rotated** in the
provider dashboard, and must never be written to a file in this repo, private or
not: it lives in a password manager, in the shell for a push, or in GitHub
Actions secrets.

### FINDING 5, medium, legal rather than technical
**Calls will be recorded and transcribed, and nothing tells the caller.**

The opening discloses that the agent is an AI. It does not disclose recording.
Under India's DPDP Act, and as basic practice everywhere, a caller should be told
before recording starts. This is also the kind of detail a recruiter notices.

**Fix:** one clause in the opening or the widget UI. See §5.

### FINDING 6, by design but tighten it
**The public key ships in the client bundle.** That is what it is for. But it
should be **domain-restricted** in the provider dashboard so it only works from
`vedanthkogileru.com`. Without that, anyone can lift it and run calls on his
account, on his budget.

### FINDING 7, supply chain
The Web SDK loads from a CDN. **Pin an exact version**, never a floating tag, and
add Subresource Integrity if loading by script tag. Prefer installing it as an
npm dependency so it is bundled and version-locked at build time.

### Clean
- No secrets in the working tree or git history, both greped
- All external origins the page loads are HTTPS, so no mixed content
- `.gitignore` correctly covers `.env` and `.env*.local`
- `out/` is gitignored, so build artefacts are not committed

---

## 3. Backend, when it is needed

Only for webhooks and notification. **Do not build this for v1.**

### Shape

```
Browser ──(public key, WebRTC)──> Voice provider
                                        │
                                        │ webhook: call ended
                                        ▼
                            Cloudflare Worker  ← private key lives here, never in a browser
                                        │
                                        ├── verify webhook signature
                                        ├── extract name, org, intent, outcome
                                        ├── append to a store (KV or a sheet)
                                        └── notify (Slack or email)
```

### Why a Cloudflare Worker

Free tier is more than enough, no infrastructure to run, and it can also front
`vedanthkogileru.com` to fix FINDINGS 1 and 2 permanently. One dependency, two
problems solved.

### Rules for it

- **Verify the webhook signature on every request.** An unauthenticated endpoint
  that writes to a store is an open door
- Private key in Worker secrets, never in code, never in the repo
- Rate limit, and reject bodies over a sane size
- Log no PII beyond what the analysis plan already extracts
- Return 200 quickly and do the work after, so the provider does not retry

---

## 4. Live transcript UI

**This needs no backend.** The Web SDK emits transcript events client side; it is
entirely a rendering problem.

### Events

```js
vapi.on('message', (m) => {
  if (m.type !== 'transcript') return
  // m.role           'user' | 'assistant'
  // m.transcriptType 'partial' | 'final'
  // m.transcript     the text
})
```

- **`partial`** fires continuously as someone speaks. It **replaces** the current
  in-flight line for that role. Do not append, or you get stutter
- **`final`** commits the line. Append it and start a fresh in-flight line

Also useful: `speech-start`, `speech-end`, `call-start`, `call-end`.

### The scroll-and-fade behaviour

The effect is a fixed-height window where new lines enter at the bottom, push
older ones up, and older lines fade as they approach the top.

- Fixed height container, `overflow: hidden`, content anchored to the bottom
- Keep only the last N lines in state, roughly 6 to 8. Drop the rest. Do not
  render an unbounded list and rely on CSS to hide it
- Fade with a CSS mask on the container rather than per-line opacity, so lines
  fade continuously as they rise instead of stepping:
  `mask-image: linear-gradient(to bottom, transparent, black 25%)`
- New lines animate in with a small translate and opacity, roughly 200ms
- Style user and assistant turns differently. Slate for him, lighter for the caller
- The in-flight partial line renders at reduced opacity so it visibly firms up
  when it commits

### Accessibility and privacy

- `aria-live="polite"` on the container so screen readers follow it
- `prefers-reduced-motion`: drop the translate, keep the fade
- The transcript is ephemeral in the UI. Never persist it to `localStorage`, and
  say so if anyone asks

---

## 5. Recording disclosure

Fixes FINDING 5. Two options, and doing both is better.

**In the widget, before the call starts.** One line under the mic button:
> "Calls are recorded and transcribed."

**In the opening line**, if it is kept short enough not to bloat it. Current
opening is already around six seconds, so adding a clause is a real cost. The
widget line is the better place.

---

## 6. Order of work

1. **Tick Enforce HTTPS.** Nothing else matters until the origin is secure
2. Rotate the private key
3. Domain-restrict the public key
4. `npm audit fix --force`
5. Add the meta CSP and referrer policy
6. Add the recording disclosure to the widget
7. Build the call widget and the live transcript, no backend
8. Ship
9. Add the Worker for webhooks only if call volume justifies it
