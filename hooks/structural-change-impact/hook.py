#!/usr/bin/env python3
import argparse, json, subprocess

def git(*args, check=True):
    p = subprocess.run(["git", *args], text=True, capture_output=True)
    if check and p.returncode != 0:
        raise SystemExit(p.stderr.strip() or "git command failed")
    return p.stdout

def lines(value):
    return [x for x in value.splitlines() if x.strip()]

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", default="HEAD")
    args = ap.parse_args()

    result = {
        "hook": "structural-change-impact",
        "version": 2,
        "role": "evidence-collector",
        "base": args.base,
        "changed_files": lines(git("diff", "--name-only", args.base)),
        "staged_files": lines(git("diff", "--cached", "--name-only")),
        "unstaged_files": lines(git("diff", "--name-only")),
        "untracked_files": lines(git("ls-files", "--others", "--exclude-standard")),
        "diff_stat": git("diff", "--stat", args.base).strip(),
        "next_action": (
            "Provide this evidence to the model. The relevant skill decides whether "
            "semantic impact analysis is needed and which tools/sources to inspect."
        )
    }
    print(json.dumps(result, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()
