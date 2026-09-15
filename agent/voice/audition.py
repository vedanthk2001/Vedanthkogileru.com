#!/usr/bin/env python3
"""Hear candidate spellings of the name in the real clone voice, before pushing anything.

The name is fixed at the TTS layer by `pronunciation` in agent/agent.json, and
the only way to judge a respelling is to hear it in this exact voice and model.
Guessing and pushing costs a live call per guess.

    ELEVENLABS_API_KEY=... python3 agent/voice/audition.py                   # the shipped model
    ELEVENLABS_API_KEY=... python3 agent/voice/audition.py eleven_flash_v2   # adds phoneme candidates

Writes agent/voice/audition/<model>/NN-<label>.mp3, which is gitignored. Play in order:
    for f in agent/voice/audition/*/*.mp3; do echo "$f"; afplay "$f"; done

Cost: about 70 characters a candidate, under 1,000 of the Starter tier's
~40,000 monthly characters per model. Voice id, settings and the current
pronunciation come from agent.json, so this always auditions what would ship.
It talks to the voice provider directly, so it works whatever platform runs the agent.
"""
import json, os, pathlib, sys, urllib.error, urllib.request

HERE = pathlib.Path(__file__).resolve().parent
AGENT = HERE.parent
WORD = "Vedanth"

# The opening line is the worst case for the name: it lands three words in.
LINE = "Hey, I'm {name}. Not actually, I'm the AI version, but you get the idea."

# Plain respellings work on every model. The target is वेदांत: "vay", a dental
# unaspirated d, a long "aa", and a dental t with no English "th" fricative.
RESPELLINGS = [
    ("vedaant",     "Vedaant"),
    ("vaydaant",    "Vaydaant"),
    ("vay-daant",   "Vay-daant"),
    ("vedant",      "Vedant"),
    ("vaydahnt",    "Vaydahnt"),
    ("vay-dhaanth", "Vay-dhaanth"),
]

# Phoneme tags are honoured only by the English-only models. Every other model
# skips them and reads the fallback word, so they are not sent there at all.
PHONEME_MODELS = {"eleven_flash_v2", "eleven_turbo_v2"}
PHONEME_CANDIDATES = [
    ("cmu", f'<phoneme alphabet="cmu-arpabet" ph="V EY0 D AA1 N T">{WORD}</phoneme>'),
    ("ipa", f'<phoneme alphabet="ipa" ph="veɪˈdɑːnt">{WORD}</phoneme>'),
]


def main():
    key = os.environ.get("ELEVENLABS_API_KEY")
    if not key:
        sys.exit("Set ELEVENLABS_API_KEY in your shell. Never write it to a file in this repo.")
    agent = json.loads((AGENT / "agent.json").read_text(encoding="utf-8"))
    voice = agent["voice"]
    if voice["provider"] != "elevenlabs":
        sys.exit(f"voice.provider is {voice['provider']!r}; this script only speaks ElevenLabs.")
    current = next((p["say"] for p in agent.get("pronunciation", []) if p["word"] == WORD), None)
    base = [("baseline", WORD)] + ([("current", current)] if current else []) + RESPELLINGS
    settings = {"stability": voice.get("stability", 0.5), "similarity_boost": voice.get("similarityBoost", 0.75)}

    for model in sys.argv[1:] or [voice["model"]]:
        out = HERE / "audition" / model
        out.mkdir(parents=True, exist_ok=True)
        print(f"\n{model}")
        for n, (label, name) in enumerate(base + (PHONEME_CANDIDATES if model in PHONEME_MODELS else []), 1):
            req = urllib.request.Request(
                f"https://api.elevenlabs.io/v1/text-to-speech/{voice['voiceId']}?output_format=mp3_44100_128",
                data=json.dumps({"text": LINE.format(name=name), "model_id": model, "voice_settings": settings}).encode(),
                headers={"xi-api-key": key, "Content-Type": "application/json", "Accept": "audio/mpeg"},
                method="POST")
            path = out / f"{n:02d}-{label}.mp3"
            try:
                with urllib.request.urlopen(req, timeout=60) as r:
                    path.write_bytes(r.read())
                print(f"  {path.relative_to(AGENT.parent)}   {name}")
            except urllib.error.HTTPError as e:
                print(f"  FAILED {label}: HTTP {e.code} {e.read()[:200]!r}")
    print(f"\nPut the winner in agent.json as pronunciation[].say for {WORD!r}, then run that runtime's push.py.")


if __name__ == "__main__":
    main()
