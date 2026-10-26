#!/usr/bin/env python3
import argparse, hashlib, json, subprocess, time
from pathlib import Path

STATE_DIR = Path(".agent-state")
STATE_FILE = STATE_DIR / "delivery-gate.json"
IGNORE_PREFIXES = (".agent-state/", "node_modules/", "dist/", "build/", "coverage/", "vendor/")

def run(*args):
    p = subprocess.run(args, text=True, capture_output=True)
    if p.returncode != 0:
        raise SystemExit(p.stderr.strip() or f"command failed: {' '.join(args)}")
    return p.stdout

def relevant(path):
    path = path.replace("\\", "/")
    return not path.startswith(IGNORE_PREFIXES)

def snapshot():
    head = run("git", "rev-parse", "HEAD").strip()
    status = run("git", "status", "--porcelain=v1", "-uall")
    changed, untracked = [], []

    for line in status.splitlines():
        if not line:
            continue
        path = line[3:]
        if " -> " in path:
            path = path.split(" -> ", 1)[1]
        if relevant(path):
            changed.append(line)
            if line.startswith("?? "):
                untracked.append(path)

    unstaged = run("git", "diff", "--binary", "--", ".")
    staged = run("git", "diff", "--cached", "--binary", "--", ".")

    h = hashlib.sha256()
    h.update(("HEAD\0" + head + "\0").encode())
    h.update(("\n".join(changed) + "\0").encode())
    h.update(unstaged.encode())
    h.update(staged.encode())

    for path in sorted(untracked):
        p = Path(path)
        h.update(("UNTRACKED\0" + path + "\0").encode())
        if p.is_file():
            h.update(p.read_bytes())

    return {"head": head, "fingerprint": h.hexdigest(), "changed": changed}

def stored():
    return json.loads(STATE_FILE.read_text()) if STATE_FILE.exists() else None

def approve():
    data = {"version": 2, "approved_at_unix": int(time.time()), **snapshot()}
    STATE_DIR.mkdir(parents=True, exist_ok=True)
    STATE_FILE.write_text(json.dumps(data, indent=2), encoding="utf-8")
    print(json.dumps({"approved": True, **data}, indent=2))

def check(exit_on_failure=True):
    current, previous = snapshot(), stored()
    ok = bool(previous and previous.get("fingerprint") == current["fingerprint"])
    print(json.dumps({
        "approved": ok,
        "current": current,
        "approved_state": previous,
        "next_action": "proceed" if ok else "run delivery-quality-gate and approve the resulting exact state"
    }, indent=2))
    if exit_on_failure and not ok:
        raise SystemExit(1)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("command", choices=["approve", "check", "status"])
    cmd = ap.parse_args().command
    if cmd == "approve":
        approve()
    elif cmd == "check":
        check()
    else:
        check(exit_on_failure=False)

if __name__ == "__main__":
    main()
