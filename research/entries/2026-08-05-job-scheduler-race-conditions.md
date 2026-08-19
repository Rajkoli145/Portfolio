---
title: "Concurrent Job Scheduler Debugging — Race Conditions & Timezone-Aware Cron"
createdAt: "2026-08-05T10:00:00.000Z"
updatedAt: "2026-08-05T10:00:00.000Z"
project: "tbench-harbor"
tags:
  - "systems"
  - "distributed-systems"
  - "python"
  - "postgresql"
  - "concurrency"
status: "published"
summary: "Debugged a Python job scheduling service backed by PostgreSQL that produced incorrect results under adversarial concurrent timing — fixing race conditions, stale reads, missed triggers, and timezone-aware cron scheduling bugs."
---

## Task

A Python job scheduling service backed by PostgreSQL handled concurrent workers, recurring cron schedules with regional timezone awareness, inter-task dependencies, and external action execution. It produced incorrect results when exercised by a fault-injection harness under adversarial timing. Fix the service without modifying the harness.

The harness produced `/app/results.json` with 7 scenario metrics: execution counts, cron next-fire times, stale read detection, missed trigger detection, and worker throughput.

## Defects Found & Fixed

**Race condition — execution count double-firing (sc_A, sc_F)**
Worker claim logic used a non-atomic read-then-write pattern. Under concurrent worker timing, two workers could both read a task as unclaimed and both execute it. Fixed by converting to a single atomic `UPDATE ... WHERE status = 'pending' RETURNING` query — ensuring only one worker claims each task.

**Stale read — isolation level too weak (sc_D)**
A status check read stale data under concurrent writes because the transaction isolation level allowed dirty or non-repeatable reads. Upgraded to `REPEATABLE READ` for the affected queries.

**Missed trigger — dependency check race (sc_E)**
A task with inter-task dependencies checked parent completion status at scheduling time rather than at execution time. A parent completing concurrently with the check could be missed. Moved the dependency evaluation inside the worker execution path.

**Timezone-aware cron next-fire miscalculation (sc_B, sc_B2, sc_C2)**
DST transitions caused next-fire times to be computed in the wrong wall-clock offset. Fixed by using aware datetime objects with the schedule's declared timezone throughout, letting `pytz`/`zoneinfo` handle DST arithmetic correctly.

**Worker throughput degradation (sc_G)**
Lock contention from overly broad table-level locking under concurrent workers. Narrowed to row-level locking with `SELECT ... FOR UPDATE SKIP LOCKED`.

## Key Techniques

PostgreSQL transaction isolation levels, atomic UPDATE-RETURNING patterns, SKIP LOCKED queue patterns, timezone-aware datetime arithmetic (DST edge cases), dependency graph evaluation, race condition diagnosis

## Environment

Isolated Docker environment with PostgreSQL. Fault-injection harness exercised adversarial timing. Results validated against exact expected values per scenario metric.
