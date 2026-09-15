#!/usr/bin/env python3
"""Push the agent to the live Vapi assistant, and prove it landed.

    VAPI_PRIVATE_KEY=... python3 agent/providers/vapi/push.py --check   # live vs repo, changes nothing
    VAPI_PRIVATE_KEY=... python3 agent/providers/vapi/push.py           # build, PATCH, read back, verify

Sends the whole assistant from build.py. PATCH replaces each top-level object
rather than merging it: that is how a partial PATCH once wiped the prompt while
returning 200 OK, and why an older one-liner that sent only `model` never
shipped anything under `voice`. After the PATCH the assistant is read back and
every value the repo defines is compared. Defaults Vapi adds on its side are
ignored, since the repo never set them.
"""
import json, os, pathlib, sys, urllib.error, urllib.request

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from build import build, load  # noqa: E402

_MISSING = object()


def call(method, url, key, body=None):
    req = urllib.request.Request(
        url, method=method, data=None if body is None else json.dumps(body).encode(),
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        sys.exit(f"{method} failed: HTTP {e.code} {e.read()[:300]!r}")


def mismatches(want, live, path=""):
    """(path, want, live) wherever live lacks what the repo defines. Extra live keys are fine."""
    if isinstance(want, dict):
        if not isinstance(want, dict) or not isinstance(live, dict):
            return [(path, want, live)]
        return [m for k, v in want.items()
                for m in mismatches(v, live.get(k, _MISSING), f"{path}.{k}" if path else k)]
    if isinstance(want, list):
        if not isinstance(live, list) or len(live) != len(want):
            return [(path, want, live)]
        return [m for i, (w, l) in enumerate(zip(want, live)) for m in mismatches(w, l, f"{path}[{i}]")]
    return [] if want == live else [(path, want, live)]


def show(value):
    if value is _MISSING:
        return "(not set)"
    if isinstance(value, str) and len(value) > 120:
        return f"<{len(value)} chars> {value[:60]!r}…"
    return repr(value)[:160]


def report(want, live):
    found = mismatches(want, live)
    if not found:
        print("  every value the repo defines matches live")
    for path, w, l in found:
        print(f"  DIFF  {path}\n          live : {show(l)}\n          repo : {show(w)}")
    return found


def main():
    key = os.environ.get("VAPI_PRIVATE_KEY")
    if not key:
        sys.exit("Set VAPI_PRIVATE_KEY in your shell. Never write it to a file in this repo.")
    agent, prompt, provider = load()
    want = build(agent, prompt, provider)
    url = f"https://api.vapi.ai/assistant/{provider['client']['NEXT_PUBLIC_VAPI_ASSISTANT_ID']}"

    print("Live vs repo, before:")
    drift = report(want, call("GET", url, key))
    if "--check" in sys.argv:
        print("\nIn sync." if not drift else f"\n{len(drift)} value(s) differ. Run without --check to push.")
        sys.exit(1 if drift else 0)

    call("PATCH", url, key, want)
    print("\nLive vs repo, after PATCH:")
    if report(want, call("GET", url, key)):
        sys.exit("\nMISMATCH after PATCH. Do not trust the live agent until this is resolved.")
    print("\nLive matches the repo.")


if __name__ == "__main__":
    main()
