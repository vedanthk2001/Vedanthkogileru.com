#!/usr/bin/env python3
"""
Build a single-speaker voice-cloning sample from a Fireflies meeting recording.

Why this exists: there is no clean solo recording of Vedanth, but Fireflies has
129 meetings. The usable ones are two-speaker internal calls containing a long
uninterrupted stretch of him talking. This finds that stretch using the local
transcript's timestamps, then cuts it out of the downloaded MP3.

There is no ffmpeg or mp3 encoder on this Mac, so the cut is done by **splicing
at MP3 frame boundaries**. No re-encode, so no additional generation loss, which
matters because the source is already 64 kbps conference audio.

Usage:
  python3 extract-sample.py <meetings-relative-folder> [seconds]

Example:
  python3 extract-sample.py internal/<meeting-folder> 180
"""
import os
import re, sys, pathlib, json, urllib.request

FIREFLIES_KEY = os.environ.get("FIREFLIES_API_KEY", "")  # from the shell, never hardcoded
MEETINGS = pathlib.Path.home() / "Desktop" / "Meetings"
SPEAKER = "vedanth"
LINE = re.compile(r'^\[(\d+):(\d+)\]\s+\*\*([^*]+?):\*\*\s*(.*)$')

BR = [0,32,40,48,56,64,80,96,112,128,160,192,224,256,320,0]
SR = [44100,48000,32000]


def events(folder: pathlib.Path):
    txt = (folder / "transcript.md").read_text(errors="ignore")
    fid = re.search(r'\*\*Fireflies ID:\*\*\s*(\S+)', txt)
    ev = []
    for line in txt.splitlines():
        g = LINE.match(line.strip())
        if g:
            ev.append((int(g.group(1))*60 + int(g.group(2)), g.group(3).strip(), g.group(4)))
    ev.sort(key=lambda x: x[0])
    return (fid.group(1) if fid else None), ev


def longest_solo_run(ev):
    """Merge consecutive target-speaker lines. A run ends when anyone else starts."""
    runs, cur = [], None
    for i, (t, name, text) in enumerate(ev):
        nxt = ev[i+1][0] if i+1 < len(ev) else t + 6
        if SPEAKER in name.lower():
            if cur is None: cur = [t, nxt, len(text)]
            else: cur[1], cur[2] = nxt, cur[2] + len(text)
        elif cur:
            runs.append(tuple(cur)); cur = None
    if cur: runs.append(tuple(cur))
    return max(runs, key=lambda r: r[1] - r[0]) if runs else None


def densest_window(ev, start, end, want):
    """Chars per second, so we skip long pauses and pick real continuous speech."""
    lines = [e for e in ev if start <= e[0] < end and SPEAKER in e[1].lower()]
    best = None
    for s in range(start, max(start + 1, end - want), 5):
        ch = sum(len(t) for tt, _, t in lines if s <= tt < s + want)
        if best is None or ch > best[1]:
            best = (s, ch)
    return best[0], best[0] + want, best[1]


def audio_url(fid):
    req = urllib.request.Request(
        "https://api.fireflies.ai/graphql",
        data=json.dumps({"query": f'{{ transcript(id:"{fid}"){{ title duration audio_url }} }}'}).encode(),
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {FIREFLIES_KEY}"})
    t = (json.load(urllib.request.urlopen(req, timeout=60)).get("data") or {}).get("transcript")
    return t["audio_url"], t["title"], t["duration"]


def splice(src: bytes, start: float, end: float) -> bytes:
    """Copy only whole MP3 frames whose start time falls in [start, end)."""
    i = 0
    if src[:3] == b"ID3":
        i = 10 + ((src[6]&0x7f)<<21 | (src[7]&0x7f)<<14 | (src[8]&0x7f)<<7 | (src[9]&0x7f))
    out, t, skipped_xing = bytearray(), 0.0, False
    while i < len(src) - 4:
        if src[i] == 0xFF and (src[i+1] & 0xE0) == 0xE0:
            ver, lay = (src[i+1]>>3)&3, (src[i+1]>>1)&3
            bi, si, pad = (src[i+2]>>4)&0xF, (src[i+2]>>2)&3, (src[i+2]>>1)&1
            if ver == 3 and lay == 1 and bi not in (0, 15) and si != 3:
                rate = SR[si]
                flen = int(144 * BR[bi] * 1000 / rate) + pad
                frame = src[i:i+flen]
                # The VBR header frame carries no audio. Copying it makes every
                # player mis-report the duration of the spliced file.
                if not skipped_xing and (b"Xing" in frame[:64] or b"Info" in frame[:64]):
                    skipped_xing = True
                else:
                    if start <= t < end:
                        out += frame
                    t += 1152 / rate
                i += flen
                continue
        i += 1
    return bytes(out)


def main():
    rel = sys.argv[1] if len(sys.argv) > 1 else "internal/<meeting-folder>"
    want = int(sys.argv[2]) if len(sys.argv) > 2 else 180
    folder = MEETINGS / rel

    fid, ev = events(folder)
    speakers = sorted({e[1] for e in ev})
    print(f"folder    : {rel}")
    print(f"speakers  : {speakers}")
    if len(speakers) > 2:
        print("WARNING: more than two speakers, diarisation errors are likelier")

    run = longest_solo_run(ev)
    if not run:
        sys.exit("no solo run found for speaker")
    print(f"longest solo run: {run[0]//60}:{run[0]%60:02d} -> {run[1]//60}:{run[1]%60:02d}  ({run[1]-run[0]}s)")
    if run[1] - run[0] < want + 60:
        print("WARNING: run barely longer than the sample; timestamp drift could catch another speaker")

    s, e, chars = densest_window(ev, run[0], run[1], want)
    print(f"densest {want}s : {s//60}:{s%60:02d} -> {e//60}:{e%60:02d}  ({chars/want:.1f} chars/sec)")

    url, title, dur = audio_url(fid)
    print(f"fireflies : {title} ({dur} min)")
    raw = urllib.request.urlopen(url, timeout=900).read()
    print(f"downloaded: {len(raw):,} bytes")

    out = splice(raw, s, e)
    pathlib.Path("vedanth_sample.mp3").write_bytes(out)
    print(f"wrote vedanth_sample.mp3  ({len(out):,} bytes)")


if __name__ == "__main__":
    main()
