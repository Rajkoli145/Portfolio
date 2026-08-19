---
title: "Debugging a Dual-Clock Async FIFO in Verilog — CDC & Watermark Logic"
createdAt: "2026-07-18T10:00:00.000Z"
updatedAt: "2026-07-18T10:00:00.000Z"
project: "tbench-harbor"
tags:
  - "hardware"
  - "verilog"
  - "rtl-design"
  - "embedded-systems"
  - "clock-domain-crossing"
status: "published"
summary: "Fixed a broken dual-clock asynchronous FIFO Verilog module — correcting Gray code pointer synchronisation, programmable watermark threshold logic, and reset handling across independent clock domains."
---

## Task

A dual-clock asynchronous FIFO (`async_fifo.v`) used to safely pass data between `w_clk` and `r_clk` clock domains was failing under realistic operating conditions. Fix it without modifying the module's port list or name.

Module features:
- Configurable `DATA_WIDTH` and `DEPTH`
- Four threshold outputs: `w_prog_full`, `r_prog_empty`, `walmost_full`, `ralmost_empty` — each driven by independent programmable threshold parameters
- Separate write-side and read-side interfaces with independent resets

## Root Causes Found

**1. Gray code pointer synchronisation bug**
Write-domain pointers crossing to the read domain (and vice versa) were not properly Gray-coded before synchronisation. Binary pointer values crossing clock domains cause metastability — only one-bit-at-a-time Gray transitions are safe across a two-flop synchroniser.

**2. Full/empty flag derivation error**
Full and empty flags were computed from unsynchronised binary pointers rather than the correctly synchronised Gray-coded counterparts, causing false full/empty assertions under concurrent read/write conditions.

**3. Programmable threshold comparison logic**
Watermark comparisons (`prog_full`, `prog_empty`, `almost_full`, `almost_empty`) used the wrong pointer values — mixing raw and synchronised domain pointers, producing incorrect threshold assertions.

**4. Async reset handling**
Reset de-assertion was not synchronised to the respective clock domain, creating reset-removal metastability.

## Key Techniques

Asynchronous FIFO design, Gray code encoding/decoding, two-flop CDC synchroniser, metastability analysis, programmable watermark logic, Verilog RTL debugging, simulation-driven verification

## Environment

Isolated Docker environment with Verilog simulation toolchain. Behavioural test suite exercised concurrent read/write at various fill levels, threshold boundary conditions, and reset scenarios.
