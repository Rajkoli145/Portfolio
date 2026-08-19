---
title: "Acoustic Source Localisation — 8-Mic Array with Unknown Clock Offsets"
createdAt: "2026-08-03T10:00:00.000Z"
updatedAt: "2026-08-03T10:00:00.000Z"
project: "tbench-harbor"
tags:
  - "scientific-computing"
  - "signal-processing"
  - "acoustics"
  - "python"
  - "numpy"
status: "published"
summary: "Localised a sound source from 8-microphone outdoor array recordings across 5 independent scenarios, estimating TDOA under unknown bounded per-sensor clock offsets using cross-correlation against a known calibration pulse."
---

## Task

Localise the (x, y) position of a sound source from recordings of an 8-microphone outdoor sensor array across 5 independent scenarios. Each scenario provided:
- `(8, T)` float32 waveform array — one row per sensor
- Known sensor positions (x, y) in metres
- Sample rate, speed of sound
- Known calibration pulse template
- Per-sensor clock offset bound (magnitude only — actual offsets unknown)

## Approach

### 1. Arrival Time Estimation
Cross-correlated each sensor's recording against the calibration pulse template to detect the arrival time. The pulse is a known reference waveform, so the cross-correlation peak corresponds to the sample at which the pulse arrived at each sensor.

### 2. TDOA Computation
Computed Time Differences of Arrival (TDOA) between sensor pairs using the estimated arrival times. Unknown clock offsets introduce additive bias per sensor — bounded but unknown in sign and magnitude.

### 3. Clock Offset Handling
With per-sensor offsets bounded by `clock_offset_bound_sec`, used robust TDOA estimation — preferring sensor-pair differences that minimise offset sensitivity, or fitting a source position that is maximally consistent with the TDOA measurements under the bounded offset uncertainty.

### 4. Source Position Estimation
Given TDOA measurements and known sensor positions, solved for (x, y) geometrically. Each TDOA constrains the source to a hyperbola; the intersection of hyperbolas from multiple sensor pairs localises the source. Used least-squares fitting to find the position minimising total TDOA residual.

## Key Techniques

Cross-correlation based arrival time detection, TDOA-based hyperbolic localisation, bounded clock offset handling, least-squares geometric fitting, numpy signal processing

## Environment

Isolated Docker environment. Output JSON per scenario validated against reference (x, y) coordinates within a positional accuracy threshold.
