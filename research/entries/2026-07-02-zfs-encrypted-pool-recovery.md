---
title: "Forensic Recovery of an Encrypted ZFS Mirrored Pool"
createdAt: "2026-07-10T10:00:00.000Z"
updatedAt: "2026-07-10T10:00:00.000Z"
project: "tbench-harbor"
tags:
  - "systems"
  - "zfs"
  - "storage"
  - "cryptography"
  - "forensics"
status: "published"
summary: "Recovered an encrypted ZFS mirrored pool from exported loopback device images — identifying valid vdev members, finding the correct decryption keyfile, and rolling back to a specific historical snapshot."
---

## Task

A ZFS pool (`opsdata`) was exported from a set of loopback block devices now stored as image files. Among these images: some carried valid ZFS labels for the pool, some carried stale labels from a replaced mirror member, and at least one was a red herring that never participated in the pool. The pool used ZFS native encryption with one valid keyfile among several candidates.

Goal: import the correct device set, decrypt the pool, identify the right historical snapshot (containing `report_2024.pdf` but not `report_2024_final.pdf`), and produce:
- `/app/zpool_status.txt` — full `zpool status` output post-scrub, all devices `ONLINE`, zero errors
- `/app/output.json` — pool device count, scrub checksum errors, degraded device count, active keyfile name, SHA-256 hashes of all files in the recovered snapshot

## Approach

1. Inspected ZFS labels across all device images using `zdb` to distinguish valid members from stale/red-herring devices
2. Tested each candidate keyfile with `zfs load-key` to find the one that successfully decrypted the datasets
3. Enumerated snapshots and inspected dataset root directory contents to identify the correct rollback target
4. Imported the pool, ran a full scrub, verified zero errors and all devices `ONLINE`

The `zfs promote` restructuring added complexity — the dataset hierarchy had been reorganised after snapshots were taken, requiring careful traversal to match snapshots to their dataset roots.

## Key Techniques

ZFS label inspection (`zdb`), mirror vdev recovery, native ZFS encryption (`zfs load-key`), snapshot dataset traversal, `zfs promote` hierarchy reasoning, SHA-256 file hashing

## Environment

Isolated Docker container. Automated output validation checked JSON schema values and `zpool status` contents. Iterated until all rubric checks passed.
