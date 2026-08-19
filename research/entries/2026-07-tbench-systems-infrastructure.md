---
title: "T-Bench Task Engineering — Systems Infrastructure & Operations"
createdAt: "2026-07-10T10:00:00.000Z"
updatedAt: "2026-08-19T10:00:00.000Z"
project: "handshake-ai-tbench"
tags:
  - "benchmark-engineering"
  - "harbor-framework"
  - "systems"
  - "infrastructure"
  - "distributed-systems"
status: "published"
summary: "Designed and completed 2 Terminal-Bench-style systems infrastructure tasks — covering encrypted ZFS pool forensic recovery and concurrent job scheduler race condition debugging with timezone-aware scheduling."
---

## Overview

Completed 2 systems infrastructure tasks under the Handshake AI Dynamo benchmark program. Both tasks required low-level systems knowledge, precise tool usage, and adversarial environment reasoning.

## Tasks Completed

### 1. Encrypted ZFS Pool Forensic Recovery

Given exported ZFS pool image files on loopback block devices, reconstructed and imported a degraded mirrored pool. Required identifying valid ZFS labels among stale device images and red herrings, finding the single valid encryption keyfile among multiple candidates, and locating the correct historical snapshot (rollback target) by inspecting dataset contents. Produced `zpool status` output post-scrub with all devices `ONLINE` and zero checksum errors, plus a structured JSON report with pool device count, scrub stats, active keyfile name, and SHA-256 file hashes from the recovered snapshot.

**Key techniques:** ZFS label inspection, mirror vdev recovery, native encryption (`zfs load-key`), snapshot dataset traversal, `zfs promote` restructuring, deterministic scrub verification

---

### 2. Job Scheduler Race Condition Debugging

Debugged a Python job scheduling service backed by PostgreSQL, exhibiting incorrect behaviour under adversarial concurrent timing conditions. The service handled task queues with concurrent workers, recurring schedules with regional timezone awareness, inter-task dependencies, and external action execution. Fixed race conditions and timing bugs without modifying the fault-injection harness, ensuring correct results across 7 scenario metrics: execution counts, cron fire times, stale read detection, missed trigger detection, and worker throughput.

**Key techniques:** Concurrent systems debugging, PostgreSQL transaction isolation, timezone-aware cron scheduling (DST edge cases), race condition identification, harness-constrained remediation

---

## Infrastructure

Both tasks built on the Harbor framework with Dockerfile-based isolated environments, automated pytest scoring, and iterative PR-based review against Dynamo rubric checks.
