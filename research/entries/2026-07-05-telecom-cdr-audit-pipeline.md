---
title: "Telecom CDR Billing Audit — 4-Stage Data Quality Pipeline"
createdAt: "2026-07-20T10:00:00.000Z"
updatedAt: "2026-07-20T10:00:00.000Z"
project: "tbench-harbor"
tags:
  - "data-science"
  - "data-quality"
  - "pandas"
  - "parquet"
  - "python"
  - "jupyter"
status: "published"
summary: "Audited a telecommunications CDR Parquet dataset for 4 silent billing pipeline failures — mixed-scale timestamps, duplicate retransmissions, inflated tariff charges, and unrecoverable capacity counts — producing a verified clean dataset and reproducible Jupyter notebook."
---

## Task

A telecom operator's January 2025 Call Detail Record (CDR) export (Parquet file) had passed through a billing pipeline that failed silently in four ways. Audit the data, build a verified clean dataset, write `/app/cdr_quality_summary.json`, and produce an executable Jupyter notebook at `/app/cdr_quality_report.ipynb`.

## Four-Stage Pipeline

### Stage 1 — Timestamp Normalisation
Records used inconsistent timestamp scales. Normalised all to Unix seconds and excluded records outside the January 2025 UTC window.

### Stage 2 — Duplicate Retransmission Removal
Identified the correct set of fields that uniquely identify a discrete call — using too few fields collapsed distinct calls; too many missed true duplicates. Among records sharing the lowest transmission marker, the original is the one with the earliest normalised timestamp (ties broken by raw `record_ts`). Collapsed each discrete call to its original, excluding all re-sent copies.

### Stage 3 — Inflated Tariff Filtering
Computed each switch type's typical per-unit charge as the median across records with at least one billable unit. Excluded records whose per-unit charge exceeded 4× that median. Records with zero billable units were exempt and excluded from the median calculation.

### Stage 4 — Capacity Count Recovery
Recovered missing capacity counts from a record's own fields where derivable (rounding to nearest positive integer). Excluded records where recovery yielded zero or was not possible.

## Output

- `cdr_quality_summary.json`: verified billed revenue, switches by utilisation, per-stage rejection counts, channel-level billed revenue
- `cdr_quality_report.ipynb`: fully executable notebook reproducing all results

## Key Techniques

Parquet I/O, multi-stage data quality pipelines, duplicate detection via field-set identification, median-based outlier filtering, conditional imputation, Jupyter notebook engineering, pandas

## Environment

Isolated Docker environment. Automated JSON schema validation with exact numeric value checks. Notebook must execute end-to-end without errors.
