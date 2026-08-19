---
title: "T-Bench Task Engineering — File & Media Operations"
createdAt: "2026-07-12T10:00:00.000Z"
updatedAt: "2026-08-19T10:00:00.000Z"
project: "handshake-ai-tbench"
tags:
  - "benchmark-engineering"
  - "harbor-framework"
  - "binary-parsing"
  - "file-formats"
  - "python"
status: "published"
summary: "Designed and completed a Terminal-Bench-style file operations task — implementing a full binary sensor log parser with CRC-16 validation, dual record layouts, and stream framing markers."
---

## Overview

Completed a file and media operations task under the Handshake AI Dynamo benchmark program, requiring precise binary protocol implementation from a formal specification.

## Task Completed

### Binary Sensor Log Converter

Implemented the full binary parsing logic for a custom sensor log format (`SLOG`) in Python. The converter parsed binary files into structured JSON output, handling two record layouts (`flat` and `nested`), a stream-framing version-bump marker (`VBMP`) switching record structure mid-stream, truncated trailing records, and malformed records with incorrect payload counts.

**CRC-16 validation** was required for every record using a non-standard configuration: polynomial `0x8005`, initial value `0xA503`, reflected input and output, final XOR `0x3456`. Records failing the checksum were silently excluded without crashing the parser.

The nested record layout used network byte order (big-endian) for multi-byte fields inside sub-records, while the top-level record used little-endian — requiring careful byte order switching within a single parse pass.

**Output:** CLI-driven script accepting input/output paths as positional arguments with defaults, producing a validated JSON file from the binary stream.

**Key techniques:** Binary protocol parsing, CRC-16 (non-standard config), mixed byte-order handling, stream framing, truncation and malformed-record resilience, CLI argument handling

---

## Infrastructure

Built on the Harbor framework: isolated Docker environment, automated test suite validating JSON output correctness against reference data, PR-based review with Dynamo rubric checks.
