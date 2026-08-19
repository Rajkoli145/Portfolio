---
title: "T-Bench Task Engineering — Data Science & Reporting"
createdAt: "2026-07-20T10:00:00.000Z"
updatedAt: "2026-08-19T10:00:00.000Z"
project: "handshake-ai-tbench"
tags:
  - "benchmark-engineering"
  - "harbor-framework"
  - "data-science"
  - "data-quality"
  - "python"
  - "pandas"
status: "published"
summary: "Designed and completed a Terminal-Bench-style data science task — auditing a telecommunications CDR Parquet dataset for 4 silent billing pipeline failures and producing a verified clean dataset with a reproducible Jupyter notebook."
---

## Overview

Completed a data science and reporting task under the Handshake AI Dynamo benchmark program, requiring multi-stage data quality reasoning over a real-world-shaped telecom billing dataset.

## Task Completed

### Telecom CDR Billing Audit Pipeline

Audited a telecommunications Call Detail Record (CDR) export for January 2025 stored as a Parquet file. The billing pipeline had failed silently in four independent ways, requiring detection and remediation in order:

1. **Mixed-scale timestamps** — Normalised records carrying timestamps on inconsistent scales to Unix seconds, excluding records outside the January 2025 UTC window.

2. **Duplicate retransmissions** — Identified the correct set of fields that uniquely identifies a discrete call (using too few fields collapsed distinct calls; too many missed true duplicates). Among records sharing the lowest transmission marker, selected the original as the earliest normalised timestamp, breaking ties by raw `record_ts`. Excluded all re-sent copies.

3. **Inflated tariff charges** — Computed each switch type's typical per-unit charge as the median across records with at least one billable unit. Excluded records whose per-unit charge exceeded 4× that median.

4. **Missing capacity counts** — Recovered missing capacity counts from record fields where derivable (rounding to nearest positive integer); excluded records where recovery was not possible or yielded zero.

**Output:** `/app/cdr_quality_summary.json` with verified billed revenue, switches by utilisation, per-defect rejection counts, and channel-level billed revenue. Plus a reproducible executable Jupyter Notebook (`cdr_quality_report.ipynb`).

**Key techniques:** Parquet I/O, multi-stage data quality pipelines, duplicate detection via key identification, median-based outlier filtering, conditional imputation, Jupyter notebook engineering

---

## Infrastructure

Built on the Harbor framework: isolated Docker environment, automated JSON schema validation and value checks, PR-based review with Dynamo rubric checks.
