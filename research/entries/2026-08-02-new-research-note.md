---
title: "Defining a CLI-Specific Failure Taxonomy"
createdAt: "2026-08-11T06:14:48.691Z"
updatedAt: "2026-08-11T06:14:48.691Z"
project: "cli-agent-failure-recovery"
tags:
  - "research-notes"
  - "benchmark-design"
status: "draft"
summary: "Adapting ToolMaze's explicit/implicit x transient/permanent failure taxonomy to real CLI and sysadmin failure modes, identifying the implicit-permanent case as the core research target."
---

## Goal

Before designing any benchmark tasks, define a clear taxonomy of failure types 
specific to CLI/sysadmin work. Reusing an existing, validated structure rather 
than inventing one from scratch keeps this grounded in prior research and makes 
the work easy to position relative to ToolMaze and Failing Tools.

## Taxonomy

Adapted from ToolMaze's 2x2 structure: **error manifestation** (explicit vs. 
implicit) crossed with **temporal persistence** (transient vs. permanent).

| Category | Explicit (loud) | Implicit (silent) |
|---|---|---|
| **Transient** | Command returns a clear timeout or "resource busy" error — e.g. `systemctl restart nginx` fails with "Job is already running" | Command reports success but underlying state briefly lags — e.g. `df -h` returns stale cached free-space numbers right after a large delete |
| **Permanent** | Command returns a clear, unrecoverable error — e.g. `Permission denied`, `command not found`, `No such file or directory` | Command reports success but silently did the wrong thing — e.g. `systemctl restart nginx` returns exit code 0 but the process actually crashed on startup |

## Four illustrative scenarios

1. **Explicit-Transient** — `curl` to an internal health-check endpoint times 
   out once due to a brief network blip, succeeds on retry.
2. **Explicit-Permanent** — Agent tries to delete a file it doesn't have 
   permission for; clear `Permission denied`, retrying won't help, needs `sudo` 
   or a different approach.
3. **Implicit-Transient** — Agent checks disk usage right after a large file 
   delete; the filesystem hasn't flushed yet, so `du` reports space as still 
   occupied. Re-checking a moment later gives the correct answer.
4. **Implicit-Permanent** — Agent restarts a service, gets exit code 0, but the 
   service actually crashed immediately after due to a config error. The 
   "success" signal is simply wrong.

## Why Implicit-Permanent is the priority case

This cell is the closest analogue to what ToolMaze calls "over-trust in 
corrupted outputs" and what Failing Tools calls "silent no-ops." It is also the 
scenario where CLI environments differ most interestingly from the API-calling 
environments those benchmarks tested: a follow-up command (`systemctl status`, 
re-listing a directory, checking a log) can often reveal the truth cheaply — 
but only if the agent thinks to run it. This is the behavior the research 
question is actually about: does the agent verify, or does it trust the first 
result?

## Next steps

1. Design 2-3 initial tasks specifically targeting the Implicit-Permanent case
2. Extend to a small set covering the other three cells for completeness
3. Define what counts as "verification behavior" precisely, so it can be 
   scored automatically rather than judged manually