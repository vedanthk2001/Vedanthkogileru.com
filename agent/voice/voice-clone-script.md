# Voice clone: recording script and method

For an ElevenLabs Instant Voice Clone, then connected to Vapi as a credential
and set on the `Vedanth Web Agent` assistant.

---

## Why this and not the Fireflies audio

Instant Voice Cloning wants **one to three minutes of clean, single-speaker
audio**. Past that, more audio does not improve the clone, and noisy audio
actively degrades it. Meeting recordings are the wrong shape: two or more
speakers, crosstalk, aggressive conference-call compression, variable mic
distance, and room noise. Hours of that produces a worse clone than two clean
minutes, not a better one.

The tier that genuinely wants hours, Professional Voice Cloning, wants those
hours to be studio-consistent. Conference audio fails that bar too.

---

## Method

- **One microphone, one take.** AirPods are acceptable. A USB mic is better.
  Laptop speakers-array mic is the worst option, it picks up the room
- **Quiet room, soft furnishings.** Hard rooms ring, and the clone learns the room
- **No music, no background, no second voice.** Nobody else in the recording
- **Normal speaking pace and volume.** Talk the way you talk on a call, not the
  way you read aloud. Performed narration clones into a narrator
- **Do not edit out every breath.** A little natural rhythm helps
- Record **three minutes**, keep the best **two**

Aim for the register the agent actually uses: quiet, precise, dry. If the sample
is bright and presentational, every answer the agent gives will be too.

---

## The script

Read it straight through. If you fumble, carry on, do not restart.

> Hey, I'm Vedanth. I'm a product manager, and I work in voice AI.
>
> I started out in fintech almost by accident. I was at BITS Pilani doing
> electrical engineering, a master's in physics and a minor in finance, mostly
> because I could not pick one. What I found was that the physics and the
> investing were doing the same thing. Both of them are really about thinking
> clearly when you do not have enough information.
>
> That turned into a YouTube channel teaching teenagers how to invest, which
> turned into three years at CASHe, which turned into this.
>
> At CASHe I was on peer to peer lending from the day it went live through to a
> hundred crore. Then I was founding product manager twice over, once on a fixed
> income product and once on a privilege platform for mutual fund investors. I
> built the analytics the whole team ran on, twice, which the second time was
> probably me not delegating.
>
> Now I work on voice AI. We built our own stack rather than buying one, so the
> work runs from picking providers right up into the application layer. Deep
> multi-agent workflows that take a problem end to end, in more than ten
> languages.
>
> Away from the desk I play a fair bit of chess. Tal and Dubov are the ones I
> like, because both of them would rather be interesting than correct. I picked
> up snooker in college and ended up on the team. And I climb, mostly in the
> Sahyadris.
>
> If you want to talk about fintech, voice AI, or an interesting product
> problem, I am easy to reach. Thanks for listening.

Roughly two minutes at a natural pace.

---

## After recording

1. Export as **WAV or high-bitrate MP3**, mono is fine, do not normalise or
   noise-gate it
2. ElevenLabs, Voices, Add Voice, **Instant Voice Clone**, upload, name it
   `Vedanth`
3. Copy the **voice ID**
4. Send the voice ID and an ElevenLabs API key, and the Vapi side is two calls:
   add the ElevenLabs credential, then set

```json
"voice": { "provider": "11labs", "voiceId": "<id>", "stability": 0.5, "similarityBoost": 0.75 }
```

on assistant `b5988c2d-375e-4165-9e6a-2b6869b919e8`, replacing the `vapi / Elliot`
placeholder.

> Instant cloning needs a paid ElevenLabs tier. The lowest paid tier is enough.

---

## If you would rather use existing audio

It can work, but only from recordings where **you are the only person speaking**,
and only from material that is yours to upload. That rules out client calls,
vendor calls and anything under `interviews-taken`. Diarise, keep only your
segments, concatenate to about three minutes, and check the joins do not clip.
That is more work than the take above, for a worse sample.
