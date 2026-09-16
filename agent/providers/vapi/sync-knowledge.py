#!/usr/bin/env python3
"""Upload agent/knowledge/*.md to Vapi and record the file ids in provider.json.

    source ~/.config/vedanthkogileru/env
    python3 agent/providers/vapi/sync-knowledge.py            # upload anything without an id
    python3 agent/providers/vapi/sync-knowledge.py --force    # re-upload everything, replacing ids
    python3 agent/providers/vapi/sync-knowledge.py --check    # report only, change nothing

The knowledge base is retrieval, so a file only reaches the agent once it is
uploaded and its id is attached. Editing a .md alone changes nothing live. After
this, run push.py so the assistant points at the new ids.

Everything is uploaded as .txt, not .md. Vapi accepts text/markdown with a 201
and then leaves the file at status "failed" forever, so it is never retrieved:
the whole knowledge base was dead that way for weeks without a single error.
text/plain reaches status "done". The content is unchanged, only the filename
and mime type differ, and the status is checked after every upload rather than
trusting the 201.
"""
import json, mimetypes, os, pathlib, sys, urllib.error, urllib.request, uuid

HERE = pathlib.Path(__file__).resolve().parent
AGENT = HERE.parent.parent
API = "https://api.vapi.ai"
# Cloudflare in front of the API rejects urllib's default user agent with
# error 1010, so every request identifies itself.
USER_AGENT = "vedanthkogileru-site/1.0"



def request(method, path, key, body=None, content_type=None):
    headers = {"Authorization": f"Bearer {key}", "User-Agent": USER_AGENT}
    if content_type:
        headers["Content-Type"] = content_type
    req = urllib.request.Request(f"{API}{path}", method=method, data=body, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            raw = r.read()
            return json.loads(raw) if raw else {}
    except urllib.error.HTTPError as e:
        sys.exit(f"{method} {path} failed: HTTP {e.code} {e.read()[:300]!r}")


def upload(path, key):
    """multipart/form-data, always as .txt/text/plain. See the module docstring."""
    boundary = uuid.uuid4().hex
    name = path.stem + ".txt"
    mime = "text/plain"
    body = b"".join([
        f"--{boundary}\r\n".encode(),
        f'Content-Disposition: form-data; name="file"; filename="{name}"\r\n'.encode(),
        f"Content-Type: {mime}\r\n\r\n".encode(),
        path.read_bytes(),
        f"\r\n--{boundary}--\r\n".encode(),
    ])
    return request("POST", "/file", key, body, f"multipart/form-data; boundary={boundary}")


def main():
    agent = json.loads((AGENT / "agent.json").read_text(encoding="utf-8"))
    pp = HERE / "provider.json"
    provider = json.loads(pp.read_text(encoding="utf-8"))
    ids = provider["knowledgeBase"]["fileIds"]
    files = agent["knowledge"]["files"]
    force, check = "--force" in sys.argv, "--check" in sys.argv

    todo = files if force else [f for f in files if f not in ids]
    for f in files:
        print(f"  {'upload' if f in todo else 'has id'}  {f}" + ("" if f in todo else f"  {ids[f]}"))
    if check:
        sys.exit(0)
    if not todo:
        print("\nNothing to upload. Run push.py if the assistant still points at old ids.")
        return

    key = os.environ.get("VAPI_PRIVATE_KEY")
    if not key:
        sys.exit("Set VAPI_PRIVATE_KEY. Try: source ~/.config/vedanthkogileru/env")

    for f in todo:
        path = AGENT / f
        if not path.exists():
            sys.exit(f"{f} is listed in agent.json but not on disk.")
        old = ids.get(f)
        new = upload(path, key)
        ids[f] = new["id"]
        print(f"\nuploaded {f} -> {new['id']}")
        status = request("GET", f"/file/{new['id']}", key).get("status")
        print(f"  processing status: {status}")
        if status == "failed":
            sys.exit(f"{f} uploaded but failed to process, so it will never be retrieved.")
        if old and old != new["id"]:
            request("DELETE", f"/file/{old}", key)
            print(f"  removed the previous copy {old}")

    pp.write_text(json.dumps(provider, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print("\nprovider.json updated. Now run push.py so the assistant uses these ids.")


if __name__ == "__main__":
    main()
