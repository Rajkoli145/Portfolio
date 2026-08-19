---
title: "Binary Sensor Log Parser — Custom Protocol with CRC-16 Validation"
createdAt: "2026-07-13T10:00:00.000Z"
updatedAt: "2026-07-13T10:00:00.000Z"
project: "tbench-harbor"
tags:
  - "binary-parsing"
  - "file-formats"
  - "python"
  - "crc"
  - "protocols"
status: "published"
summary: "Implemented a full binary parser for a custom SLOG sensor log format — handling dual record layouts, stream framing markers, CRC-16 validation with a non-standard config, and mixed byte-order fields."
---

## Task

Complete the `parse_sensor_log` function in a Python converter script that parses a custom binary sensor log format (`SLOG`) and outputs structured JSON. The format specification covered:

- **8-byte header:** magic bytes `SLOG`, uint16 version, endian flag, reserved byte
- **Two record layouts:** `flat` (simple payload array) and `nested` (sub-records in network byte order)
- **Stream framing:** a `VBMP` marker switching all subsequent records from flat to nested layout mid-stream
- **CRC-16 per record:** non-standard config — polynomial `0x8005`, init `0xA503`, reflected input/output, final XOR `0x3456`
- **Truncation handling:** trailing records with insufficient bytes are silently excluded
- **Malformed record handling:** records with payload counts exceeding body length are excluded

## Approach

Parsed the binary stream sequentially using Python's `struct` module. Tracked stream state (flat vs. nested) after each `VBMP` marker. Implemented CRC-16 from scratch to the exact non-standard polynomial configuration — standard library CRC functions use different defaults and would produce wrong checksums. For nested records, switched to network byte order (`>`) for sub-record fields while keeping top-level fields little-endian.

The trickiest part: correctly detecting and excluding malformed records without crashing, especially when declared `sub_record_count` would read past the record body boundary.

## Key Techniques

Binary protocol parsing (`struct`), custom CRC-16 implementation, mixed endianness handling (LE/BE in same record), stream state machine, truncation resilience, CLI argument handling with defaults

## Environment

Isolated Docker environment. Automated test suite validated JSON output field-by-field against reference data. CRC errors and truncation cases were part of the test corpus.
