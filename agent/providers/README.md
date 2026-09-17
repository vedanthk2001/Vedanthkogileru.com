# Providers

`agent/agent.json` and `agent/prompt.md` say what the agent is, and nothing in
them belongs to one platform. Each folder here says how one platform runs it.
Moving off Vapi means adding a sibling of `vapi/`, not editing the agent.

## What a provider folder holds

| File | Job |
|---|---|
| `provider.json` | What only this platform knows: uploaded file ids, platform-only settings |
| `provider.json` → `client` | The `NEXT_PUBLIC_*` values the browser needs. `next.config.js` inlines them into the site's JS, so **public-by-design values only** |
| `build.py` | `agent.json` + `prompt.md` → this platform's config. No network |
| `push.py` | Build, push, read back, compare. The secret comes from the shell, never a file |

Plus one file outside `agent/`: `app/voice/<name>.ts`, an adapter implementing
`VoiceProvider` from `app/voice/types.ts`, registered in `app/voice/index.ts`.
`VoicePanel.tsx` only talks to that interface, so it does not change when the
platform does.

## Switching platform

1. Add `agent/providers/<name>/` with the files above
2. Add `app/voice/<name>.ts` and register it in `app/voice/index.ts`
3. Push the agent with the new `push.py`
4. Set `"runtime": "<name>"` in `agent/agent.json`, rebuild, deploy

Usually survives a switch untouched: the prompt, `knowledge/`, the
pronunciation list, the capture schema, and the ElevenLabs voice clone if the
new platform can drive ElevenLabs.

## Secrets

Private API keys are never committed, private repo or not. They live in a
password manager, in the shell for a push, or in GitHub Actions secrets if
pushes are ever automated. Each `push.py` names the variable it reads.

## How `vapi/` maps the neutral fields

| `agent.json` | Vapi assistant |
|---|---|
| `name`, `firstMessage` | same |
| `speaksFirst` | `firstMessageMode` |
| `llm` + `prompt.md` | `model`, with the prompt as the single system message |
| `knowledge.files`, `topK` | `model.knowledgeBase`, ids from `provider.json` |
| `voice` | `voice`, with `elevenlabs` renamed `11labs`, settings verbatim |
| `pronunciation` | `voice.chunkPlan.formatPlan.replacements`, exact match |
| `speech.keepNumbersAsWritten` | `voice.chunkPlan.formatPlan.formattersEnabled`, every formatter but `number` |
| `transcriber.keyterms` | `keyterm` on nova-3, `keywords` otherwise |
| `transcriber.numerals` | `transcriber.numerals`, false stops digits in the transcript |
| `actions` | `model.tools`, function tools with no `server` url, so they run in the browser |
| `limits` | `maxDurationSeconds`, `silenceTimeoutSeconds` |
| `endCall` | `endCallFunctionEnabled`, `endCallMessage` |
| `capture` | `analysisPlan` |

Uploading a changed knowledge file is still manual: send it to Vapi with
`-F "file=@x.md;type=text/markdown"` (Vapi rejects curl's default mime type for
`.md`), then put the new id in `provider.json`.
