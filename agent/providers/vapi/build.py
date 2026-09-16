#!/usr/bin/env python3
"""Compile the provider-neutral agent into a Vapi assistant.

    python3 agent/providers/vapi/build.py              # print what push.py would send
    python3 agent/providers/vapi/build.py --diff FILE  # compare with a saved payload, exit 1 on any difference

Source of truth is agent/agent.json plus agent/prompt.md. Everything Vapi-shaped
happens here and nowhere else, so moving off Vapi means writing a sibling of
this folder, not editing the agent. provider.json beside this file holds what
only Vapi knows: uploaded file ids, message subscriptions, public client config.
"""
import json, pathlib, sys

HERE = pathlib.Path(__file__).resolve().parent
AGENT = HERE.parent.parent

# Vapi's name for a voice provider, where it differs from the agent's.
VOICE_PROVIDERS = {"elevenlabs": "11labs"}


def keyterm_field(model):
    # Deepgram nova-3 takes `keyterm`, nova-2 and older take `keywords`. Sending
    # the wrong one is accepted and silently dropped, so the model decides.
    return "keyterm" if model.startswith("nova-3") else "keywords"


def load():
    agent = json.loads((AGENT / "agent.json").read_text(encoding="utf-8"))
    prompt = (AGENT / "prompt.md").read_text(encoding="utf-8")
    # Editors keep a newline at end of file and the prompt does not carry one.
    # Exactly one is dropped, or every save would show up as a live diff.
    if prompt.endswith("\n"):
        prompt = prompt[:-1]
    provider = json.loads((HERE / "provider.json").read_text(encoding="utf-8"))
    return agent, prompt, provider


def build(agent, prompt, provider):
    v = agent["voice"]
    voice = {"provider": VOICE_PROVIDERS.get(v["provider"], v["provider"]),
             **{k: val for k, val in v.items() if k != "provider"}}
    if agent.get("pronunciation"):
        # Rewrites text on its way to TTS only, so the transcript keeps the
        # written form. Exact match: a respelled occurrence silently won't fire.
        voice["chunkPlan"] = {"enabled": True, "formatPlan": {"enabled": True, "replacements": [
            {"type": "exact", "key": p["word"], "value": p["say"], "replaceAllEnabled": True}
            for p in agent["pronunciation"]]}}

    t = agent["transcriber"]
    transcriber = {"provider": t["provider"], "model": t["model"], "language": t["language"]}
    if t.get("keyterms"):
        transcriber[keyterm_field(t["model"])] = t["keyterms"]

    model = {**agent["llm"], "messages": [{"role": "system", "content": prompt}]}
    if agent.get("knowledge"):
        ids = provider["knowledgeBase"]["fileIds"]
        missing = [f for f in agent["knowledge"]["files"] if f not in ids]
        if missing:
            sys.exit(f"No Vapi file id for {missing}. Upload it, then add the id to provider.json.")
        model["knowledgeBase"] = {"provider": provider["knowledgeBase"]["provider"],
                                  "topK": agent["knowledge"]["topK"],
                                  "fileIds": [ids[f] for f in agent["knowledge"]["files"]]}
    if agent.get("actions"):
        # No `server` key is what makes these client-side: Vapi hands the call to
        # the browser instead of posting it anywhere. `async` because a client
        # tool has no way to return a result, which also means a request-start
        # message would never be spoken, so none is sent.
        model["tools"] = [{"type": "function", "async": True,
                           "function": {"name": a["name"], "description": a["description"],
                                        "parameters": a["parameters"]}}
                          for a in agent["actions"]]

    assistant = {
        "name": agent["name"],
        "firstMessage": agent["firstMessage"],
        "firstMessageMode": "assistant-speaks-first" if agent.get("speaksFirst", True) else "assistant-waits-for-user",
        "maxDurationSeconds": agent["limits"]["maxDurationSeconds"],
        "silenceTimeoutSeconds": agent["limits"]["silenceTimeoutSeconds"],
        "endCallFunctionEnabled": agent["endCall"]["enabled"],
        "endCallMessage": agent["endCall"]["message"],
        **provider.get("assistant", {}),
        "transcriber": transcriber,
        "voice": voice,
        "model": model,
    }
    if agent.get("capture"):
        assistant["analysisPlan"] = {
            "structuredDataPlan": {"enabled": True, "schema": agent["capture"]["schema"]},
            "summaryPlan": {"enabled": bool(agent["capture"].get("summary"))},
        }
    return assistant


def diff(a, b, path=""):
    """Every path where two JSON values differ. Key order is ignored."""
    if isinstance(a, dict) and isinstance(b, dict):
        out = []
        for k in sorted(set(a) | set(b)):
            p = f"{path}.{k}" if path else k
            out += [p] if (k not in a or k not in b) else diff(a[k], b[k], p)
        return out
    if isinstance(a, list) and isinstance(b, list) and len(a) == len(b):
        return [q for i, (x, y) in enumerate(zip(a, b)) for q in diff(x, y, f"{path}[{i}]")]
    return [] if a == b else [path]


def main():
    payload = build(*load())
    if "--diff" in sys.argv:
        other = json.loads(pathlib.Path(sys.argv[sys.argv.index("--diff") + 1]).read_text(encoding="utf-8"))
        found = diff(payload, other)
        print("identical" if not found else "differs at:\n  " + "\n  ".join(found))
        sys.exit(1 if found else 0)
    print(json.dumps(payload, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
