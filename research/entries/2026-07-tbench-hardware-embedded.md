---
title: "T-Bench Task Engineering — Hardware, Embedded & Low-Level Systems"
createdAt: "2026-07-18T10:00:00.000Z"
updatedAt: "2026-08-19T10:00:00.000Z"
project: "handshake-ai-tbench"
tags:
  - "benchmark-engineering"
  - "harbor-framework"
  - "hardware"
  - "verilog"
  - "rtl-design"
  - "embedded-systems"
status: "published"
summary: "Designed and completed a Terminal-Bench-style hardware task — debugging a broken dual-clock asynchronous FIFO in Verilog with programmable watermark threshold outputs and clock domain crossing logic."
---

## Overview

Completed a hardware and embedded systems task under the Handshake AI Dynamo benchmark program, requiring RTL-level debugging of a synchronisation-critical Verilog module.

## Task Completed

### Async FIFO Debugging — Dual-Clock with Programmable Watermarks

Debugged a broken dual-clock asynchronous FIFO Verilog module (`async_fifo.v`) used to safely pass data between two independent clock domains (`w_clk` and `r_clk`). The module failed under realistic operating conditions across multiple parameterised configurations.

The FIFO featured:
- Configurable `DATA_WIDTH` and `DEPTH`
- Four threshold outputs: `w_prog_full`, `r_prog_empty`, `walmost_full`, `ralmost_empty` — each driven by independent programmable threshold parameters
- Separate write-side (`w_rst_n`, `w_req`, `w_full`) and read-side (`r_rst_n`, `r_req`, `r_empty`, `r_data`) interfaces

Clock domain crossing (CDC) is the core correctness challenge: pointer values must cross clock domains without metastability. Identified and fixed bugs in the Gray code pointer synchronisation pipeline, threshold comparison logic, and reset handling across domains — without modifying the module's port list or name.

**Key techniques:** Asynchronous FIFO design, Gray code pointer encoding, two-flop CDC synchroniser, metastability analysis, programmable watermark threshold logic, Verilog RTL debugging

---

## Infrastructure

Built on the Harbor framework: isolated Docker environment with Verilog simulation toolchain, automated behavioural test suite covering read/write arbitration and threshold assertions, PR-based review with Dynamo rubric checks.
