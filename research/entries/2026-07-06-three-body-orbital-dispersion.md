---
title: "Solar-Pressure Three-Body Orbital Dispersion — STM Covariance & Monte Carlo"
createdAt: "2026-07-25T10:00:00.000Z"
updatedAt: "2026-07-25T10:00:00.000Z"
project: "tbench-harbor"
tags:
  - "scientific-computing"
  - "orbital-mechanics"
  - "numerical-methods"
  - "python"
  - "monte-carlo"
status: "published"
summary: "Derived and implemented the full equations of motion for a spacecraft in the CR3BP with solar radiation pressure and non-spherical gravity harmonics, producing STM covariance forecasts and Monte Carlo ensemble propagations across 12 independent scenarios."
---

## Task

Analyse initial-state uncertainty growth for a spacecraft in the circular restricted three-body problem (CR3BP) with solar radiation pressure (SRP) in the barycentric co-rotating frame. Extended model: lightness factor `q1` (modifies only P1 monopole), zonal oblateness `J2`, and sectoral ellipticity `C22` harmonics fixed in the co-rotating frame. Produce results for 12 independent scenarios.

## Derivations (from first principles)

All closed forms derived independently — no expressions provided:

- **Pseudo-potential Ω(x, y, z):** centrifugal term + both point-mass attractions + SRP-modified P1 monopole + full J2 and C22 harmonic contributions with correct angular structure in the co-rotating frame
- **Acceleration field:** full gradient of Ω plus Coriolis terms (`-2ω × v`)
- **6×6 Jacobian A(t):** every partial derivative of the acceleration field, including all harmonic gradient terms — no term negligible
- **Jacobi constant C:** `2Ω(x,y,z) − (vx² + vy² + vz²)` using the full Ω

## Computations

For each scenario:
1. Converted initial state from body-centred (`P1` or `P2`) to barycentric co-rotating coordinates
2. **Linear (STM) forecast:** propagated the 6×6 STM alongside the state using the derived Jacobian A(t), mapped initial covariance to final covariance
3. **Monte Carlo forecast:** propagated an ensemble of `n_samples` perturbed initial states using fixed-step RK4 (`dt`, `n_steps` times), computed sample covariance

Scenarios varied in which harmonics were active (J2 only, C22 only, both, neither), SRP strength, mass ratio μ, and integration duration.

## Key Techniques

CR3BP dynamics, spherical harmonic gravity (zonal + sectoral), STM propagation, RK4 numerical integration, Monte Carlo uncertainty quantification, coordinate frame transformations, numpy

## Environment

Isolated Docker environment. Automated validation of JSON output files (one per scenario) against reference solutions with numerical tolerances.
