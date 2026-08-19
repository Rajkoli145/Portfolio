---
title: "T-Bench Task Engineering — Scientific Computing & Domain Science"
createdAt: "2026-07-25T10:00:00.000Z"
updatedAt: "2026-08-19T10:00:00.000Z"
project: "handshake-ai-tbench"
tags:
  - "benchmark-engineering"
  - "harbor-framework"
  - "scientific-computing"
  - "orbital-mechanics"
  - "signal-processing"
  - "python"
status: "published"
summary: "Designed and completed 2 Terminal-Bench-style scientific computing tasks — a solar-pressure three-body orbital dispersion study with STM covariance mapping and Monte Carlo propagation, and an 8-microphone acoustic source localisation problem with unknown clock offsets."
---

## Overview

Completed 2 scientific computing tasks under the Handshake AI Dynamo benchmark program, both requiring derivation of closed-form physical models from first principles and implementation of numerically precise solvers.

## Tasks Completed

### 1. Solar-Pressure Three-Body State Dispersion Study

Analysed initial-state uncertainty growth for a spacecraft in the circular restricted three-body problem (CR3BP) with solar radiation pressure in the barycentric co-rotating frame. Extended the standard CR3BP with: a lightness factor `q1` modifying only the P1 monopole gravitational term, zonal oblateness (J2), and sectoral equatorial-ellipticity (C22) harmonics fixed in the co-rotating frame.

Derived from first principles across 12 independent scenarios:
- Full pseudo-potential Ω(x, y, z) including all harmonic contributions
- Complete acceleration field with Coriolis terms and harmonic gradients
- 6×6 Jacobian A(t) (STM generator) with every harmonic term included
- Jacobi constant C using the full Ω

**Linear forecast:** State Transition Matrix (STM) covariance propagation using the derived Jacobian.

**Nonlinear forecast:** Monte Carlo ensemble propagation (up to thousands of samples per scenario) using a fixed-step RK4 integrator, converting initial states from body-centred to barycentric co-rotating coordinates before integration.

**Key techniques:** CR3BP dynamics, spherical harmonic gravity models, STM covariance mapping, RK4 numerical integration, Monte Carlo uncertainty quantification, coordinate frame transformation

---

### 2. Acoustic Source Localisation — 8-Microphone Array with Clock Offsets

Localised the (x, y) position of a sound source from recordings across 5 independent scenarios, each with 8 microphones at known positions, a known calibration pulse template, and unknown per-sensor clock offsets bounded by a given maximum magnitude.

Required robust Time Difference of Arrival (TDOA) estimation under realistic conditions: cross-correlation against the pulse template to detect arrival times, compensation for unknown bounded clock offsets across sensors, and geometric source position estimation from the TDOA measurements. Solved for all 5 scenarios producing (x, y) coordinates meeting the accuracy threshold.

**Key techniques:** Cross-correlation based TDOA estimation, clock offset handling, acoustic localisation geometry, numpy signal processing, robust estimation under bounded uncertainty

---

## Infrastructure

Both tasks built on the Harbor framework: isolated Docker environments, automated numerical output validation against reference solutions, PR-based review with Dynamo rubric checks.
